export function GET(): Response {
  const aiGatewayConfigured = Boolean(process.env.AI_GATEWAY_API_KEY);
  const healthy = aiGatewayConfigured;

  return Response.json(
    {
      status: healthy ? 'ok' : 'error',
      service: 'FOX Live Translator API',
      version: '0.1.2',
      aiGatewayConfigured,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
