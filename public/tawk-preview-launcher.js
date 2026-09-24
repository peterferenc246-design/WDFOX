/* WDFOX Codespaces-only Tawk.to launcher — restored original FOX artwork. */
(function () {
  "use strict";

  var host = String(window.location.hostname || "").toLowerCase();
  var isPreviewHost = host === "localhost" || host === "127.0.0.1" || host.endsWith(".app.github.dev") || host.endsWith(".github.dev");
  if (!isPreviewHost) return;
  if (document.getElementById("fox-tawk-preview-launcher")) return;

  var PROPERTY_ID = window.WebDesignFOXTawkPropertyId || "6a951d52c3c46c344587662a";
  var WIDGETS = {
    sk: "1k1b9121q", de: "1k1bb2aln", en: "1k1bb9ast",
    hr: "1k1bjvbjq", fr: "1k1blk6o4", it: "1k1bovo5t",
    pl: "1k1bp5qda", es: "1k1bp6lk5", sv: "1k1bpdngj"
  };
  var COPY = {
    sk: { attention: "Som tu pre vás!", open: "Otvoriť živý chat" },
    de: { attention: "Ich bin für Sie da!", open: "Live-Chat öffnen" },
    en: { attention: "I am here for you!", open: "Open live chat" },
    hr: { attention: "Tu sam za vas!", open: "Otvori razgovor uživo" },
    fr: { attention: "Je suis là pour vous !", open: "Ouvrir le chat en direct" },
    it: { attention: "Sono qui per te!", open: "Apri la chat dal vivo" },
    pl: { attention: "Jestem tu dla Ciebie!", open: "Otwórz czat na żywo" },
    es: { attention: "¡Estoy aquí para ti!", open: "Abrir chat en vivo" },
    sv: { attention: "Jag finns här för dig!", open: "Öppna livechatten" }
  };

  function normalize(value) {
    return String(value || "").toLowerCase().split(/[-_]/)[0];
  }

  var urlLanguage = normalize(window.location.pathname.split("/")[1]);
  var htmlLanguage = normalize(document.documentElement.lang);
  var language = WIDGETS[urlLanguage] ? urlLanguage : htmlLanguage;
  if (!WIDGETS[language]) language = "sk";

  var widgetId = window.WebDesignFOXTawkWidgetId || WIDGETS[language];
  var copy = COPY[language] || COPY.sk;
  var fallbackUrl = "https://tawk.to/chat/" + PROPERTY_ID + "/" + widgetId + "?layout=modern";

  var style = document.createElement("style");
  style.id = "fox-tawk-preview-launcher-style";
  style.textContent =
    "#fox-tawk-preview-launcher{position:fixed!important;right:14px!important;bottom:12px!important;z-index:2147483647!important;width:270px!important;height:188px!important;border:0!important;padding:0!important;margin:0!important;background:transparent!important;cursor:pointer!important;filter:drop-shadow(0 7px 11px rgba(0,0,0,.16))!important;transition:transform .18s ease!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}" +
    "#fox-tawk-preview-launcher:hover{transform:translateY(-3px) scale(1.02)!important}#fox-tawk-preview-launcher:active{transform:scale(.97)!important}#fox-tawk-preview-launcher:focus-visible{outline:3px solid #0664e8!important;outline-offset:3px!important;border-radius:18px!important}" +
    "#fox-tawk-preview-launcher svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none!important}#fox-tawk-preview-launcher svg *{pointer-events:none!important}" +
    "html.fox-tawk-preview-concealed iframe[src*=\"tawk.to\"],html.fox-tawk-preview-concealed iframe[src*=\"tawk.link\"],html.fox-tawk-preview-concealed iframe[title*=\"chat widget\" i]{visibility:hidden!important;opacity:0!important;pointer-events:none!important}" +
    "@media(max-width:700px){#fox-tawk-preview-launcher{right:2px!important;bottom:6px!important;width:225px!important;height:157px!important}}";
  document.head.appendChild(style);

  var launcher = document.createElement("button");
  launcher.id = "fox-tawk-preview-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", copy.open);
  launcher.innerHTML =
    '<svg viewBox="0 0 270 188" role="img" aria-label="' + copy.attention.replace(/"/g, "&quot;") + ' — ' + copy.open.replace(/"/g, "&quot;") + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><path id="fox-preview-arc" d="M 54 74 Q 146 8 248 74"/></defs>' +
      '<text x="12" y="97" font-family="Arial,Helvetica,sans-serif" font-size="17" fill="#111">13</text>' +
      '<text font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="900" fill="#ff922d" stroke="#0664e8" stroke-width="2.6" paint-order="stroke" stroke-linejoin="round"><textPath href="#fox-preview-arc" startOffset="50%" text-anchor="middle" textLength="192" lengthAdjust="spacingAndGlyphs">' + copy.attention + '</textPath></text>' +
      '<text x="150" y="74" text-anchor="middle" font-size="31">❤️</text>' +
      '<text x="66" y="121" text-anchor="middle" font-size="31" transform="rotate(-10 66 121)">👋</text>' +
      '<text x="67" y="158" text-anchor="middle" font-size="28" transform="rotate(-5 67 158)">✍️</text>' +
      '<image x="91" y="73" width="118" height="116" preserveAspectRatio="xMidYMid meet" href="/images/tawk-fox-face.webp?v=20260924a"/>' +
      '<text x="238" y="122" text-anchor="middle" font-size="31" transform="rotate(6 238 122)">🤝</text>' +
    '</svg>';

  var userOpened = false;

  function showLauncher() {
    launcher.style.setProperty("display", "block", "important");
    launcher.style.setProperty("visibility", "visible", "important");
    launcher.style.setProperty("opacity", "1", "important");
    launcher.style.setProperty("pointer-events", "auto", "important");
  }

  function hideLauncher() {
    launcher.style.setProperty("display", "none", "important");
    launcher.style.setProperty("visibility", "hidden", "important");
    launcher.style.setProperty("opacity", "0", "important");
    launcher.style.setProperty("pointer-events", "none", "important");
  }

  function concealTawk() {
    document.documentElement.classList.add("fox-tawk-preview-concealed");
  }

  function revealTawk() {
    document.documentElement.classList.remove("fox-tawk-preview-concealed");
  }

  function hideNativeWidget() {
    if (userOpened) return;
    concealTawk();
    var api = window.Tawk_API || {};
    try { if (typeof api.minimize === "function") api.minimize(); } catch (_) {}
    try { if (typeof api.hideWidget === "function") api.hideWidget(); } catch (_) {}
  }

  function ensureExternalTawk() {
    if (document.getElementById("tawk-language-script")) return;
    var existing = document.querySelector('script[src*="embed.tawk.to/' + PROPERTY_ID + '/"]');
    if (existing) return;
    var script = document.createElement("script");
    script.id = "tawk-language-script";
    script.async = true;
    script.src = "https://embed.tawk.to/" + PROPERTY_ID + "/" + widgetId;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);
  }

  function openChat() {
    var api = window.Tawk_API || {};
    if (typeof api.maximize !== "function") return false;
    try {
      userOpened = true;
      revealTawk();
      if (typeof api.showWidget === "function") api.showWidget();
      api.maximize();
      hideLauncher();
      return true;
    } catch (_) {
      userOpened = false;
      concealTawk();
      showLauncher();
      return false;
    }
  }

  window.Tawk_API = window.Tawk_API || {};
  var previousOnLoad = window.Tawk_API.onLoad;
  var previousOnMaximized = window.Tawk_API.onChatMaximized;
  var previousOnMinimized = window.Tawk_API.onChatMinimized;
  var previousOnHidden = window.Tawk_API.onChatHidden;

  window.Tawk_API.onLoad = function () {
    try { if (typeof previousOnLoad === "function") previousOnLoad.apply(this, arguments); } catch (_) {}
    if (!userOpened) {
      hideNativeWidget();
      showLauncher();
    }
  };

  window.Tawk_API.onChatMaximized = function () {
    try { if (typeof previousOnMaximized === "function") previousOnMaximized.apply(this, arguments); } catch (_) {}
    if (!userOpened) {
      hideNativeWidget();
      showLauncher();
      return;
    }
    revealTawk();
    hideLauncher();
  };

  window.Tawk_API.onChatMinimized = function () {
    try { if (typeof previousOnMinimized === "function") previousOnMinimized.apply(this, arguments); } catch (_) {}
    userOpened = false;
    hideNativeWidget();
    showLauncher();
  };

  window.Tawk_API.onChatHidden = function () {
    try { if (typeof previousOnHidden === "function") previousOnHidden.apply(this, arguments); } catch (_) {}
    userOpened = false;
    hideNativeWidget();
    showLauncher();
  };

  launcher.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (openChat()) return;
    ensureExternalTawk();
    var startedAt = Date.now();
    var timer = window.setInterval(function () {
      if (openChat()) {
        window.clearInterval(timer);
        return;
      }
      if (Date.now() - startedAt > 5000) {
        window.clearInterval(timer);
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    }, 150);
  });

  function mount() {
    if (!document.body.contains(launcher)) document.body.appendChild(launcher);
    userOpened = false;
    concealTawk();
    showLauncher();
    hideNativeWidget();
    ensureExternalTawk();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();

  var guardRuns = 0;
  var guard = window.setInterval(function () {
    guardRuns += 1;
    if (!userOpened) {
      hideNativeWidget();
      showLauncher();
    }
    if (guardRuns >= 120) window.clearInterval(guard);
  }, 500);
})();
