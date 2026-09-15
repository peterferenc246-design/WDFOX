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

  function openTawk() {
    var api = window.Tawk_API;
    if (!api) return false;
    try {
      if (typeof api.maximize === 'function') { api.maximize(); return true; }
      if (typeof api.showWidget === 'function') { api.showWidget(); return true; }
      if (typeof api.start === 'function') { api.start({ showWidget: true }); return true; }
    } catch (_) {}
    return false;
  }

  function widgetPresent() {
    return !!document.querySelector('#tawkchat-container, iframe[src*="tawk.to"]');
  }

  function bindTrigger() {
    if (document.__WDFOX_TAWK_TRIGGER_BOUND) return;
    document.__WDFOX_TAWK_TRIGGER_BOUND = true;
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var trigger = target.closest('.live-chat-bubble');
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      if (openTawk()) return;
      window.__WDFOX_TAWK_OPEN_PENDING = true;
      var attempts = 0;
      var retry = window.setInterval(function () {
        attempts += 1;
        if (openTawk() || attempts >= 40) window.clearInterval(retry);
      }, 250);
    }, true);
  }

  function installOnLoadBridge() {
    window.Tawk_API = window.Tawk_API || {};
    if (window.Tawk_API.__WDFOX_ONLOAD_BRIDGE) return;
    var previous = window.Tawk_API.onLoad;
    window.Tawk_API.__WDFOX_ONLOAD_BRIDGE = true;
    window.Tawk_API.onLoad = function () {
      try { if (typeof previous === 'function') previous(); } catch (_) {}
      if (window.__WDFOX_TAWK_OPEN_PENDING) {
        window.__WDFOX_TAWK_OPEN_PENDING = false;
        window.setTimeout(openTawk, 0);
      }
      window.setTimeout(openTawk, 0);
    };
  }

  function loadNative() {
    if (widgetPresent()) return false;
    if (window.__WDFOX_TAWK_EMBED_REQUESTED) return false;

    window.__WDFOX_TAWK_EMBED_REQUESTED = true;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
    installOnLoadBridge();

    var script = document.createElement('script');
    script.id = 'wdfox-native-tawk-embed';
    script.async = true;
    script.src = 'https://embed.tawk.to/' + PROPERTY_ID + '/' + WIDGETS[language()];
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
    return true;
  }

  function ensure() {
    bindTrigger();
    if (!widgetPresent()) {
      loadNative();
    } else {
      openTawk();
    }
  }

  installOnLoadBridge();
  bindTrigger();
  ensure();

  // The language loader is retained. If its Tawk request does not produce
  // the native widget, retry once through the same official Tawk embed URL.
  window.setTimeout(function () {
    if (!widgetPresent()) {
      window.__WDFOX_TAWK_EMBED_REQUESTED = false;
      loadNative();
    }
  }, 5000);

  [1000, 2500, 7000, 10000].forEach(function (delay) {
    window.setTimeout(function () {
      bindTrigger();
      if (widgetPresent()) openTawk();
    }, delay);
  });
})();
