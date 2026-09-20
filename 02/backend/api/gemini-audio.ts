const LANGUAGE_NAMES: Record<string,string> = {
  bg:'Bulgarian',hr:'Croatian',cs:'Czech',da:'Danish',nl:'Dutch',en:'English',et:'Estonian',fi:'Finnish',fr:'French',de:'German',el:'Greek',hu:'Hungarian',ga:'Irish',it:'Italian',lv:'Latvian',lt:'Lithuanian',mt:'Maltese',pl:'Polish',pt:'Portuguese',ro:'Romanian',sk:'Slovak',sl:'Slovenian',es:'Spanish',sv:'Swedish'
};

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.8-flash';
const ALLOWED_ORIGINS = new Set(['https://foxprof.club','https://www.foxprof.club']);

type AudioRequest = {
  audioBase64?: string;
  mimeType?: string;
  source?: string;
  target?: string;
};

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '';
  return {
    'Cache-Control': 'no-store',
    ...(ALLOWED_ORIGINS.has(origin) ? {'Access-Control-Allow-Origin': origin, 'Vary': 'Origin'} : {}),
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400'
  };
}

function json(body: unknown, status: number, request: Request, extra?: HeadersInit): Response {
  return Response.json(body, {status, headers: {...corsHeaders(request), ...(extra || {})}});
}

function key(): string {
  const value = process.env.GEMINI_FREE_API_KEY || process.env.GEMINI_API_KEY;
  if (!value) throw new Error('Gemini API key is not configured in Vercel');
  return value;
}

function model(): string {
  return process.env.GEMINI_FREE_MODEL || DEFAULT_MODEL;
}

function extractText(data: any): string {
  return String(data?.candidates?.[0]?.content?.parts?.map((part: any) => part?.text || '').join('') || '').trim();
}

function parseTranslation(text: string): { transcript: string; translatedText: string } | null {
  try {
    const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(clean);
    const transcript = String(parsed?.transcript || '').trim();
    const translatedText = String(parsed?.translatedText || parsed?.translation || '').trim();
    if (transcript && translatedText) return {transcript, translatedText};
  } catch {}
  return null;
}

export async function OPTIONS(request: Request): Promise<Response> {
  return new Response(null, {status: 204, headers: corsHeaders(request)});
}

export async function GET(request: Request): Promise<Response> {
  return json({
    status: 'ok',
    service: 'FOX Gemini Audio Compatibility API',
    model: model(),
    keyConfigured: Boolean(process.env.GEMINI_FREE_API_KEY || process.env.GEMINI_API_KEY)
  }, 200, request);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as AudioRequest;
    const audioBase64 = String(body?.audioBase64 || '').trim();
    const mimeType = String(body?.mimeType || 'audio/webm').trim();
    const source = String(body?.source || '').trim().toLowerCase();
    const target = String(body?.target || '').trim().toLowerCase();

    if (!audioBase64) return json({error: 'audioBase64 is required'}, 400, request);
    if (!LANGUAGE_NAMES[source] || !LANGUAGE_NAMES[target] || source === target) {
      return json({error: 'Unsupported or identical language selection'}, 400, request);
    }
    if (audioBase64.length > 8_000_000) return json({error: 'Audio payload is too large'}, 413, request);

    const selectedModel = model();
    const upstream = await fetch(`${GEMINI_API}/${selectedModel}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key()
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `You are a professional live interpreter. Listen to this ${LANGUAGE_NAMES[source]} speech. Return ONLY valid JSON with exactly two string fields: transcript and translatedText. transcript must contain the spoken ${LANGUAGE_NAMES[source]} words. translatedText must contain the natural ${LANGUAGE_NAMES[target]} translation. Do not add commentary, markdown, labels, or extra fields.`
            },
            {
              inlineData: {
                mimeType,
                data: audioBase64
              }
            }
          ]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      })
    });

    const raw = await upstream.text();
    if (!upstream.ok) {
      const retry = upstream.status === 429 ? 30 : upstream.status === 503 ? 3 : undefined;
      return json({
        error: `Gemini HTTP ${upstream.status}`,
        code: upstream.status === 402 ? 'FREE_TIER_KEY_REQUIRED' : upstream.status === 429 ? 'QUOTA_EXCEEDED' : upstream.status === 503 ? 'MODEL_BUSY' : 'GEMINI_ERROR',
        detail: raw.slice(0, 600),
        ...(retry ? {retryAfterSeconds: retry} : {})
      }, upstream.status === 402 ? 402 : upstream.status === 429 ? 429 : upstream.status === 503 ? 503 : 502, request, retry ? {'Retry-After': String(retry)} : undefined);
    }

    const data = JSON.parse(raw);
    const parsed = parseTranslation(extractText(data));
    if (!parsed) return json({error: 'No usable speech translation returned by Gemini'}, 422, request);

    return json({
      transcript: parsed.transcript,
      translation: parsed.translatedText,
      translatedText: parsed.translatedText,
      source,
      target,
      model: selectedModel,
      keySource: process.env.GEMINI_FREE_API_KEY ? 'GEMINI_FREE_API_KEY' : 'GEMINI_API_KEY'
    }, 200, request);
  } catch (error: any) {
    console.error('gemini-audio failed', error);
    return json({error: error?.message || 'Gemini audio translation failed'}, 500, request);
  }
}
