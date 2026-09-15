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

  function showNativeWidget() {
    try {
      if (window.Tawk_API && typeof window.Tawk_API.showWidget === 'function') {
        window.Tawk_API.showWidget();
      }
    } catch (_) {}
  }

  // Keep Tawk's own desktop widget visible. Do not auto-open the chat window.
  window.Tawk_API.onLoad = function () {
    if (window.__WDFOX_TAWK_OPEN_PENDING && typeof window.Tawk_API.maximize === 'function') {
      window.__WDFOX_TAWK_OPEN_PENDING = false;
      window.Tawk_API.maximize();
      return;
    }
    showNativeWidget();
  };

  window.Tawk_API.onStatusChange = function () {
    showNativeWidget();
  };

  // tawk-language-loader.js may already have loaded the localized Tawk script.
  // Never inject a second Tawk embed, which can suppress the native widget.
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

  // Keep the existing FOX Live chat control connected to the native Tawk API.
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
