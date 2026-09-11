export default function handler(request: Request): Response {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  return Response.json(
    {
      status: 'ok',
      service: 'FOX Live Translator API',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
