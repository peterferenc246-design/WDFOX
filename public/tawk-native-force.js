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
    return !!document.querySelector('#tawkchat-container, iframe[src*="tawk.to"], iframe[title*="chat" i]');
  }

  function showWidget() {
    var api = window.Tawk_API;
    if (!api) return;
    try {
      if (typeof api.showWidget === 'function') api.showWidget();
      else if (typeof api.start === 'function') api.start({ showWidget: true });
    } catch (_) {}
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

  function loadNative() {
    if (hasWidget()) {
      showWidget();
      positionWidget();
      return;
    }

    var api = window.Tawk_API;
    if (!api) {
      window.Tawk_API = {};
      api = window.Tawk_API;
    }
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

    if (!api.__WDFOX_NATIVE_ONLOAD) {
      var previousOnLoad = api.onLoad;
      api.__WDFOX_NATIVE_ONLOAD = true;
      api.onLoad = function () {
        try { if (typeof previousOnLoad === 'function') previousOnLoad(); } catch (_) {}
        showWidget();
        positionWidget();
      };
    }

    var existing = document.querySelector('script[data-wdfox-tawk-native="1"]');
    if (!existing) {
      existing = document.createElement('script');
      existing.async = true;
      existing.setAttribute('data-wdfox-tawk-native', '1');
      existing.src = 'https://embed.tawk.to/' + PROPERTY_ID + '/' + WIDGETS[language()];
      existing.charset = 'UTF-8';
      existing.setAttribute('crossorigin', '*');
      (document.head || document.body || document.documentElement).appendChild(existing);
    }
  }

  function ensure() {
    if (!hasWidget()) loadNative();
    else {
      showWidget();
      positionWidget();
    }
  }

  ensure();
  window.setTimeout(ensure, 1000);
  window.setTimeout(ensure, 3000);
  window.setTimeout(ensure, 6000);
  window.setTimeout(ensure, 10000);
  window.setInterval(function () {
    if (hasWidget()) {
      showWidget();
      positionWidget();
    }
  }, 1000);
})();
