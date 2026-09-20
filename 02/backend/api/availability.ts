import { createHash, timingSafeEqual } from 'node:crypto';
import { getCache } from '@vercel/functions';

const CACHE_KEY = 'wdfox:availability:v1';
const OWNER_HASH = '2d99cdfdc1848ae2103cfefdb970f0407ffbc169c879439c67aa8f373bb081e6';
const ALLOWED_ORIGINS = new Set([
  'https://foxprof.club',
  'https://www.foxprof.club'
]);

type AvailabilityState = {
  pc: boolean;
  mobile: boolean;
  updatedAt: string;
};

const DEFAULT_STATE: AvailabilityState = {
  pc: false,
  mobile: false,
  updatedAt: new Date(0).toISOString()
};

function cors(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '';
  return {
    'Cache-Control': 'no-store',
    ...(ALLOWED_ORIGINS.has(origin) ? {
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin'
    } : {}),
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

function reply(request: Request, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: cors(request) });
}

async function readState(): Promise<AvailabilityState> {
  try {
    const cache = getCache();
    const value = await cache.get(CACHE_KEY) as AvailabilityState | null;
    if (!value || typeof value !== 'object') return DEFAULT_STATE;
    return {
      pc: Boolean(value.pc),
      mobile: Boolean(value.mobile),
      updatedAt: String(value.updatedAt || DEFAULT_STATE.updatedAt)
    };
  } catch (error) {
    console.error('availability cache read failed', error);
    return DEFAULT_STATE;
  }
}

async function writeState(state: AvailabilityState): Promise<void> {
  const cache = getCache();
  await cache.set(CACHE_KEY, state, {
    ttl: 31_536_000,
    tags: ['wdfox-availability']
  });
}

function publicState(state: AvailabilityState) {
  return {
    pc: state.pc,
    mobile: state.mobile,
    activeTarget: state.pc ? 'pc' : state.mobile ? 'mobile' : null,
    available: state.pc || state.mobile,
    updatedAt: state.updatedAt
  };
}

function isOwner(request: Request): boolean {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return false;
  const actual = Buffer.from(createHash('sha256').update(token).digest('hex'));
  const expected = Buffer.from(OWNER_HASH);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function OPTIONS(request: Request): Promise<Response> {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function GET(request: Request): Promise<Response> {
  const state = await readState();
  return reply(request, publicState(state));
}

export async function POST(request: Request): Promise<Response> {
  if (!isOwner(request)) {
    return reply(request, { error: 'OWNER_AUTH_REQUIRED' }, 401);
  }

  const body = await request.json().catch(() => ({})) as {
    action?: string;
    device?: 'pc' | 'mobile';
    online?: boolean;
  };

  if (body.action === 'auth') {
    return reply(request, { ok: true });
  }

  if (body.device !== 'pc' && body.device !== 'mobile') {
    return reply(request, { error: 'INVALID_DEVICE' }, 400);
  }

  const current = await readState();
  const next: AvailabilityState = {
    ...current,
    [body.device]: typeof body.online === 'boolean' ? body.online : !current[body.device],
    updatedAt: new Date().toISOString()
  };

  await writeState(next);
  return reply(request, { ok: true, ...publicState(next) });
}
