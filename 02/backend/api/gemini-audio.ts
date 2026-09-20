const ALLOWED_ORIGINS = new Set(['https://foxprof.club','https://www.foxprof.club']);

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '';
  return {
    'Cache-Control': 'no-store',
    ...(ALLOWED_ORIGINS.has(origin) ? {'Access-Control-Allow-Origin': origin, 'Vary': 'Origin'} : {}),
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400'
  };
}

function retired(request: Request): Response {
  return Response.json({
    error: 'LEGACY_GEMINI_AUDIO_DISABLED',
    code: 'LIVE_TRANSLATE_ONLY',
    message: 'Legacy Gemini generateContent audio translation is disabled. FOX Communicator uses Gemini Live Translate.'
  }, {
    status: 410,
    headers: corsHeaders(request)
  });
}

export async function OPTIONS(request: Request): Promise<Response> {
  return new Response(null, {status: 204, headers: corsHeaders(request)});
}

export async function GET(request: Request): Promise<Response> {
  return retired(request);
}

export async function POST(request: Request): Promise<Response> {
  // Intentionally retired: never call gemini-3.8-flash from the communicator again.
  return retired(request);
}
