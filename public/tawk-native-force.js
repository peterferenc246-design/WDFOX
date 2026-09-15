(function () {
  'use strict';

  // This bridge does one job only: connect the existing FOX Live chat
  // button to the already configured native Tawk.to widget.
  function openTawk() {
    var api = window.Tawk_API;
    if (!api) return false;

    try {
      if (typeof api.maximize === 'function') {
        api.maximize();
        return true;
      }
      if (typeof api.showWidget === 'function') {
        api.showWidget();
        return true;
      }
    } catch (_) {}

    return false;
  }

  function bind() {
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

      // Tawk can still be initializing. Remember the click and execute it
      // immediately when Tawk reports that its API is ready.
      window.__WDFOX_TAWK_OPEN_PENDING = true;
    }, true);

    window.Tawk_API = window.Tawk_API || {};
    if (!window.Tawk_API.__WDFOX_ONLOAD_BRIDGE) {
      var previousOnLoad = window.Tawk_API.onLoad;
      window.Tawk_API.__WDFOX_ONLOAD_BRIDGE = true;
      window.Tawk_API.onLoad = function () {
        try {
          if (typeof previousOnLoad === 'function') previousOnLoad();
        } catch (_) {}

        if (window.__WDFOX_TAWK_OPEN_PENDING) {
          window.__WDFOX_TAWK_OPEN_PENDING = false;
          window.setTimeout(openTawk, 0);
        }
      };
    }
  }

  bind();
})();
