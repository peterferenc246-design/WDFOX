(function () {
  'use strict';

  var PROPERTY_ID = '6a951d52c3c46c344587662a';
  var WIDGETS = {
    sk: '1k1b9121q',
    de: '1k1bb2aln',
    en: '1k1bb9ast',
    hr: '1k1bjvbjq',
    fr: '1k1blk6o4',
    it: '1k1bovo5t',
    pl: '1k1bp5qda',
    es: '1k1bp6lk5',
    sv: '1k1bpdngj'
  };

  var lang = (document.documentElement.lang || 'sk').toLowerCase().split(/[-_]/)[0];
  if (!WIDGETS[lang]) lang = 'sk';

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.autoStart = true;
  window.Tawk_API.customStyle = window.Tawk_API.customStyle || { zIndex: '2147483647' };
  window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

  function makeVisible() {
    var api = window.Tawk_API;
    if (api) {
      try { if (typeof api.start === 'function') api.start({ showWidget: true }); } catch (_) {}
      try { if (typeof api.showWidget === 'function') api.showWidget(); } catch (_) {}
      try {
        if (typeof api.isChatHidden === 'function' && api.isChatHidden() && typeof api.toggleVisibility === 'function') api.toggleVisibility();
      } catch (_) {}
    }

    document.querySelectorAll('#tawkchat-container, #tawkchat-minified-wrapper, iframe[src*="tawk.to"], iframe[title*="chat" i]').forEach(function (el) {
      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('right', '20px', 'important');
      el.style.setProperty('bottom', '20px', 'important');
      el.style.setProperty('left', 'auto', 'important');
      el.style.setProperty('top', 'auto', 'important');
      el.style.setProperty('z-index', '2147483647', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('display', 'block', 'important');
    });
  }

  var previousOnLoad = window.Tawk_API.onLoad;
  window.Tawk_API.onLoad = function () {
    try { if (typeof previousOnLoad === 'function') previousOnLoad(); } catch (_) {}
    makeVisible();
  };

  function load() {
    var existing = document.querySelector('iframe[src*="tawk.to"], #tawkchat-container');
    if (!existing && !document.getElementById('tawk-native-loader')) {
      var script = document.createElement('script');
      script.id = 'tawk-native-loader';
      script.async = true;
      script.src = 'https://embed.tawk.to/' + PROPERTY_ID + '/' + WIDGETS[lang];
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      (document.body || document.head || document.documentElement).appendChild(script);
    }
    makeVisible();
  }

  [0, 250, 750, 1500, 3000, 5000, 8000].forEach(function (delay) {
    window.setTimeout(load, delay);
  });
  window.setInterval(makeVisible, 10000);
})();
