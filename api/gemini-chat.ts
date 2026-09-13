type Message = { role?: string; content?: string };
type Body = {
  message?: string;
  previousInteractionId?: string | null;
  systemInstruction?: string;
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
    const previousInteractionId = body.previousInteractionId ? String(body.previousInteractionId) : undefined;
    if (!message) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const env = (globalThis as any).process?.env || {};
    const key = env.GEMINI_API_KEY;
    if (!key) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      return;
    }

    const model = env.GEMINI_MODEL || 'gemini-3.8-flash';
    const payload: Record<string, unknown> = {
      model,
      input: message,
      store: true,
    };

    if (previousInteractionId) payload.previous_interaction_id = previousInteractionId;
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
      res.status(502).json({ error: 'Gemini returned no text output', interactionId: data?.id || null });
      return;
    }

    // The client MUST persist this ID and send it as previousInteractionId on the next turn.
    res.status(200).json({
      text: outputText,
      interactionId: data?.id || null,
      previousInteractionId: data?.id || null,
      model,
    });
  } catch (e: any) {
    console.error('gemini-chat', e);
    res.status(500).json({ error: e?.message || 'Gemini chat failed' });
  }
}
