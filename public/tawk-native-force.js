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
    return document.querySelectorAll('#fox-tawk-launcher, .live-chat-bubble');
  }

  function setFoxVisible(visible) {
    var launchers = getLaunchers();
    for (var i = 0; i < launchers.length; i += 1) {
      var launcher = launchers[i];
      launcher.classList.toggle('fox-tawk-concealed', !visible);
      launcher.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
      launcher.style.setProperty('opacity', visible ? '1' : '0', 'important');
      launcher.style.setProperty('display', visible ? 'flex' : 'none', 'important');
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

    // A restored Tawk session must never auto-open over the FOX launcher.
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
      ? event.target.closest('#fox-tawk-launcher, .live-chat-bubble')
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

  // Start in FOX-only state immediately, then enforce it again while Tawk
  // restores any browser-persisted UI/session state.
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
