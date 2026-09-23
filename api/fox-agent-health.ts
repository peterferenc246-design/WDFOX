type Req = { method?: string; query?: Record<string, string | string[] | undefined> };
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
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader?.('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).json({});
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const env = (globalThis as any).process?.env || {};
  const apiKey = String(env.OPENAI_API_KEY || '').trim();
  const checks = {
    openaiApiKey: Boolean(apiKey),
    githubAppId: Boolean(String(env.FOX_GITHUB_APP_ID || '').trim()),
    githubInstallationId: Boolean(String(env.FOX_GITHUB_INSTALLATION_ID || '').trim()),
    githubPrivateKey: Boolean(String(env.FOX_GITHUB_PRIVATE_KEY || '').trim()),
  };

  const wantsProbe = String(req.query?.probe || '') === '1';
  if (!wantsProbe) {
    res.status(200).json({
      ok: Object.values(checks).every(Boolean),
      service: 'FOX-Agent-TEST-WDFOX',
      environment: 'preview',
      checks,
    });
    return;
  }

  if (!apiKey) {
    res.status(503).json({
      ok: false,
      service: 'FOX-Agent-TEST-WDFOX',
      environment: 'preview',
      checks,
      probe: { ok: false, stage: 'env', error: 'OPENAI_API_KEY is not configured' },
    });
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
        service: 'FOX-Agent-TEST-WDFOX',
        environment: 'preview',
        checks,
        probe: {
          ok: false,
          stage: 'openai',
          model,
          status: upstream.status,
          error: data?.error?.message || `OpenAI HTTP ${upstream.status}`,
        },
      });
      return;
    }

    const output = extractOutputText(data);
    const probeOk = output === 'FOX_AGENT_OK';

    res.status(probeOk ? 200 : 502).json({
      ok: Object.values(checks).every(Boolean) && probeOk,
      service: 'FOX-Agent-TEST-WDFOX',
      environment: 'preview',
      checks,
      probe: {
        ok: probeOk,
        stage: 'complete',
        model,
        responseId: data?.id || null,
        output,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      service: 'FOX-Agent-TEST-WDFOX',
      environment: 'preview',
      checks,
      probe: {
        ok: false,
        stage: 'runtime',
        model,
        error: error?.message || 'Runtime self-test failed',
      },
    });
  }
}
