export function GET(): Response {
  const freeKeyConfigured = Boolean(process.env.GEMINI_FREE_API_KEY);
  const fallbackKeyConfigured = Boolean(process.env.GEMINI_API_KEY);
  const geminiConfigured = freeKeyConfigured || fallbackKeyConfigured;
  const model = process.env.GEMINI_FREE_MODEL || 'gemini-3.8-flash';
  const healthy = geminiConfigured;

  return Response.json(
    {
      status: healthy ? 'ok' : 'error',
      service: 'FOX Live Translator API',
      version: '0.1.4-free-tier',
      geminiConfigured,
      freeKeyConfigured,
      fallbackKeyConfigured,
      model,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
