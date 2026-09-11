export default function handler(request: Request): Response {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const aiGatewayConfigured = Boolean(process.env.AI_GATEWAY_API_KEY);
  const healthy = aiGatewayConfigured;

  return Response.json(
    {
      status: healthy ? 'ok' : 'error',
      service: 'FOX Live Translator API',
      version: '0.1.1',
      aiGatewayConfigured,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
