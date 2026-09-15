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

  function positionWidget() {
    if (window.innerWidth < 769) return;
    var container = document.getElementById('tawkchat-container');
    if (!container) return;
    container.style.setProperty('position', 'fixed', 'important');
    container.style.setProperty('right', '72px', 'important');
    container.style.setProperty('bottom', '12px', 'important');
    container.style.setProperty('z-index', '2147483647', 'important');
  }

  function inject() {
    if (hasWidget()) {
      positionWidget();
      return;
    }

    document.querySelectorAll('script[src*="embed.tawk.to/"]').forEach(function (node) {
      node.remove();
    });

    window.Tawk_API = {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.onLoad = function () {
      try {
        if (typeof window.Tawk_API.showWidget === 'function') window.Tawk_API.showWidget();
      } catch (_) {}
      positionWidget();
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

  window.setTimeout(inject, 1200);
  window.setTimeout(function () {
    if (!hasWidget()) inject();
    else positionWidget();
  }, 5000);
  window.setInterval(positionWidget, 1000);
})();
