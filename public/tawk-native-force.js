(function () {
  'use strict';

  var PROPERTY_ID = '6a951d52c3c46c344587662a';
  var WIDGETS = {
    sk: '1k1b9121q', de: '1k1bb2aln', en: '1k1bb9ast', hr: '1k1bjvbjq',
    fr: '1k1blk6o4', it: '1k1bovo5t', pl: '1k1bp5qda', es: '1k1bp6lk5', sv: '1k1bpdngj'
  };

  var lang = (document.documentElement.lang || 'sk').toLowerCase().split(/[-_]/)[0];
  if (!WIDGETS[lang]) lang = 'sk';

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
  window.Tawk_API.autoStart = true;
  window.Tawk_API.customStyle = window.Tawk_API.customStyle || { zIndex: '2147483647' };

  // The FOX button is the only visible chat launcher.
  // Tawk's native floating launcher is hidden; the chat window remains available
  // through the FOX button below.
  function hideNativeWidget() {
    try {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        window.Tawk_API.hideWidget();
      }
    } catch (_) {}
  }

  window.Tawk_API.onLoad = function () {
    hideNativeWidget();
    if (window.__WDFOX_TAWK_OPEN_PENDING && typeof window.Tawk_API.maximize === 'function') {
      window.__WDFOX_TAWK_OPEN_PENDING = false;
      window.Tawk_API.maximize();
    }
  };

  window.Tawk_API.onStatusChange = function () {
    hideNativeWidget();
  };

  // Some Tawk loaders call showWidget after their own initialization.
  // Re-hide only the native launcher; do not touch the chat window.
  var hideAttempts = 0;
  var hideTimer = window.setInterval(function () {
    hideAttempts += 1;
    hideNativeWidget();
    if (hideAttempts >= 30) window.clearInterval(hideTimer);
  }, 250);

  function styleFoxChatButton() {
    if (document.getElementById('wdfox-chat-button-style')) return;
    var style = document.createElement('style');
    style.id = 'wdfox-chat-button-style';
    style.textContent = [
      '.live-chat-bubble{position:fixed!important;right:72px!important;bottom:12px!important;left:auto!important;top:auto!important;z-index:2147483646!important;}',
      '@media(max-width:900px){.live-chat-bubble{right:18px!important;bottom:18px!important;}}',
      '@media(max-width:560px){.live-chat-bubble{right:14px!important;bottom:14px!important;}}'
    ].join('');
    (document.head || document.documentElement).appendChild(style);
  }
  styleFoxChatButton();

  var existingEmbed = document.querySelector('script[src*="embed.tawk.to/"]');
  if (!existingEmbed && !document.getElementById('wdfox-native-tawk-embed')) {
    var script = document.createElement('script');
    script.id = 'wdfox-native-tawk-embed';
    script.async = true;
    script.src = 'https://embed.tawk.to/' + PROPERTY_ID + '/' + WIDGETS[lang];
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);
  }

  // Existing FOX Live button opens the Tawk chat window.
  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var trigger = target.closest('.live-chat-bubble');
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();

    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      window.Tawk_API.maximize();
      return;
    }

    window.__WDFOX_TAWK_OPEN_PENDING = true;
    var attempts = 0;
    var retry = window.setInterval(function () {
      attempts += 1;
      if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
        window.__WDFOX_TAWK_OPEN_PENDING = false;
        window.Tawk_API.maximize();
        window.clearInterval(retry);
      } else if (attempts >= 40) {
        window.clearInterval(retry);
      }
    }, 250);
  }, true);
})();
