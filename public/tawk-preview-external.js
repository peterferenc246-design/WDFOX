/* WDFOX preview: isolated Tawk.to property + language widget routing. */
(function () {
  "use strict";

  var host = String(window.location.hostname || "").toLowerCase();
  var isManagedPreviewDeployment =
    host.startsWith("wdfox-live-translat-") &&
    host.endsWith("-peters-projects-db101134.vercel.app");
  var isVercelPreviewHost =
    host === "wdfox-preview.vercel.app" ||
    (host.endsWith(".vercel.app") && (
      host.startsWith("wdfox-preview-") ||
      host.startsWith("wdfox-live-translat-api-git-preview-") ||
      host.indexOf("-git-preview-") !== -1 ||
      isManagedPreviewDeployment
    ));
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
  var widgetId = WIDGETS[language];
  var propertyId = PROPERTY_IDS[language] || PROPERTY_ID;

  try { localStorage.setItem("wdfox-language", language); } catch (_) {}
  document.documentElement.setAttribute("data-wdfox-tawk-language", language);
  document.documentElement.setAttribute("data-wdfox-tawk-widget", widgetId);

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
  window.WebDesignFOXChatLanguage = language;
  window.WebDesignFOXTawkPropertyId = propertyId;
  window.WebDesignFOXTawkWidgetId = widgetId;

  function expectedSrc(id) {
    return "https://embed.tawk.to/" + propertyId + "/" + id;
  }

  function injectWidget(id) {
    var expected = expectedSrc(id);
    var existingById = document.getElementById("tawk-language-script");
    if (existingById && String(existingById.src || "").indexOf("/" + id) !== -1) return;

    var existing = document.querySelector('script[src*="embed.tawk.to/' + propertyId + '/"]');
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

  function switchPreviewChatLanguage(nextLanguage, done) {
    var next = normalize(nextLanguage);
    if (!WIDGETS[next]) next = "sk";
    var nextWidget = WIDGETS[next];
    var nextProperty = PROPERTY_IDS[next] || PROPERTY_ID;
    var propertyChanged = nextProperty !== propertyId;

    language = next;
    widgetId = nextWidget;
    propertyId = nextProperty;
    window.WebDesignFOXTawkPropertyId = nextProperty;
    window.WebDesignFOXChatLanguage = next;
    window.WebDesignFOXTawkWidgetId = nextWidget;
    document.documentElement.setAttribute("data-wdfox-tawk-language", next);
    document.documentElement.setAttribute("data-wdfox-tawk-widget", nextWidget);
    try { localStorage.setItem("wdfox-language", next); } catch (_) {}

    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      if (typeof done === "function") done();
    };

    if (propertyChanged) {
      finish();
      return;
    }

    try {
      if (window.Tawk_API && typeof window.Tawk_API.switchWidget === "function") {
        window.Tawk_API.switchWidget({
          propertyId: nextProperty,
          widgetId: nextWidget
        }, function () {
          finish();
        });
        window.setTimeout(finish, 1200);
        return;
      }
    } catch (_) {}

    finish();
  }

  window.WebDesignFOXSwitchPreviewChatLanguage = switchPreviewChatLanguage;
  window.WebDesignFOXSwitchChatLanguage = switchPreviewChatLanguage;

  injectWidget(widgetId);
})();
