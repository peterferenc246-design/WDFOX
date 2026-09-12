import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { text, sourceLanguage, targetLanguage } = req.body || {};
    if (!text || !sourceLanguage || !targetLanguage) return res.status(400).json({ error: 'text, sourceLanguage and targetLanguage are required' });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    const model = process.env.TRANSLATION_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const prompt = `You are a real-time translator. Translate the user's spoken sentence from ${sourceLanguage} to ${targetLanguage}. Return ONLY valid JSON with exactly two string fields: transcript and translatedText. Preserve meaning and tone. Do not explain anything. If the text is unclear, return the best faithful translation.\n\nTEXT:\n${String(text).slice(0, 4000)}`;
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.1 } })
    });
    const raw = await r.text();
    if (!r.ok) return res.status(502).json({ error: `Gemini HTTP ${r.status}`, detail: raw.slice(0, 1000) });
    const data = JSON.parse(raw);
    const candidate = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('') || '';
    let parsed: any;
    try { parsed = JSON.parse(candidate); } catch { parsed = { transcript: String(text), translatedText: candidate.trim() }; }
    return res.status(200).json({ transcript: parsed.transcript || String(text), translatedText: parsed.translatedText || '' });
  } catch (e: any) {
    console.error('translate-text', e);
    return res.status(500).json({ error: e?.message || 'Translation failed' });
  }
}
