type TranslateRequest = {
  text?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
};

type VercelLikeRequest = {
  method?: string;
  body?: TranslateRequest;
};

type VercelLikeResponse = {
  status: (code: number) => VercelLikeResponse;
  setHeader?: (name: string, value: string) => VercelLikeResponse;
  json: (body: unknown) => void;
};

const sendJson = (res: VercelLikeResponse, status: number, body: unknown) => {
  res.status(status).json(body);
};

const cors = (res: VercelLikeResponse) => {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader?.('Access-Control-Max-Age', '86400');
};

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse) {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).json({});
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const { text, sourceLanguage, targetLanguage } = req.body || {};
    if (!text || !sourceLanguage || !targetLanguage) {
      sendJson(res, 400, { error: 'text, sourceLanguage and targetLanguage are required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      sendJson(res, 500, { error: 'GEMINI_API_KEY is not configured' });
      return;
    }

    const model = process.env.TRANSLATION_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const prompt = `You are a real-time translator. Translate the user's spoken sentence from ${sourceLanguage} to ${targetLanguage}. Return ONLY valid JSON with exactly two string fields: transcript and translatedText. Preserve meaning and tone. Do not explain anything. If the text is unclear, return the best faithful translation.\n\nTEXT:\n${String(text).slice(0, 4000)}`;

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
        }),
      },
    );

    const raw = await upstream.text();
    if (!upstream.ok) {
      sendJson(res, 502, { error: `Gemini HTTP ${upstream.status}`, detail: raw.slice(0, 1000) });
      return;
    }

    const data: any = JSON.parse(raw);
    const candidate =
      data?.candidates?.[0]?.content?.parts?.map((part: any) => part?.text || '').join('') || '';

    let parsed: { transcript?: string; translatedText?: string };
    try {
      parsed = JSON.parse(candidate);
    } catch {
      parsed = { transcript: String(text), translatedText: candidate.trim() };
    }

    sendJson(res, 200, {
      transcript: parsed.transcript || String(text),
      translatedText: parsed.translatedText || '',
    });
  } catch (error: any) {
    console.error('translate-text', error);
    sendJson(res, 500, { error: error?.message || 'Translation failed' });
  }
}
