/*
 * WebDesignFOX – Tawk.to language-aware widget loader
 *
 * Loads exactly one Tawk.to widget based on the language in the URL.
 */
(function () {
  "use strict";

  var widgets = {
    sk: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1b9121q" },
    de: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bb2aln" },
    en: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bb9ast" },
    hr: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bjvbjq" },
    fr: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1blk6o4" },
    it: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bovo5t" },
    pl: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bp5qda" },
    es: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bp6lk5" },
    sv: { propertyId: "6a951d52c3c46c344587662a", widgetId: "1k1bpdngj" }
  };

  var supported = Object.keys(widgets);
  var htmlLang = (document.documentElement.lang || "").toLowerCase().slice(0, 2);
  var urlLang = (window.location.pathname.split("/")[1] || "").toLowerCase();
  var language = supported.indexOf(urlLang) !== -1 ? urlLang : htmlLang;
  if (supported.indexOf(language) === -1) language = "sk";

  var widget = widgets[language] || widgets.sk;

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
