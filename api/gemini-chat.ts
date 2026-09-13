type Body = {
  message?: string;
  previousInteractionId?: string | null;
  systemInstruction?: string;
  thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high';
};

type Req = { method?: string; body?: Body };
type Res = {
  status: (n: number) => Res;
  setHeader?: (n: string, v: string) => Res;
  json: (b: unknown) => void;
};

const PROXY_URL = 'https://wdfox-gemini-api.vercel.app/api/gemini-chat';

const cors = (res: Res) => {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader?.('Cache-Control', 'no-store');
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
    const message = String(body.message || '').trim();
    if (!message) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const env = (globalThis as any).process?.env || {};
    const key = env.GEMINI_API_KEY;

    // Prefer the local server key when it exists. If the current deployment
    // has no key, use the dedicated FOX Gemini gateway instead of exposing
    // the configuration error to the user.
    if (!key) {
      const proxy = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          previousInteractionId: body.previousInteractionId || null,
          systemInstruction: body.systemInstruction || undefined,
          thinkingLevel: body.thinkingLevel || 'low',
        }),
      });

      const raw = await proxy.text();
      let data: any = null;
      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }

      if (!proxy.ok) {
        console.error('FOX Gemini gateway failed', proxy.status, raw.slice(0, 1000));
        res.status(502).json({ error: 'Prekladová služba je momentálne nedostupná.' });
        return;
      }

      if (!data?.text) {
        res.status(502).json({ error: 'Prekladová služba nevrátila výsledok.' });
        return;
      }

      res.status(200).json({
        text: String(data.text),
        interactionId: data.interactionId || null,
        previousInteractionId: data.previousInteractionId || data.interactionId || null,
        model: data.model || 'FOX Gemini gateway',
      });
      return;
    }

    const model = env.GEMINI_MODEL || 'gemini-3.8-flash';
    const payload: Record<string, unknown> = {
      model,
      input: message,
      store: true,
      generation_config: {
        thinking_level: body.thinkingLevel || 'low',
      },
    };

    if (body.previousInteractionId) payload.previous_interaction_id = String(body.previousInteractionId);
    if (body.systemInstruction) payload.system_instruction = String(body.systemInstruction);

    const upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify(payload),
    });

    const raw = await upstream.text();
    if (!upstream.ok) {
      res.status(502).json({ error: `Gemini HTTP ${upstream.status}`, detail: raw.slice(0, 2000) });
      return;
    }

    const data: any = JSON.parse(raw);
    const outputText = String(
      data?.output_text ||
      data?.steps?.filter((step: any) => step?.type === 'model_output')?.flatMap((step: any) => step?.content || [])?.map((part: any) => part?.text || '')?.join('') ||
      ''
    ).trim();

    if (!outputText) {
      res.status(502).json({ error: 'Gemini returned no text output', interactionId: data?.id || null, status: data?.status || null });
      return;
    }

    res.status(200).json({
      text: outputText,
      interactionId: data?.id || null,
      previousInteractionId: data?.id || null,
      model,
    });
  } catch (e: any) {
    console.error('gemini-chat', e);
    res.status(500).json({ error: 'Prekladová služba je momentálne nedostupná.' });
  }
}
