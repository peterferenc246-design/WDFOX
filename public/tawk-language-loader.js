/* WDFOX PREVIEW Tawk bootstrap: isolated PREVIEW properties/widgets only. */
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

  var PROPERTY_IDS = {
    sk: "6aba373f25498e3445ceb5b6",
    de: "6aba2d3f1300d43446c8b761",
    en: "6aba3791c601f934456dfe2b",
    hr: "6aba37adc601f934456dfe2e",
    fr: "6aba37b7783d543456da149d",
    it: "6aba37d1497bdf3441c94df7",
    pl: "6aba37dbd338ef344337ab6c",
    es: "6aba37f98673653447134cc1",
    sv: "6aba3803dff27f343f63f6c9"
  };

  var WIDGETS = {
    sk: "1k3jmfkjq",
    de: "1k3jk1ga8",
    en: "1k3jmi4o8",
    hr: "1k3jmj0gp",
    fr: "1k3jmj9u6",
    it: "1k3jmk3i0",
    pl: "1k3jmkd5l",
    es: "1k3jmlaaq",
    sv: "1k3jmljpb"
  };

  function normalize(value) {
    return String(value || "").toLowerCase().split(/[-_]/)[0];
  }

  function resolveLanguage() {
    var urlLanguage = normalize(window.location.pathname.split("/")[1]);
    var htmlLanguage = normalize(document.documentElement.lang);
    var browserLanguage = normalize(navigator.language || navigator.userLanguage);
    if (WIDGETS[urlLanguage]) return urlLanguage;
    if (WIDGETS[htmlLanguage]) return htmlLanguage;
    if (WIDGETS[browserLanguage]) return browserLanguage;
    return "sk";
  }

  var language = resolveLanguage();
  var propertyId = PROPERTY_IDS[language];
  var widgetId = WIDGETS[language];

  function publishState(lang) {
    language = WIDGETS[lang] ? lang : "sk";
    propertyId = PROPERTY_IDS[language];
    widgetId = WIDGETS[language];

    try { localStorage.setItem("wdfox-language", language); } catch (_) {}
    document.documentElement.setAttribute("data-wdfox-tawk-language", language);
    document.documentElement.setAttribute("data-wdfox-tawk-widget", widgetId);
    document.documentElement.setAttribute("data-wdfox-tawk-property", propertyId);

    window.WebDesignFOXChatLanguage = language;
    window.WebDesignFOXTawkPropertyId = propertyId;
    window.WebDesignFOXTawkWidgetId = widgetId;
  }

  publishState(language);

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

  function switchPreviewChatLanguage(nextLanguage, done) {
    var next = normalize(nextLanguage);
    if (!WIDGETS[next]) next = "sk";
    publishState(next);

    /* Every PREVIEW language uses its own Tawk property. The page navigation
       reloads the correct property/widget, so do not endChat/switchWidget here. */
    if (typeof done === "function") done();
  }

  window.WebDesignFOXSwitchPreviewChatLanguage = switchPreviewChatLanguage;
  window.WebDesignFOXSwitchChatLanguage = switchPreviewChatLanguage;

  function injectTawk() {
    var expected = "https://embed.tawk.to/" + propertyId + "/" + widgetId;
    var existing = document.getElementById("tawk-language-script");

    if (existing && String(existing.src || "") === expected) return;
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var script = document.createElement("script");
    script.id = "tawk-language-script";
    script.async = true;
    script.src = expected;
    script.charset = "UTF-8";
    script.setAttribute("data-wdfox-preview", "isolated-tawk");
    script.setAttribute("data-wdfox-language", language);
    script.setAttribute("data-wdfox-property", propertyId);
    document.head.appendChild(script);
  }

  function loadLocal(id, src, done) {
    if (document.getElementById(id)) {
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
      console.error("WDFOX PREVIEW helper failed:", src);
      if (typeof done === "function") done();
    };
    document.head.appendChild(script);
  }

  injectTawk();
  loadLocal("wdfox-preview-launcher-loader", "/tawk-preview-launcher.js?v=20261001-init-fix2", function () {
    loadLocal("wdfox-preview-avatar-loader", "/tawk-preview-avatar-fix.js?v=20261001-init-fix2");
  });
})();
