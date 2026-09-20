const MODEL = 'gemini-3.5-live-translate-preview';
const TOKEN_API = 'https://generativelanguage.googleapis.com/v1beta/auth_tokens';
const ALLOWED_ORIGINS = new Set(['https://foxprof.club','https://www.foxprof.club']);
const TARGET_CODES: Record<string,string> = {
  bg:'bg',hr:'hr',cs:'cs',da:'da',nl:'nl',en:'en',et:'et',fi:'fi',fr:'fr',de:'de',el:'el',hu:'hu',ga:'ga',it:'it',lv:'lv',lt:'lt',mt:'mt',pl:'pl',pt:'pt-PT',ro:'ro',sk:'sk',sl:'sl',es:'es',sv:'sv'
};

function cors(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '';
  return {
    'Cache-Control':'no-store',
    ...(ALLOWED_ORIGINS.has(origin) ? {'Access-Control-Allow-Origin':origin,'Vary':'Origin'} : {}),
    'Access-Control-Allow-Methods':'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers':'Content-Type, Accept',
    'Access-Control-Max-Age':'86400'
  };
}

function reply(body: unknown, status: number, request: Request): Response {
  return Response.json(body,{status,headers:cors(request)});
}

function apiKey(): string {
  const value = process.env.GEMINI_FREE_API_KEY || process.env.GEMINI_API_KEY;
  if (!value) throw new Error('Gemini API key is not configured in Vercel');
  return value;
}

export async function OPTIONS(request: Request): Promise<Response> {
  return new Response(null,{status:204,headers:cors(request)});
}

export async function GET(request: Request): Promise<Response> {
  return reply({status:'ok',service:'FOX Gemini Live Translate token service',model:MODEL,keyConfigured:Boolean(process.env.GEMINI_FREE_API_KEY || process.env.GEMINI_API_KEY)},200,request);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({})) as {target?: string};
    const requested = String(body?.target || '').trim().toLowerCase();
    const targetLanguageCode = TARGET_CODES[requested];
    if (!targetLanguageCode) return reply({error:'Unsupported target language'},400,request);

    const now = Date.now();
    const expireTime = new Date(now + 20 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(now + 60 * 1000).toISOString();
    const config = {
      responseModalities:['AUDIO'],
      inputAudioTranscription:{},
      outputAudioTranscription:{},
      translationConfig:{
        targetLanguageCode,
        echoTargetLanguage:false
      }
    };

    const upstream = await fetch(TOKEN_API,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-goog-api-key':apiKey()},
      body:JSON.stringify({
        uses:1,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints:{
          model:`models/${MODEL}`,
          config
        }
      })
    });

    const raw = await upstream.text();
    if (!upstream.ok) {
      return reply({error:`Gemini token HTTP ${upstream.status}`,detail:raw.slice(0,700)},upstream.status,request);
    }

    const data = JSON.parse(raw);
    const token = String(data?.name || '').trim();
    if (!token) return reply({error:'Gemini did not return an ephemeral token'},502,request);

    return reply({token,model:MODEL,target:targetLanguageCode,expireTime,newSessionExpireTime,config},200,request);
  } catch (error: any) {
    console.error('live-token failed',error);
    return reply({error:error?.message || 'Failed to create Gemini Live token'},500,request);
  }
}
