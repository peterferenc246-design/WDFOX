(function () {
  'use strict';

  function hasWidget() {
    return !!document.querySelector('#tawkchat-container, iframe[src*="tawk.to"], iframe[title*="chat" i]');
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

  function showWidget() {
    var api = window.Tawk_API;
    if (!api) return;
    try {
      if (typeof api.showWidget === 'function') api.showWidget();
      else if (typeof api.start === 'function') api.start({ showWidget: true });
    } catch (_) {}
  }

  function attach() {
    if (hasWidget()) {
      showWidget();
      positionWidget();
      return;
    }

    var api = window.Tawk_API;
    if (api) {
      var previousOnLoad = api.onLoad;
      if (!api.__WDFOX_NATIVE_ATTACHED) {
        api.__WDFOX_NATIVE_ATTACHED = true;
        api.onLoad = function () {
          try { if (typeof previousOnLoad === 'function') previousOnLoad(); } catch (_) {}
          showWidget();
          positionWidget();
        };
      }
      showWidget();
    }
  }

  attach();
  window.setTimeout(attach, 1000);
  window.setTimeout(attach, 2500);
  window.setTimeout(attach, 5000);
  window.setTimeout(attach, 8000);
  window.setInterval(function () {
    if (hasWidget()) {
      showWidget();
      positionWidget();
    }
  }, 1000);
})();
