import { createHash, timingSafeEqual } from 'node:crypto';
import { getCache } from '@vercel/functions';

const CACHE_KEY = 'wdfox:availability:v1';
const OWNER_HASH = 'c0290369a8377a940ea06fb9a7ae005d38036c1e8c09521dbdd94ee9bfa57dab';
const ALLOWED_ORIGINS = new Set([
  'https://foxprof.club',
  'https://www.foxprof.club'
]);

const DEFAULT_STATE = {
  pc: false,
  mobile: false,
  updatedAt: new Date(0).toISOString()
};

function cors(request) {
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

function reply(request, body, status = 200) {
  return Response.json(body, { status, headers: cors(request) });
}

async function readState() {
  try {
    const value = await getCache().get(CACHE_KEY);
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

async function writeState(state) {
  await getCache().set(CACHE_KEY, state, {
    ttl: 31_536_000,
    tags: ['wdfox-availability']
  });
}

function publicState(state) {
  return {
    pc: state.pc,
    mobile: state.mobile,
    activeTarget: state.pc ? 'pc' : state.mobile ? 'mobile' : null,
    available: state.pc || state.mobile,
    updatedAt: state.updatedAt
  };
}

function isOwner(request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return false;
  const actual = Buffer.from(createHash('sha256').update(token).digest('hex'));
  const expected = Buffer.from(OWNER_HASH);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function GET(request) {
  const state = await readState();
  return reply(request, publicState(state));
}

export async function POST(request) {
  if (!isOwner(request)) {
    return reply(request, { error: 'OWNER_AUTH_REQUIRED' }, 401);
  }

  const body = await request.json().catch(() => ({}));
  if (body.action === 'auth') {
    return reply(request, { ok: true });
  }

  if (body.device !== 'pc' && body.device !== 'mobile') {
    return reply(request, { error: 'INVALID_DEVICE' }, 400);
  }

  const current = await readState();
  const next = {
    ...current,
    [body.device]: typeof body.online === 'boolean' ? body.online : !current[body.device],
    updatedAt: new Date().toISOString()
  };

  await writeState(next);
  return reply(request, { ok: true, ...publicState(next) });
}
