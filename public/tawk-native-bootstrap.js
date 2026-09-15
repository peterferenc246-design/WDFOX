(function () {
  "use strict";

  window.Tawk_API = window.Tawk_API || {};
  var previousOnLoad = window.Tawk_API.onLoad;

  window.Tawk_API.onLoad = function () {
    try {
      if (typeof previousOnLoad === "function") previousOnLoad();
    } catch (_) {}

    try {
      if (typeof window.Tawk_API.showWidget === "function") {
        window.Tawk_API.showWidget();
      }
    } catch (_) {}
  };
})();
