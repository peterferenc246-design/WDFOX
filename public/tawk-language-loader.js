/*
 * WebDesignFOX – Tawk.to language-aware widget loader
 *
 * Add one Tawk.to widget per language in the map below.
 * Only one widget is loaded on a page.
 */
(function () {
  "use strict";

  var widgets = {
    // Current widget supplied by the owner; keep as temporary fallback.
    sk: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1b9121q" },
    de: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bb2aln" },
    en: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bb9ast" },
    fr: null,
    hr: null,
    pl: null,
    it: null,
    es: null,
    sv: null
  };

  var supported = Object.keys(widgets);
  var htmlLang = (document.documentElement.lang || "").toLowerCase().slice(0, 2);
  var urlLang = (window.location.pathname.split("/")[1] || "").toLowerCase();
  var language = supported.indexOf(urlLang) !== -1 ? urlLang : htmlLang;
  if (supported.indexOf(language) === -1) language = "sk";

  // Use the current widget until the language-specific IDs are supplied.
  var widget = widgets[language] || widgets.sk;
  if (!widget) return;

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  window.WebDesignFOXChatLanguage = language;

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://embed.tawk.to/" + widget.propertyId + "/" + widget.widgetId;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  document.head.appendChild(script);

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest(".live-chat-bubble");
    if (!trigger) return;
    event.preventDefault();
    if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
      window.Tawk_API.maximize();
    }
  });
})();
