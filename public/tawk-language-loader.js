/*
 * WebDesignFOX – Tawk.to language-aware widget loader
 *
 * Loads exactly one Tawk.to widget based on the current localized page URL.
 */
(function () {
  "use strict";

  if (document.querySelector(".window-honda")) {
    var galleryStyle = document.createElement("link");
    galleryStyle.rel = "stylesheet";
    galleryStyle.href = "/cunderlik-gallery.css?v=1";
    document.head.appendChild(galleryStyle);
  }

  var PROPERTY_ID = "6a951d52c3c46c344587662a";
  var widgets = {
    sk: "1k1b9121q",
    de: "1k1bb2aln",
    en: "1k1bb9ast",
    hr: "1k1bjvbjq",
    fr: "1k1blk6o4",
    it: "1k1bovo5t",
    pl: "1k1bp5qda",
    es: "1k1bp6lk5",
    sv: "1k1bpdngj"
  };

  var supported = Object.keys(widgets);
  var normalizeLanguage = function (value) {
    return String(value || "").toLowerCase().split(/[-_]/)[0];
  };
  var urlLang = normalizeLanguage(window.location.pathname.split("/")[1]);
  var htmlLang = normalizeLanguage(document.documentElement.lang);
  var language = supported.indexOf(urlLang) !== -1 ? urlLang : htmlLang;
  if (supported.indexOf(language) === -1) language = "sk";

  // The localized URL is authoritative. Keeping the same value in storage makes
  // a later visit to the site root open the language explicitly chosen with a flag.
  try {
    localStorage.setItem("wdfox-language", language);
  } catch (_) {}

  var widgetId = widgets[language] || widgets.sk;
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  window.WebDesignFOXChatLanguage = language;
  window.WebDesignFOXSwitchChatLanguage = function (nextLanguage, callback) {
    var nextWidget = widgets[nextLanguage];
    if (!nextWidget || typeof window.Tawk_API.switchWidget !== "function") {
      callback();
      return;
    }
    if (typeof window.Tawk_API.endChat === "function") {
      try { window.Tawk_API.endChat(); } catch (_) {}
    }
    window.setTimeout(function () {
      window.Tawk_API.switchWidget({ propertyId: PROPERTY_ID, widgetId: nextWidget }, function () {
        callback();
      });
    }, 250);
  };
  var script = document.createElement("script");
  script.id = "tawk-language-script";
  script.async = true;
  script.src = "https://embed.tawk.to/" + PROPERTY_ID + "/" + widgetId;
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
