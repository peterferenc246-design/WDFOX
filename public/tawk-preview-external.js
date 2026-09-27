/* WDFOX preview: external Tawk.to connection only — exact GitHub preview behavior plus Vercel host. */
(function () {
  "use strict";

  var host = String(window.location.hostname || "").toLowerCase();
  var isVercelPreviewHost =
    host === "wdfox-preview.vercel.app" ||
    (host.startsWith("wdfox-preview-") && host.endsWith(".vercel.app"));
  var isPreviewHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".app.github.dev") ||
    host.endsWith(".github.dev") ||
    isVercelPreviewHost;

  if (!isPreviewHost) return;

  document.documentElement.classList.add("fox-tawk-preview-concealed");
  if (!document.getElementById("fox-tawk-preview-no-flash")) {
    var guardStyle = document.createElement("style");
    guardStyle.id = "fox-tawk-preview-no-flash";
    guardStyle.textContent =
      'html.fox-tawk-preview-concealed iframe[src*="tawk.to"],html.fox-tawk-preview-concealed iframe[src*="tawk.link"],html.fox-tawk-preview-concealed iframe[title*="chat widget" i]{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    document.head.appendChild(guardStyle);
  }

  var PROPERTY_ID = "6ab9114a68e784344596dba1";
  var WIDGETS = {
    sk: "1k3hen3nv",
    de: "1k3heqb3l",
    en: "1k3heseio",
    hr: "1k3heuj83",
    fr: "1k3hf0d3c",
    it: "1k3hf0l1g",
    pl: "1k3hf0sve",
    es: "1k3hf1avt",
    sv: "1k3hf1fu7"
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
  var widgetId = WIDGETS[language];

  try { localStorage.setItem("wdfox-language", language); } catch (_) {}
  document.documentElement.setAttribute("data-wdfox-tawk-language", language);
  document.documentElement.setAttribute("data-wdfox-tawk-widget", widgetId);

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
  window.WebDesignFOXChatLanguage = language;
  window.WebDesignFOXTawkPropertyId = PROPERTY_ID;
  window.WebDesignFOXTawkWidgetId = widgetId;

  function expectedSrc(id) {
    return "https://embed.tawk.to/" + PROPERTY_ID + "/" + id;
  }

  function injectWidget(id) {
    var expected = expectedSrc(id);
    var existingById = document.getElementById("tawk-language-script");
    if (existingById && String(existingById.src || "").indexOf("/" + id) !== -1) return;

    var existing = document.querySelector('script[src*="embed.tawk.to/' + PROPERTY_ID + '/"]');
    if (existing && String(existing.src || "").indexOf("/" + id) !== -1) return;

    if (existingById && existingById.parentNode) existingById.parentNode.removeChild(existingById);
    if (existing && existing !== existingById && existing.parentNode) existing.parentNode.removeChild(existing);

    var script = document.createElement("script");
    script.id = "tawk-language-script";
    script.async = true;
    script.src = expected;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.setAttribute("data-wdfox-preview", "external-tawk");
    script.setAttribute("data-wdfox-language", language);
    document.head.appendChild(script);
  }

  window.WebDesignFOXSwitchPreviewChatLanguage = function (nextLanguage, done) {
    var next = normalize(nextLanguage);
    if (!WIDGETS[next]) next = "sk";
    var nextWidget = WIDGETS[next];

    language = next;
    widgetId = nextWidget;
    window.WebDesignFOXChatLanguage = next;
    window.WebDesignFOXTawkWidgetId = nextWidget;
    document.documentElement.setAttribute("data-wdfox-tawk-language", next);
    document.documentElement.setAttribute("data-wdfox-tawk-widget", nextWidget);
    try { localStorage.setItem("wdfox-language", next); } catch (_) {}

    var finish = function () {
      if (typeof done === "function") done();
    };

    try {
      if (window.Tawk_API && typeof window.Tawk_API.switchWidget === "function") {
        window.Tawk_API.switchWidget(PROPERTY_ID + "/" + nextWidget, finish);
        return;
      }
    } catch (_) {}

    injectWidget(nextWidget);
    finish();
  };

  injectWidget(widgetId);
})();
