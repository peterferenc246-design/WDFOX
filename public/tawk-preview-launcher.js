/* WDFOX Codespaces-only Tawk.to launcher. */
(function () {
  "use strict";

  var host = String(window.location.hostname || "").toLowerCase();
  var isPreviewHost = host === "localhost" || host === "127.0.0.1" || host.endsWith(".app.github.dev") || host.endsWith(".github.dev");
  if (!isPreviewHost) return;
  if (document.getElementById("fox-tawk-preview-launcher")) return;

  if (!document.getElementById("wdfox-tawk-state-fix")) {
    var previewSentinel = document.createElement("meta");
    previewSentinel.id = "wdfox-tawk-state-fix";
    previewSentinel.setAttribute("data-preview-owner", "tawk-preview-launcher");
    document.head.appendChild(previewSentinel);
  }

  var PROPERTY_ID = "6a951d52c3c46c344587662a";
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

  function normalizeLanguage(value) {
    return String(value || "").toLowerCase().split(/[-_]/)[0];
  }

  var urlLanguage = normalizeLanguage(window.location.pathname.split("/")[1]);
  var htmlLanguage = normalizeLanguage(document.documentElement.lang);
  var language = WIDGETS[urlLanguage] ? urlLanguage : htmlLanguage;
  if (!WIDGETS[language]) language = "sk";

  var widgetId = WIDGETS[language];
  var copy = COPY[language] || COPY.sk;
  var fallbackUrl = "https://tawk.to/chat/" + PROPERTY_ID + "/" + widgetId + "?layout=modern";
  var mascotUrl = "data:image/webp;base64,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";

  window.WebDesignFOXChatLanguage = language;

  var style = document.createElement("style");
  style.id = "fox-tawk-preview-launcher-style";
  style.textContent =
    "#fox-tawk-preview-launcher{position:fixed!important;top:auto!important;left:auto!important;right:18px!important;bottom:18px!important;margin:0!important;z-index:2147483647!important;width:250px!important;height:174px!important;padding:0!important;border:0!important;background:transparent!important;cursor:pointer!important;pointer-events:auto!important;filter:drop-shadow(0 8px 12px rgba(0,0,0,.18))!important;transition:transform .18s ease!important;touch-action:manipulation;isolation:isolate;display:block!important;visibility:visible!important;opacity:1!important}" +
    "#fox-tawk-preview-launcher:hover{transform:translateY(-3px) scale(1.025)!important}#fox-tawk-preview-launcher:active{transform:scale(.97)!important}#fox-tawk-preview-launcher:focus-visible{outline:3px solid #0664e8!important;outline-offset:3px!important}" +
    "#fox-tawk-preview-launcher svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none!important}#fox-tawk-preview-launcher svg *{pointer-events:none!important}" +
    "@media(max-width:700px){#fox-tawk-preview-launcher{right:4px!important;bottom:8px!important;width:210px!important;height:146px!important}}";
  document.head.appendChild(style);

  var launcher = document.createElement("button");
  launcher.id = "fox-tawk-preview-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", copy.open);
  launcher.innerHTML =
    '<svg viewBox="0 0 250 174" role="img" aria-label="' + copy.attention + ' — ' + copy.open + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><path id="fox-preview-launcher-arc" d="M 8 76 Q 125 2 242 76"/></defs>' +
      '<text font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="900" fill="#ff922d" stroke="#0664e8" stroke-width="2.8" paint-order="stroke" stroke-linejoin="round"><textPath href="#fox-preview-launcher-arc" startOffset="50%" text-anchor="middle">' + copy.attention + '</textPath></text>' +
      '<text x="40" y="108" text-anchor="middle" font-size="28" transform="rotate(-10 40 108)">👋</text>' +
      '<text x="40" y="143" text-anchor="middle" font-size="25" transform="rotate(-5 40 143)">✍</text>' +
      '<image x="63" y="62" width="124" height="116" preserveAspectRatio="xMidYMid meet" href="' + mascotUrl + '"/>' +
      '<text x="125" y="68" text-anchor="middle" font-size="29">❤️</text>' +
      '<text x="207" y="110" text-anchor="middle" font-size="28" transform="rotate(5 207 110)">🤝</text>' +
    '</svg>';

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

  function concealNativeFrames() { document.documentElement.classList.add("fox-tawk-concealed"); }
  function revealNativeFrames() { document.documentElement.classList.remove("fox-tawk-concealed"); }

  var userOpened = false;

  function hideNativeWidget() {
    if (userOpened) return;
    concealNativeFrames();
    var api = window.Tawk_API;
    if (!api) return;
    try { if (typeof api.hideWidget === "function") api.hideWidget(); } catch (_) {}
  }

  function openEmbeddedChat() {
    var api = window.Tawk_API;
    if (!api || typeof api.maximize !== "function") return false;
    try {
      userOpened = true;
      revealNativeFrames();
      if (typeof api.showWidget === "function") api.showWidget();
      api.maximize();
      hideLauncher();
      return true;
    } catch (_) {
      userOpened = false;
      concealNativeFrames();
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
    userOpened = false;
    hideNativeWidget();
    showLauncher();
  };
  window.Tawk_API.onChatMaximized = function () {
    try { if (typeof previousOnMaximized === "function") previousOnMaximized.apply(this, arguments); } catch (_) {}
    userOpened = true;
    revealNativeFrames();
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

  launcher.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (openEmbeddedChat()) return;
    ensureExternalTawk();
    var startedAt = Date.now();
    var timer = window.setInterval(function () {
      if (openEmbeddedChat()) {
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
    concealNativeFrames();
    showLauncher();
    hideNativeWidget();
    ensureExternalTawk();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();

  var attempts = 0;
  var guard = window.setInterval(function () {
    attempts += 1;
    if (!userOpened) {
      hideNativeWidget();
      showLauncher();
    }
    if (attempts >= 240) window.clearInterval(guard);
  }, 500);
})();
