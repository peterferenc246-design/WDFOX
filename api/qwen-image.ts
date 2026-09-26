type Body = {
  model?: 'qwen-2512' | 'qwen-3';
  prompt?: string;
  negativePrompt?: string;
  imageSize?: string;
  width?: number;
  height?: number;
  outputFormat?: 'png' | 'jpeg' | 'webp';
  seed?: number;
};

type Req = { method?: string; body?: Body; headers?: Record<string, string | string[] | undefined> };
type Res = {
  status: (n: number) => Res;
  setHeader?: (n: string, v: string) => Res;
  json: (b: unknown) => void;
};

const MODEL_2512 = 'fal-ai/qwen-image-2512';
const MODEL_3 = 'alibaba/qwen-image-3/text-to-image';

const cors = (res: Res) => {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader?.('Cache-Control', 'no-store');
};

const getClientIp = (req: Req) => {
  const forwarded = req.headers?.['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return String(value || 'unknown').split(',')[0].trim();
};

// Lightweight per-instance protection against accidental API-cost spikes.
// Vercel instances are independent, so this is not a replacement for a
// provider-level quota/rate limit.
const recentRequests = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_MINUTE = 4;

const rateLimited = (ip: string) => {
  const now = Date.now();
  const recent = (recentRequests.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_MINUTE) {
    recentRequests.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentRequests.set(ip, recent);
  return false;
};

export default async function handler(req: Req, res: Res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).json({});
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (rateLimited(getClientIp(req))) {
    res.status(429).json({ error: 'Príliš veľa požiadaviek. Skús znova o chvíľu.' });
    return;
  }

  const env = (globalThis as any).process?.env || {};
  const falKey = env.FAL_KEY;

  if (!falKey) {
    res.status(503).json({
      error: 'FAL_KEY nie je nakonfigurovaný vo Vercel Environment Variables.',
      code: 'FAL_KEY_MISSING',
    });
    return;
  }

  try {
    const body = req.body || {};
    const prompt = String(body.prompt || '').trim();

    if (!prompt) {
      res.status(400).json({ error: 'prompt is required' });
      return;
    }

    if (prompt.length > 5000) {
      res.status(400).json({ error: 'prompt je príliš dlhý (max. 5000 znakov).' });
      return;
    }

    const model = body.model === 'qwen-3' ? 'qwen-3' : 'qwen-2512';
    const endpoint = model === 'qwen-3' ? MODEL_3 : MODEL_2512;

    const allowedSizes = new Set([
      'square_hd',
      'square',
      'portrait_4_3',
      'portrait_16_9',
      'landscape_4_3',
      'landscape_16_9',
    ]);

    const input: Record<string, unknown> = {
      prompt,
      negative_prompt: String(body.negativePrompt || '').slice(0, 500),
      image_size: allowedSizes.has(String(body.imageSize || ''))
        ? String(body.imageSize)
        : 'landscape_4_3',
      num_images: 1,
      enable_safety_checker: true,
      output_format: body.outputFormat === 'jpeg' || body.outputFormat === 'webp' ? body.outputFormat : 'png',
    };

    if (Number.isInteger(body.width) && Number.isInteger(body.height)) {
      const width = Number(body.width);
      const height = Number(body.height);
      if (width >= 512 && height >= 512 && width <= 2048 && height <= 2048) {
        input.image_size = { width, height };
      }
    }

    if (Number.isInteger(body.seed) && Number(body.seed) >= 0 && Number(body.seed) <= 2147483647) {
      input.seed = Number(body.seed);
    }

    if (model === 'qwen-2512') {
      input.num_inference_steps = 28;
      input.guidance_scale = 4;
      input.acceleration = 'regular';
    } else {
      input.enable_prompt_expansion = true;
    }

    const upstream = await fetch(`https://fal.run/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const raw = await upstream.text();
    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }

    if (!upstream.ok) {
      console.error('Qwen/fal request failed', upstream.status, raw.slice(0, 2000));
      res.status(502).json({
        error: 'Generovanie obrázka zlyhalo.',
        providerStatus: upstream.status,
      });
      return;
    }

    const images = Array.isArray(data?.images) ? data.images : [];
    if (!images.length || !images[0]?.url) {
      res.status(502).json({ error: 'API nevrátilo obrázok.' });
      return;
    }

    res.status(200).json({
      model,
      provider: 'fal',
      image: images[0],
      images,
      seed: data?.seed ?? null,
      prompt: data?.prompt || prompt,
    });
  } catch (error: any) {
    console.error('qwen-image', error);
    res.status(500).json({ error: 'Generovanie obrázka je momentálne nedostupné.' });
  }
}
