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

  function loadNative() {
    if (hasWidget()) {
      showWidget();
      return;
    }

    var existing = document.querySelector('script[src*="embed.tawk.to/"]');
    if (existing) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

    var previousOnLoad = window.Tawk_API.onLoad;
    window.Tawk_API.onLoad = function () {
      try {
        if (typeof previousOnLoad === 'function') previousOnLoad();
      } catch (_) {}
      showWidget();
    };

    var s1 = document.createElement('script');
    var s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/' + PROPERTY_ID + '/' + WIDGETS[language()];
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    if (s0 && s0.parentNode) s0.parentNode.insertBefore(s1, s0);
    else (document.head || document.body || document.documentElement).appendChild(s1);
  }

  window.setTimeout(loadNative, 1500);
  window.setTimeout(function () {
    if (hasWidget()) showWidget();
    else loadNative();
  }, 5000);
  window.setTimeout(function () {
    if (hasWidget()) showWidget();
  }, 9000);
})();
