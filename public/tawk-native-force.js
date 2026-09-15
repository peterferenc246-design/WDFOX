(function () {
  'use strict';

  function forceVisible() {
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

  window.Tawk_API = window.Tawk_API || {};
  var previousOnLoad = window.Tawk_API.onLoad;
  window.Tawk_API.onLoad = function () {
    try {
      if (typeof previousOnLoad === 'function') previousOnLoad();
    } catch (_) {}
    forceVisible();
  };

  [0, 500, 1500, 3000, 5000, 8000].forEach(function (delay) {
    window.setTimeout(forceVisible, delay);
  });
})();
