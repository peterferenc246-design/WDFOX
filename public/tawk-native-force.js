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
    return !!document.querySelector('iframe[src*="tawk.to"], #tawkchat-container, iframe[title*="chat" i]');
  }

  function show() {
    var api = window.Tawk_API;
    if (!api) return false;
    try {
      if (typeof api.showWidget === 'function') { api.showWidget(); return true; }
      if (typeof api.start === 'function') { api.start({ showWidget: true }); return true; }
    } catch (_) {}
    return false;
  }

  function loadNative() {
    if (hasWidget()) { show(); return; }
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
    var oldLoad = window.Tawk_API.onLoad;
    window.Tawk_API.onLoad = function () {
      try { if (typeof oldLoad === 'function') oldLoad(); } catch (_) {}
      show();
    };
    if (document.getElementById('tawk-native-direct')) return;
    var s = document.createElement('script');
    s.id = 'tawk-native-direct';
    s.async = true;
    s.src = 'https://embed.tawk.to/' + PROPERTY_ID + '/' + WIDGETS[language()];
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    (document.body || document.head || document.documentElement).appendChild(s);
  }

  window.setTimeout(loadNative, 1000);
  window.setTimeout(function () { if (!hasWidget()) loadNative(); else show(); }, 3500);
  window.setTimeout(function () { if (!hasWidget()) loadNative(); else show(); }, 7000);
})();
