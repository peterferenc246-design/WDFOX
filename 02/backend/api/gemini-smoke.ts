export async function GET(): Promise<Response> {
  const key = process.env.GEMINI_FREE_API_KEY || process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_FREE_MODEL || 'gemini-3.8-flash';

  if (!key) {
    return Response.json({ ok: false, error: 'No Gemini key configured', model }, { status: 503 });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Return exactly: FOX_GEMINI_OK' }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 16 },
      }),
    });

    const raw = await response.text();
    if (!response.ok) {
      return Response.json({ ok: false, upstreamStatus: response.status, model, detail: raw.slice(0, 400) }, { status: 502 });
    }

    const data: any = JSON.parse(raw);
    const text = String(data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('') || '').trim();
    return Response.json({
      ok: text.includes('FOX_GEMINI_OK'),
      model,
      keySource: process.env.GEMINI_FREE_API_KEY ? 'GEMINI_FREE_API_KEY' : 'GEMINI_API_KEY',
      text,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return Response.json({ ok: false, model, error: error?.message || 'Smoke test failed' }, { status: 500 });
  }
}
