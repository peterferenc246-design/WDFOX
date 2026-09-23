type Req = { method?: string };
type Res = {
  status: (n: number) => Res;
  setHeader?: (name: string, value: string) => Res;
  json: (body: unknown) => void;
};

export default function handler(req: Req, res: Res) {
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
  const checks = {
    openaiApiKey: Boolean(String(env.OPENAI_API_KEY || '').trim()),
    githubAppId: Boolean(String(env.FOX_GITHUB_APP_ID || '').trim()),
    githubInstallationId: Boolean(String(env.FOX_GITHUB_INSTALLATION_ID || '').trim()),
    githubPrivateKey: Boolean(String(env.FOX_GITHUB_PRIVATE_KEY || '').trim()),
  };

  res.status(200).json({
    ok: Object.values(checks).every(Boolean),
    service: 'FOX-Agent-TEST-WDFOX',
    environment: 'preview',
    checks,
  });
}
