(function () {
  'use strict';

  var PROPERTY_ID = '6a951d52c3c46c344587662a';
  var WIDGETS = {
    sk: '1k1b9121q', de: '1k1bb2aln', en: '1k1bb9ast', hr: '1k1bjvbjq',
    fr: '1k1blk6o4', it: '1k1bovo5t', pl: '1k1bp5qda', es: '1k1bp6lk5', sv: '1k1bpdngj'
  };

  function language() {
    var lang = (document.documentElement.lang || 'sk').toLowerCase().split(/[-_]/)[0];
    return WIDGETS[lang] ? lang : 'sk';
  }

  function hasWidget() {
    return !!document.querySelector('#tawkchat-container, iframe[src*="tawk.to"]');
  }

  function hasTawkScript() {
    return !!document.querySelector('#tawk-language-script, script[data-wdfox-tawk-native="1"], script[src*="embed.tawk.to/"]');
  }

  function showWidget() {
    var api = window.Tawk_API;
    if (!api) return false;
    try {
      if (typeof api.showWidget === 'function') {
        api.showWidget();
        return true;
      }
      if (typeof api.start === 'function') {
        api.start({ showWidget: true });
        return true;
      }
    } catch (_) {}
    return false;
  }

  function maximizeWidget() {
    var api = window.Tawk_API;
    if (!api) return false;
    try {
      if (typeof api.maximize === 'function') {
        api.maximize();
        return true;
      }
      showWidget();
    } catch (_) {}
    return false;
  }

  function bindLiveChatTrigger() {
    if (document.__WDFOX_TAWK_TRIGGER_BOUND) return;
    document.__WDFOX_TAWK_TRIGGER_BOUND = true;

    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var trigger = target.closest('.live-chat-bubble');
      if (!trigger) return;

      event.preventDefault();
      event.stopPropagation();

      if (maximizeWidget()) return;

      // Tawk may still be loading. Retry the requested action after its API is ready.
      var attempts = 0;
      var retry = window.setInterval(function () {
        attempts += 1;
        if (maximizeWidget() || attempts >= 40) {
          window.clearInterval(retry);
        }
      }, 250);
    }, true);
  }

  function positionWidget() {
    if (window.innerWidth < 769) return;
    var container = document.getElementById('tawkchat-container');
    if (!container) return;
    container.style.setProperty('position', 'fixed', 'important');
    container.style.setProperty('right', '12px', 'important');
    container.style.setProperty('bottom', '12px', 'important');
    container.style.setProperty('z-index', '2147483647', 'important');
  }

  function loadNativeFallback() {
    if (hasWidget() || hasTawkScript()) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

    if (!window.Tawk_API.__WDFOX_NATIVE_ONLOAD) {
      var previousOnLoad = window.Tawk_API.onLoad;
      window.Tawk_API.__WDFOX_NATIVE_ONLOAD = true;
      window.Tawk_API.onLoad = function () {
        try { if (typeof previousOnLoad === 'function') previousOnLoad(); } catch (_) {}
        showWidget();
        positionWidget();
      };
    }

    var script = document.createElement('script');
    script.id = 'tawk-wdfox-native-fallback';
    script.async = true;
    script.src = 'https://embed.tawk.to/' + PROPERTY_ID + '/' + WIDGETS[language()];
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    (document.head || document.body || document.documentElement).appendChild(script);
  }

  function ensure() {
    bindLiveChatTrigger();
    if (hasWidget()) {
      showWidget();
      positionWidget();
      return;
    }
    if (!hasTawkScript()) loadNativeFallback();
  }

  ensure();
  window.setTimeout(ensure, 1000);
  window.setTimeout(ensure, 3000);
  window.setTimeout(ensure, 6000);
  window.setTimeout(ensure, 10000);
  window.setInterval(function () {
    bindLiveChatTrigger();
    if (hasWidget()) {
      showWidget();
      positionWidget();
    }
  }, 1000);
})();
