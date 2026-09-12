export function GET(): Response {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
  const healthy = geminiConfigured;

  return Response.json(
    {
      status: healthy ? 'ok' : 'error',
      service: 'FOX Live Translator API',
      version: '0.1.3',
      geminiConfigured,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
