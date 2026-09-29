/* WDFOX production: tested preview behavior mapped to production Tawk widgets. */
(function () {
  "use strict";

  document.documentElement.classList.add("fox-tawk-concealed");
  if (!document.getElementById("fox-tawk-no-flash")) {
    var guardStyle = document.createElement("style");
    guardStyle.id = "fox-tawk-no-flash";
    guardStyle.textContent =
      'html.fox-tawk-concealed iframe[src*="tawk.to"],html.fox-tawk-concealed iframe[src*="tawk.link"],html.fox-tawk-concealed iframe[title*="chat widget" i]{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    document.head.appendChild(guardStyle);
  }

  var PROPERTY_ID = "6a951d52c3c46c344587662a";
  var PROPERTY_IDS = {
    sk: "6a951d52c3c46c344587662a",
    de: "6a951d52c3c46c344587662a",
    en: "6a951d52c3c46c344587662a",
    hr: "6a951d52c3c46c344587662a",
    fr: "6a951d52c3c46c344587662a",
    it: "6a951d52c3c46c344587662a",
    pl: "6a951d52c3c46c344587662a",
    es: "6a951d52c3c46c344587662a",
    sv: "6a951d52c3c46c344587662a"
  };
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
    script.setAttribute("data-wdfox-production", "external-tawk");
    script.setAttribute("data-wdfox-language", language);
    document.head.appendChild(script);
  }

  function endCurrentChat(done) {
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      if (typeof done === "function") done();
    };

    try {
      if (window.Tawk_API && typeof window.Tawk_API.endChat === "function") {
        window.Tawk_API.endChat(function () {
          finish();
        });
        window.setTimeout(finish, 900);
        return;
      }
    } catch (_) {}

    finish();
  }

  function switchProductionChatLanguage(nextLanguage, done) {
    var next = normalize(nextLanguage);
    if (!WIDGETS[next]) next = "sk";

    try { localStorage.setItem("wdfox-language", next); } catch (_) {}
    window.WebDesignFOXChatLanguage = next;
    window.WebDesignFOXTawkPropertyId = PROPERTY_ID;
    window.WebDesignFOXTawkWidgetId = WIDGETS[next];
    document.documentElement.setAttribute("data-wdfox-tawk-language", next);
    document.documentElement.setAttribute("data-wdfox-tawk-widget", WIDGETS[next]);

    // Production uses one Tawk property for all language widgets.
    // End the current conversation before the full page navigation so
    // messages from the previous language cannot leak into the next widget.
    endCurrentChat(done);
  }

  window.WebDesignFOXSwitchChatLanguage = switchProductionChatLanguage;

  function installLanguageNavigationGuard() {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var target = event.target;
      var link = target && target.closest ? target.closest("#fixed-lang-layer a.language-flag[data-language]") : null;
      if (!link) return;

      var next = normalize(link.getAttribute("data-language"));
      if (!WIDGETS[next] || next === language) return;

      event.preventDefault();
      var href = link.href;
      var navigated = false;
      var navigate = function () {
        if (navigated) return;
        navigated = true;
        window.location.assign(href);
      };

      switchProductionChatLanguage(next, navigate);
      window.setTimeout(navigate, 1100);
    }, true);
  }

  installLanguageNavigationGuard();
  injectWidget(widgetId);
})();
