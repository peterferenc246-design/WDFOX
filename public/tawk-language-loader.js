/* WDFOX production: external Tawk.to connection mirrored from tested preview. */
(function () {
  "use strict";


  // Start concealed so Tawk cannot restore its native bubble/window before the FOX launcher owns the state.
  document.documentElement.classList.add("fox-tawk-concealed");
  if (!document.getElementById("fox-tawk-no-flash")) {
    var guardStyle = document.createElement("style");
    guardStyle.id = "fox-tawk-no-flash";
    guardStyle.textContent =
      'html.fox-tawk-concealed iframe[src*="tawk.to"],html.fox-tawk-concealed iframe[src*="tawk.link"],html.fox-tawk-concealed iframe[title*="chat widget" i]{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    document.head.appendChild(guardStyle);
  }

  var PROPERTY_ID = "6a951d52c3c46c344587662a";
  var WIDGETS = {
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

  function normalize(value) {
    return String(value || "").toLowerCase().split(/[-_]/)[0];
  }

  var urlLanguage = normalize(window.location.pathname.split("/")[1]);
  var htmlLanguage = normalize(document.documentElement.lang);
  var language = WIDGETS[urlLanguage] ? urlLanguage : htmlLanguage;
  if (!WIDGETS[language]) language = "sk";

  var widgetId = WIDGETS[language];

  try { localStorage.setItem("wdfox-language", language); } catch (_) {}

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
  window.WebDesignFOXChatLanguage = language;
  window.WebDesignFOXTawkPropertyId = PROPERTY_ID;
  window.WebDesignFOXTawkWidgetId = widgetId;

  window.WebDesignFOXSwitchChatLanguage = function (nextLanguage, done) {
    var next = normalize(nextLanguage);
    if (WIDGETS[next]) {
      try { localStorage.setItem("wdfox-language", next); } catch (_) {}
    }
    var finish = function () {
      if (typeof done === "function") done();
    };
    try {
      if (window.Tawk_API && typeof window.Tawk_API.endChat === "function") {
        window.Tawk_API.endChat();
        window.setTimeout(finish, 120);
        return;
      }
    } catch (_) {}
    finish();
  };

  if (document.getElementById("tawk-language-script")) return;
  if (document.querySelector('script[src*="embed.tawk.to/' + PROPERTY_ID + '/"]')) return;

  var script = document.createElement("script");
  script.id = "tawk-language-script";
  script.async = true;
  script.src = "https://embed.tawk.to/" + PROPERTY_ID + "/" + widgetId;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  script.setAttribute("data-wdfox-production", "external-tawk");
  document.head.appendChild(script);
})();
