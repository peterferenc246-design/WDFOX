type Client = {
  id: string;
  name: string;
  company: string;
  language: string;
};

type Body = {
  command?: string;
  clients?: Client[];
};

type Req = { method?: string; body?: Body };
type Res = {
  status: (n: number) => Res;
  setHeader?: (name: string, value: string) => Res;
  json: (body: unknown) => void;
};

const cors = (res: Res) => {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader?.('Cache-Control', 'no-store');
};

const SYSTEM_INSTRUCTIONS = `
You are FOX Agent, an AI operations agent for WebDizainFOX.
For this TEST endpoint you only PREPARE a notification plan. You do not send messages and you do not perform external side effects.

Interpret the owner's natural-language command. You may only select recipients from the supplied client registry. Never invent a client.
Translate each outgoing message naturally into the recipient's language.
Supported channels are web, push, email. If no channel is specified, use web.
If the instruction is ambiguous, has no valid recipient, or references somebody outside the registry, ask for clarification.

Return ONLY valid JSON with exactly this shape:
{
  "action": "send_notifications" | "clarify",
  "summary": "short explanation in Slovak",
  "clarificationQuestion": "question in Slovak or empty string",
  "channels": ["web" | "push" | "email"],
  "recipients": [
    {
      "id": "an id from the supplied registry",
      "message": "message translated to this recipient's language"
    }
  ]
}
`;

function extractOutputText(data: any): string {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const parts: string[] = [];
  for (const item of Array.isArray(data?.output) ? data.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('').trim();
}

function cleanJson(value: string) {
  const text = String(value || '').trim();
  const unfenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const first = unfenced.indexOf('{');
  const last = unfenced.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) {
    throw new Error('OpenAI did not return a JSON plan.');
  }
  return JSON.parse(unfenced.slice(first, last + 1));
}

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

  const command = String(req.body?.command || '').trim();
  const clients = Array.isArray(req.body?.clients) ? req.body!.clients! : [];

  if (!command) {
    res.status(400).json({ error: 'command is required' });
    return;
  }

  if (!clients.length) {
    res.status(400).json({ error: 'clients registry is required' });
    return;
  }

  const env = (globalThis as any).process?.env || {};
  const apiKey = String(env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    res.status(503).json({ error: 'OPENAI_API_KEY is not configured' });
    return;
  }

  const model = String(env.OPENAI_MODEL || 'gpt-5.6-terra').trim();

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_INSTRUCTIONS,
        input: `OWNER COMMAND:\n${command}\n\nCLIENT REGISTRY:\n${JSON.stringify(clients)}`,
        store: false,
      }),
    });

    const raw = await upstream.text();
    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }

    if (!upstream.ok) {
      console.error('FOX Agent OpenAI error', upstream.status, raw.slice(0, 2000));
      res.status(502).json({
        error: data?.error?.message || `OpenAI HTTP ${upstream.status}`,
      });
      return;
    }

    const outputText = extractOutputText(data);
    const plan = cleanJson(outputText);

    res.status(200).json({
      plan,
      model,
      responseId: data?.id || null,
    });
  } catch (error: any) {
    console.error('fox-agent-plan', error);
    res.status(500).json({
      error: error?.message || 'FOX Agent planning failed',
    });
  }
}
