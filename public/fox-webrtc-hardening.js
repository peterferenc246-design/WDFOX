/* FOX LIVE WebRTC hardening layer.
 * Loaded before FoxLiveTranslator. Does not touch Tawk, UI or language logic.
 */
(() => {
  if (window.__FOX_WEBRTC_HARDENING__) return;
  window.__FOX_WEBRTC_HARDENING__ = true;

  const baseIce = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' }
  ];

  const validTurnServers = () => {
    const supplied = Array.isArray(window.__FOX_TURN_SERVERS__) ? window.__FOX_TURN_SERVERS__ : [];
    return supplied.filter((entry) => {
      if (!entry || !entry.urls) return false;
      const urls = Array.isArray(entry.urls) ? entry.urls : [entry.urls];
      const isTurn = urls.some((url) => /^turns?:/i.test(String(url)));
      return !isTurn || (typeof entry.username === 'string' && typeof entry.credential === 'string');
    });
  };

  const mergedIceServers = (existing = []) => {
    const all = [...baseIce, ...validTurnServers(), ...(Array.isArray(existing) ? existing : [])];
    const seen = new Set();
    return all.filter((entry) => {
      const key = JSON.stringify(entry);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const candidateSummary = async (pc) => {
    try {
      const stats = await pc.getStats();
      let pair = null;
      stats.forEach((report) => {
        if (report.type === 'transport' && report.selectedCandidatePairId) pair = stats.get(report.selectedCandidatePairId);
        if (!pair && report.type === 'candidate-pair' && report.state === 'succeeded' && (report.nominated || report.selected)) pair = report;
      });
      if (!pair) return '';
      const local = stats.get(pair.localCandidateId);
      const remote = stats.get(pair.remoteCandidateId);
      const l = local?.candidateType || '?';
      const r = remote?.candidateType || '?';
      return `${l}→${r}`;
    } catch {
      return '';
    }
  };

  const emit = async (pc, phase) => {
    const route = await candidateSummary(pc);
    const detail = {
      phase,
      connectionState: pc.connectionState || '',
      iceConnectionState: pc.iceConnectionState || '',
      iceGatheringState: pc.iceGatheringState || '',
      signalingState: pc.signalingState || '',
      route,
      hasTurn: validTurnServers().length > 0,
      at: Date.now()
    };
    window.__FOX_RTC_LAST_STATE__ = detail;
    window.dispatchEvent(new CustomEvent('fox:rtc-state', { detail }));
    console.info('[FOX WebRTC]', detail);
  };

  const watch = (pc) => {
    if (!pc || pc.__foxWatched) return pc;
    try { Object.defineProperty(pc, '__foxWatched', { value: true }); } catch { pc.__foxWatched = true; }
    ['connectionstatechange', 'iceconnectionstatechange', 'icegatheringstatechange', 'signalingstatechange'].forEach((name) => {
      pc.addEventListener(name, () => emit(pc, name));
    });
    pc.addEventListener('icecandidateerror', (event) => {
      console.warn('[FOX WebRTC] ICE candidate error', event?.errorCode, event?.errorText, event?.url);
    });
    setTimeout(() => emit(pc, 'created'), 0);
    return pc;
  };

  const NativeRTC = window.RTCPeerConnection || window.webkitRTCPeerConnection;
  if (NativeRTC) {
    class FoxRTCPeerConnection extends NativeRTC {
      constructor(config = {}, constraints) {
        const next = {
          ...config,
          iceServers: mergedIceServers(config?.iceServers),
          iceTransportPolicy: config?.iceTransportPolicy || 'all',
          iceCandidatePoolSize: Math.max(Number(config?.iceCandidatePoolSize || 0), 4)
        };
        super(next, constraints);
        watch(this);
      }
    }
    try {
      window.RTCPeerConnection = FoxRTCPeerConnection;
      if (window.webkitRTCPeerConnection) window.webkitRTCPeerConnection = FoxRTCPeerConnection;
    } catch (error) {
      console.warn('[FOX WebRTC] RTCPeerConnection wrapper unavailable', error);
    }
  }

  let peerCtor = window.Peer;
  const wrapPeer = (Ctor) => {
    if (!Ctor || Ctor.__foxWrapped) return Ctor;
    function FoxPeer(id, options) {
      let peerId = id;
      let opts = options;
      if (id && typeof id === 'object' && options === undefined) {
        opts = id;
        peerId = undefined;
      }
      opts = opts || {};
      const config = opts.config || {};
      const hardened = {
        ...opts,
        host: opts.host || '0.peerjs.com',
        port: opts.port || 443,
        path: opts.path || '/',
        secure: opts.secure !== false,
        debug: Math.max(Number(opts.debug || 0), 2),
        config: {
          ...config,
          iceServers: mergedIceServers(config.iceServers),
          iceTransportPolicy: config.iceTransportPolicy || 'all',
          iceCandidatePoolSize: Math.max(Number(config.iceCandidatePoolSize || 0), 4)
        }
      };
      const instance = peerId === undefined ? new Ctor(hardened) : new Ctor(peerId, hardened);
      instance.on?.('error', (error) => {
        if (error?.type === 'unavailable-id') {
          window.dispatchEvent(new CustomEvent('fox:peer-id-conflict', { detail: { id: peerId || '', error } }));
        }
      });
      return instance;
    }
    FoxPeer.prototype = Ctor.prototype;
    Object.setPrototypeOf(FoxPeer, Ctor);
    Object.defineProperty(FoxPeer, '__foxWrapped', { value: true });
    return FoxPeer;
  };

  if (peerCtor) peerCtor = wrapPeer(peerCtor);
  try {
    Object.defineProperty(window, 'Peer', {
      configurable: true,
      get() { return peerCtor; },
      set(value) { peerCtor = wrapPeer(value); }
    });
  } catch {}

  const updateStatus = (message) => {
    const el = document.querySelector('[data-fox-live] [data-comm-status]');
    if (el && message) el.textContent = message;
  };

  window.addEventListener('fox:peer-id-conflict', () => {
    updateStatus('❌ FOX PC ID je už aktívne v inom okne alebo zariadení. Zatvorte starú FOX LIVE kartu a obnovte túto stránku.');
  });

  let failureTimer = null;
  window.addEventListener('fox:rtc-state', (event) => {
    const state = event.detail || {};
    if (state.connectionState === 'connected' || state.iceConnectionState === 'connected' || state.iceConnectionState === 'completed') {
      if (failureTimer) clearTimeout(failureTimer);
      failureTimer = null;
      const route = state.route ? ` (${state.route})` : '';
      updateStatus(`🟢 WebRTC spojenie aktívne${route}`);
      return;
    }
    if (state.connectionState === 'failed' || state.iceConnectionState === 'failed') {
      if (failureTimer) clearTimeout(failureTimer);
      failureTimer = setTimeout(() => {
        updateStatus(state.hasTurn
          ? '❌ WebRTC ICE zlyhalo aj cez TURN. Skontrolujte TURN poverenia alebo firewall.'
          : '❌ WebRTC ICE zlyhalo. Mobilná sieť pravdepodobne vyžaduje TURN relay.');
      }, 300);
    }
  });

  window.__FOX_WEBRTC_DIAGNOSTICS__ = () => window.__FOX_RTC_LAST_STATE__ || null;
})();
