type Req = { method?: string };
type Res = {
  status: (n: number) => Res;
  setHeader?: (name: string, value: string) => Res;
  json: (body: unknown) => void;
};

function extractOutputText(data: any): string {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  const parts: string[] = [];
  for (const item of Array.isArray(data?.output) ? data.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('').trim();
}

export default async function handler(req: Req, res: Res) {
  res.setHeader?.('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const env = (globalThis as any).process?.env || {};
  const apiKey = String(env.OPENAI_API_KEY || '').trim();
  const model = String(env.OPENAI_MODEL || 'gpt-5.6-terra').trim();

  if (!apiKey) {
    res.status(503).json({ ok: false, stage: 'env', error: 'OPENAI_API_KEY is not configured' });
    return;
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: 'You are FOX Agent runtime self-test. Reply with exactly FOX_AGENT_OK and nothing else.',
        input: 'Run the runtime health test now.',
        store: false,
        max_output_tokens: 32,
      }),
    });

    const raw = await upstream.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch { data = null; }

    if (!upstream.ok) {
      res.status(502).json({
        ok: false,
        stage: 'openai',
        model,
        status: upstream.status,
        error: data?.error?.message || `OpenAI HTTP ${upstream.status}`,
      });
      return;
    }

    const output = extractOutputText(data);
    const ok = output === 'FOX_AGENT_OK';

    res.status(ok ? 200 : 502).json({
      ok,
      stage: 'complete',
      model,
      responseId: data?.id || null,
      output,
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      stage: 'runtime',
      model,
      error: error?.message || 'Runtime self-test failed',
    });
  }
}
