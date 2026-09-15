(function () {
  'use strict';

  var PROPERTY_ID = '6a951d52c3c46c344587662a';
  var WIDGET_ID = '1k1b9121q';

  function restore() {
    var api = window.Tawk_API;
    if (!api) return false;

    if (typeof api.switchWidget === 'function') {
      api.switchWidget({ propertyId: PROPERTY_ID, widgetId: WIDGET_ID }, function () {
        try {
          if (typeof api.showWidget === 'function') api.showWidget();
          else if (typeof api.start === 'function') api.start({ showWidget: true });
        } catch (_) {}
      });
      return true;
    }

    if (typeof api.showWidget === 'function') {
      try { api.showWidget(); } catch (_) {}
      return true;
    }

    return false;
  }

  var previousOnLoad = window.Tawk_API && window.Tawk_API.onLoad;
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.onLoad = function () {
    try { if (typeof previousOnLoad === 'function') previousOnLoad(); } catch (_) {}
    restore();
  };

  [0, 500, 1500, 3000, 5000, 8000].forEach(function (delay) {
    window.setTimeout(restore, delay);
  });
})();
