type Body = {
  audioBase64?: string;
  mimeType?: string;
  source?: string;
  target?: string;
};

type Req = { method?: string; body?: Body };
type Res = {
  status: (n: number) => Res;
  setHeader?: (n: string, v: string) => Res;
  json: (b: unknown) => void;
};

const cors = (res: Res) => {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader?.('Cache-Control', 'no-store');
};

const names: Record<string, string> = {
  bg:'Bulgarian', hr:'Croatian', cs:'Czech', da:'Danish', nl:'Dutch', en:'English', et:'Estonian', fi:'Finnish', fr:'French', de:'German', el:'Greek', hu:'Hungarian', ga:'Irish', it:'Italian', lv:'Latvian', lt:'Lithuanian', mt:'Maltese', pl:'Polish', pt:'Portuguese', ro:'Romanian', sk:'Slovak', sl:'Slovenian', es:'Spanish', sv:'Swedish'
};

export default async function handler(req: Req, res: Res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).json({});
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body || {};
    const audioBase64 = String(body.audioBase64 || '').trim();
    const mimeType = String(body.mimeType || 'audio/webm').split(';')[0].trim();
    const source = String(body.source || 'de');
    const target = String(body.target || 'sk');
    if (!audioBase64) {
      res.status(400).json({ error: 'audioBase64 is required' });
      return;
    }

    const env = (globalThis as any).process?.env || {};
    const key = env.GEMINI_API_KEY;
    if (!key) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the Gemini audio server.' });
      return;
    }

    const sourceName = names[source] || source;
    const targetName = names[target] || target;
    const model = env.GEMINI_AUDIO_MODEL || 'gemini-3.8-flash';
    const prompt = `You are the original Google Gemini speech interpreter for FOX LIVE TRANSLATOR. Listen to the supplied audio and process the spoken sentence.

1. Transcribe exactly what was spoken in ${sourceName}. Return the original spoken meaning in clean, natural ${sourceName} text. Do not translate the transcript.
2. Translate that transcript into ${targetName}.
3. Return ONLY valid JSON with exactly two string fields: transcript and translation.
4. Do not invent words. Preserve names, numbers, dates, negation, tense, politeness and tone.
5. If the audio contains no intelligible speech, return empty strings.

Source language: ${sourceName}
Target language: ${targetName}`;

    const payload = {
      model,
      input: [
        { type: 'text', text: prompt },
        { type: 'audio', data: audioBase64, mime_type: mimeType },
      ],
      generation_config: { thinking_level: 'low' },
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: {
          type: 'object',
          properties: { transcript: { type: 'string' }, translation: { type: 'string' } },
          required: ['transcript', 'translation'],
        },
      },
    };

    const upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
        'Api-Revision': '2026-05-20',
      },
      body: JSON.stringify(payload),
    });

    const raw = await upstream.text();
    if (!upstream.ok) {
      console.error('Gemini audio upstream failed', upstream.status, raw.slice(0, 1500));
      res.status(502).json({ error: `Gemini audio HTTP ${upstream.status}` });
      return;
    }

    const data: any = JSON.parse(raw);
    const outputText = String(
      data?.output_text ||
      data?.steps?.filter((step: any) => step?.type === 'model_output')?.flatMap((step: any) => step?.content || [])?.map((part: any) => part?.text || '')?.join('') ||
      ''
    ).trim();
    if (!outputText) {
      res.status(502).json({ error: 'Gemini returned no audio text.' });
      return;
    }

    let result: any;
    try {
      result = JSON.parse(outputText);
    } catch {
      const match = outputText.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : null;
    }
    if (!result || typeof result.transcript !== 'string' || typeof result.translation !== 'string') {
      res.status(502).json({ error: 'Gemini returned an invalid audio translation.' });
      return;
    }

    res.status(200).json({
      transcript: result.transcript.trim(),
      translation: result.translation.trim(),
      model,
      interactionId: data?.id || null,
    });
  } catch (e: any) {
    console.error('gemini-audio', e);
    res.status(500).json({ error: 'Gemini audio service is currently unavailable.' });
  }
}
