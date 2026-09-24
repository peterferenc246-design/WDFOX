(function () {
  'use strict';

  // Deterministic custom FOX launcher state for Tawk.to.
  // Contract:
  //   page load/refresh -> FOX launcher only
  //   FOX click         -> FOX hidden + Tawk maximized
  //   Tawk minimize     -> Tawk hidden + FOX visible
  // Language routing remains owned by tawk-language-loader.js.

  var language = String(window.WebDesignFOXChatLanguage || document.documentElement.lang || 'sk')
    .toLowerCase()
    .split(/[-_]/)[0];
  var RESET_KEY = 'wdfox-tawk-session-reset-20260921a:' + language;
  var chatOpenedByFox = false;
  var pendingOpen = false;

  var COPY = {
    sk: { attention: 'Som tu pre vás!', open: 'Otvoriť živý chat' },
    de: { attention: 'Ich bin für Sie da!', open: 'Live-Chat öffnen' },
    en: { attention: 'I am here for you!', open: 'Open live chat' },
    hr: { attention: 'Tu sam za vas!', open: 'Otvori razgovor uživo' },
    fr: { attention: 'Je suis là pour vous !', open: 'Ouvrir le chat en direct' },
    it: { attention: 'Sono qui per te!', open: 'Apri la chat dal vivo' },
    pl: { attention: 'Jestem tu dla Ciebie!', open: 'Otwórz czat na żywo' },
    es: { attention: '¡Estoy aquí para ti!', open: 'Abrir chat en vivo' },
    sv: { attention: 'Jag finns här för dig!', open: 'Öppna livechatten' }
  };

  function copyForLanguage() {
    return COPY[language] || COPY.sk;
  }

  function installLauncherStyle() {
    if (document.getElementById('fox-tawk-production-launcher-style')) return;
    var style = document.createElement('style');
    style.id = 'fox-tawk-production-launcher-style';
    style.textContent =
      '#fox-tawk-launcher{position:fixed!important;right:14px!important;bottom:12px!important;z-index:2147483647!important;width:270px!important;height:188px!important;border:0!important;padding:0!important;margin:0!important;background:transparent!important;cursor:pointer!important;filter:drop-shadow(0 7px 11px rgba(0,0,0,.16))!important;transition:transform .18s ease!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}'+
      '#fox-tawk-launcher:hover{transform:translateY(-3px) scale(1.02)!important}'+
      '#fox-tawk-launcher:active{transform:scale(.97)!important}'+
      '#fox-tawk-launcher:focus-visible{outline:3px solid #0664e8!important;outline-offset:3px!important;border-radius:18px!important}'+
      '#fox-tawk-launcher svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none!important}'+
      '#fox-tawk-launcher svg *{pointer-events:none!important}'+
      '.live-chat-bubble:not(#fox-tawk-launcher){display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}'+
      '@media(max-width:700px){#fox-tawk-launcher{right:2px!important;bottom:6px!important;width:225px!important;height:157px!important}}';
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureFoxLauncher() {
    installLauncherStyle();
    var launcher = document.getElementById('fox-tawk-launcher');
    if (launcher) return launcher;

    var copy = copyForLanguage();
    launcher = document.createElement('button');
    launcher.id = 'fox-tawk-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-label', copy.open);
    launcher.innerHTML =
      '<svg viewBox="0 0 270 188" role="img" aria-label="' + copy.attention.replace(/"/g, '&quot;') + ' — ' + copy.open.replace(/"/g, '&quot;') + '" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><path id="fox-prod-arc" d="M 54 74 Q 146 8 248 74"/></defs>' +
        '<text font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="900" fill="#ff922d" stroke="#0664e8" stroke-width="2.6" paint-order="stroke" stroke-linejoin="round"><textPath href="#fox-prod-arc" startOffset="50%" text-anchor="middle" textLength="192" lengthAdjust="spacingAndGlyphs">' + copy.attention + '</textPath></text>' +
        '<text x="150" y="74" text-anchor="middle" font-size="31">❤️</text>' +
        '<text x="66" y="121" text-anchor="middle" font-size="31" transform="rotate(-10 66 121)">👋</text>' +
        '<text x="67" y="158" text-anchor="middle" font-size="28" transform="rotate(-5 67 158)">✍️</text>' +
        '<image x="91" y="73" width="118" height="116" preserveAspectRatio="xMidYMid meet" href="/images/tawk-fox-face-transparent.png?v=20260924prod"/>' +
        '<text x="238" y="122" text-anchor="middle" font-size="31" transform="rotate(6 238 122)">🤝</text>' +
      '</svg>';

    if (document.body) document.body.appendChild(launcher);
    else document.addEventListener('DOMContentLoaded', function () {
      if (!document.body.contains(launcher)) document.body.appendChild(launcher);
    }, { once: true });
    return launcher;
  }

  function installNoFlashGuard() {
    if (!document.getElementById('fox-tawk-no-flash-guard')) {
      var style = document.createElement('style');
      style.id = 'fox-tawk-no-flash-guard';
      style.textContent =
        'html.fox-tawk-concealed iframe[src*="tawk.to"],'+
        'html.fox-tawk-concealed iframe[src*="tawk.link"],'+
        'html.fox-tawk-concealed iframe[title*="chat widget" i]{'+
        'visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
      (document.head || document.documentElement).appendChild(style);
    }
  }

  function concealTawkFrames() {
    document.documentElement.classList.add('fox-tawk-concealed');
  }

  function revealTawkFrames() {
    document.documentElement.classList.remove('fox-tawk-concealed');
  }

  function getLaunchers() {
    var launcher = ensureFoxLauncher();
    return launcher ? [launcher] : [];
  }

  function setFoxVisible(visible) {
    var launchers = getLaunchers();
    for (var i = 0; i < launchers.length; i += 1) {
      var launcher = launchers[i];
      launcher.classList.toggle('fox-tawk-concealed', !visible);
      launcher.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
      launcher.style.setProperty('opacity', visible ? '1' : '0', 'important');
      launcher.style.setProperty('display', visible ? 'block' : 'none', 'important');
      launcher.style.setProperty('pointer-events', visible ? 'auto' : 'none', 'important');
      launcher.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }
  }

  function hideFox() {
    setFoxVisible(false);
  }

  function showFox() {
    if (chatOpenedByFox) return;
    setFoxVisible(true);
  }

  function hideTawkAndShowFox() {
    if (chatOpenedByFox || pendingOpen) return;
    concealTawkFrames();
    var api = window.Tawk_API || {};
    try {
      if (typeof api.minimize === 'function') api.minimize();
    } catch (_) {}
    try {
      if (typeof api.hideWidget === 'function') api.hideWidget();
    } catch (_) {}
    showFox();
  }

  function resetStaleSessionOnce() {
    var alreadyReset = false;
    try {
      alreadyReset = localStorage.getItem(RESET_KEY) === '1';
    } catch (_) {}
    if (alreadyReset) return;

    var api = window.Tawk_API || {};
    if (typeof api.endChat !== 'function') return;

    try {
      api.endChat();
      try {
        localStorage.setItem(RESET_KEY, '1');
      } catch (_) {}
    } catch (_) {}
  }

  function maximizeTawk() {
    var api = window.Tawk_API || {};
    chatOpenedByFox = true;
    pendingOpen = false;
    hideFox();
    revealTawkFrames();
    try {
      if (typeof api.showWidget === 'function') api.showWidget();
    } catch (_) {}
    try {
      if (typeof api.maximize === 'function') api.maximize();
    } catch (_) {}
    window.setTimeout(hideFox, 0);
    window.setTimeout(hideFox, 150);
    window.setTimeout(hideFox, 500);
  }

  installNoFlashGuard();
  ensureFoxLauncher();
  concealTawkFrames();

  var api = window.Tawk_API = window.Tawk_API || {};
  var previousOnLoad = api.onLoad;
  var previousChatMaximized = api.onChatMaximized;
  var previousChatMinimized = api.onChatMinimized;
  var previousChatHidden = api.onChatHidden;

  api.onLoad = function () {
    try {
      if (typeof previousOnLoad === 'function') previousOnLoad.apply(this, arguments);
    } catch (_) {}

    resetStaleSessionOnce();

    if (pendingOpen) {
      window.setTimeout(maximizeTawk, 180);
      return;
    }

    chatOpenedByFox = false;
    hideTawkAndShowFox();
    window.setTimeout(hideTawkAndShowFox, 0);
    window.setTimeout(hideTawkAndShowFox, 150);
    window.setTimeout(hideTawkAndShowFox, 500);
    window.setTimeout(hideTawkAndShowFox, 1200);
  };

  api.onChatMaximized = function () {
    try {
      if (typeof previousChatMaximized === 'function') previousChatMaximized.apply(this, arguments);
    } catch (_) {}

    if (!chatOpenedByFox) {
      hideTawkAndShowFox();
      return;
    }
    revealTawkFrames();
    hideFox();
  };

  api.onChatMinimized = function () {
    try {
      if (typeof previousChatMinimized === 'function') previousChatMinimized.apply(this, arguments);
    } catch (_) {}

    pendingOpen = false;
    chatOpenedByFox = false;
    concealTawkFrames();
    try {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        window.Tawk_API.hideWidget();
      }
    } catch (_) {}
    showFox();
  };

  api.onChatHidden = function () {
    try {
      if (typeof previousChatHidden === 'function') previousChatHidden.apply(this, arguments);
    } catch (_) {}

    pendingOpen = false;
    chatOpenedByFox = false;
    concealTawkFrames();
    showFox();
  };

  function foxPressed(event) {
    var target = event && event.target && event.target.closest
      ? event.target.closest('#fox-tawk-launcher')
      : null;
    if (!target) return;

    event.preventDefault();
    pendingOpen = true;
    chatOpenedByFox = true;
    hideFox();
    revealTawkFrames();

    var currentApi = window.Tawk_API || {};
    if (typeof currentApi.maximize === 'function') {
      maximizeTawk();
      return;
    }

    var attempts = 0;
    var retry = window.setInterval(function () {
      attempts += 1;
      var retryApi = window.Tawk_API || {};
      if (typeof retryApi.maximize === 'function') {
        window.clearInterval(retry);
        maximizeTawk();
      } else if (attempts >= 40) {
        window.clearInterval(retry);
        pendingOpen = false;
        chatOpenedByFox = false;
        concealTawkFrames();
        showFox();
      }
    }, 250);
  }

  chatOpenedByFox = false;
  pendingOpen = false;
  concealTawkFrames();
  showFox();
  window.setTimeout(hideTawkAndShowFox, 0);
  window.setTimeout(hideTawkAndShowFox, 250);
  window.setTimeout(hideTawkAndShowFox, 750);
  window.setTimeout(hideTawkAndShowFox, 1500);

  document.addEventListener('click', foxPressed, true);
})();
