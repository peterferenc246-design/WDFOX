/* WDFOX PREVIEW bootstrap: never load production Tawk on PREVIEW/local hosts. */
(function () {
  "use strict";

  var host = String(window.location.hostname || "").toLowerCase();
  var isPreviewHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".app.github.dev") ||
    host.endsWith(".github.dev") ||
    host === "wdfox-preview.vercel.app" ||
    (host.endsWith(".vercel.app") && (
      host.startsWith("wdfox-preview-") ||
      host.startsWith("wdfox-live-translat-api-git-preview-") ||
      host.indexOf("-git-preview-") !== -1
    ));

  if (!isPreviewHost) return;

  function load(id, src, done) {
    var existing = document.getElementById(id);
    if (existing) {
      if (typeof done === "function") done();
      return;
    }

    var script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = false;
    script.setAttribute("data-wdfox-preview-bootstrap", "1");
    script.onload = function () {
      if (typeof done === "function") done();
    };
    script.onerror = function () {
      console.error("WDFOX PREVIEW Tawk bootstrap failed:", src);
      if (typeof done === "function") done();
    };
    document.head.appendChild(script);
  }

  load("wdfox-preview-external-loader", "/tawk-preview-external.js?v=20261001-init-fix", function () {
    load("wdfox-preview-launcher-loader", "/tawk-preview-launcher.js?v=20261001-init-fix", function () {
      load("wdfox-preview-avatar-loader", "/tawk-preview-avatar-fix.js?v=20261001-init-fix");
    });
  });
})();
