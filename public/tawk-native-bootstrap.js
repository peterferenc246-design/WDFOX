(function () {
  "use strict";

  // Tawk belongs only to top-level localized home pages, never embedded tools.
  if (window.self !== window.top ||
      !/^\/(?:sk|de|en|hr|fr|it|pl|es|sv)\/(?:index\.html)?$/.test(window.location.pathname)) return;


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
