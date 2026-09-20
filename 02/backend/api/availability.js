import { createHash, timingSafeEqual } from 'node:crypto';
import { getCache } from '@vercel/functions';

const CACHE_KEY = 'wdfox:availability:v1';
const OWNER_HASH = 'c0290369a8377a940ea06fb9a7ae005d38036c1e8c09521dbdd94ee9bfa57dab';
const PEER_TTL_MS = 45_000;
const ALLOWED_ORIGINS = new Set([
  'https://foxprof.club',
  'https://www.foxprof.club'
]);

const DEFAULT_STATE = {
  pc: false,
  mobile: false,
  peers: {
    pc: { id: null, seenAt: 0 },
    mobile: { id: null, seenAt: 0 }
  },
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

function normalizePeer(peer) {
  return {
    id: typeof peer?.id === 'string' && peer.id ? peer.id : null,
    seenAt: Number(peer?.seenAt || 0)
  };
}

function normalizeState(value) {
  if (!value || typeof value !== 'object') return structuredClone(DEFAULT_STATE);
  return {
    pc: Boolean(value.pc),
    mobile: Boolean(value.mobile),
    peers: {
      pc: normalizePeer(value.peers?.pc),
      mobile: normalizePeer(value.peers?.mobile)
    },
    updatedAt: String(value.updatedAt || DEFAULT_STATE.updatedAt)
  };
}

async function readState() {
  try {
    return normalizeState(await getCache().get(CACHE_KEY));
  } catch (error) {
    console.error('availability cache read failed', error);
    return structuredClone(DEFAULT_STATE);
  }
}

async function writeState(state) {
  await getCache().set(CACHE_KEY, state, {
    ttl: 31_536_000,
    tags: ['wdfox-availability']
  });
}

function peerIsFresh(peer, now = Date.now()) {
  return Boolean(peer?.id) && Number(peer?.seenAt || 0) > 0 && now - Number(peer.seenAt) <= PEER_TTL_MS;
}

function activeRoute(state) {
  const now = Date.now();
  if (state.pc && peerIsFresh(state.peers.pc, now)) {
    return { target: 'pc', peerId: state.peers.pc.id };
  }
  if (state.mobile && peerIsFresh(state.peers.mobile, now)) {
    return { target: 'mobile', peerId: state.peers.mobile.id };
  }
  return null;
}

function publicState(state) {
  const route = activeRoute(state);
  return {
    pc: state.pc,
    mobile: state.mobile,
    activeTarget: route?.target || null,
    available: Boolean(route),
    route,
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

function validDevice(device) {
  return device === 'pc' || device === 'mobile';
}

function validPeerId(peerId) {
  return typeof peerId === 'string' && /^[A-Za-z0-9_.:-]{1,160}$/.test(peerId);
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

  if (body.action === 'register-peer' || body.action === 'heartbeat') {
    if (!validDevice(body.device)) {
      return reply(request, { error: 'INVALID_DEVICE' }, 400);
    }
    if (!validPeerId(body.peerId)) {
      return reply(request, { error: 'INVALID_PEER_ID' }, 400);
    }

    const current = await readState();
    const next = {
      ...current,
      peers: {
        ...current.peers,
        [body.device]: {
          id: body.peerId,
          seenAt: Date.now()
        }
      }
    };
    await writeState(next);
    return reply(request, { ok: true, registered: body.device, ...publicState(next) });
  }

  if (body.action === 'unregister-peer') {
    if (!validDevice(body.device)) {
      return reply(request, { error: 'INVALID_DEVICE' }, 400);
    }
    const current = await readState();
    const next = {
      ...current,
      peers: {
        ...current.peers,
        [body.device]: { id: null, seenAt: 0 }
      }
    };
    await writeState(next);
    return reply(request, { ok: true, ...publicState(next) });
  }

  if (!validDevice(body.device)) {
    return reply(request, { error: 'INVALID_DEVICE' }, 400);
  }

  const current = await readState();
  const nextOnline = typeof body.online === 'boolean' ? body.online : !current[body.device];
  const next = {
    ...current,
    [body.device]: nextOnline,
    updatedAt: new Date().toISOString()
  };

  if (!nextOnline) {
    next.peers = {
      ...next.peers,
      [body.device]: { id: null, seenAt: 0 }
    };
  }

  await writeState(next);
  return reply(request, { ok: true, ...publicState(next) });
}
