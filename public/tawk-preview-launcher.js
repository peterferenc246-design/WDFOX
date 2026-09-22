/*
 * WDFOX Codespaces-only Tawk.to launcher.
 *
 * Preview contract:
 *   refresh -> FOX launcher only
 *   FOX click -> external Tawk.to widget opens
 *   minimize/hide -> FOX launcher returns
 *
 * This file is intentionally active only on localhost / GitHub Codespaces hosts.
 */
(function () {
  "use strict";

  var host = String(window.location.hostname || "").toLowerCase();
  var isPreviewHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".app.github.dev") ||
    host.endsWith(".github.dev");

  if (!isPreviewHost) return;
  if (document.getElementById("fox-tawk-preview-launcher")) return;

  // Prevent the production launcher-state helper from taking over Codespaces.
  // cunderlik-gallery-runtime.js checks this id before injecting tawk-native-force.js.
  if (!document.getElementById("wdfox-tawk-state-fix")) {
    var previewSentinel = document.createElement("meta");
    previewSentinel.id = "wdfox-tawk-state-fix";
    previewSentinel.setAttribute("data-preview-owner", "tawk-preview-launcher");
    document.head.appendChild(previewSentinel);
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
  var mascotUrl = "https://webdizain-bbyygbqm.manus.space/manus-storage/webdizainfox-fox-hero_22939d0f.png";

  // Keep the language contract visible to the shared WDFOX/Tawk code.
  window.WebDesignFOXChatLanguage = language;

  var style = document.createElement("style");
  style.id = "fox-tawk-preview-launcher-style";
  style.textContent =
    "#fox-tawk-preview-launcher{position:fixed!important;right:18px!important;bottom:18px!important;z-index:2147483647!important;width:238px!important;height:166px!important;border:0!important;padding:0!important;margin:0!important;background:transparent!important;cursor:pointer!important;filter:drop-shadow(0 8px 14px rgba(0,0,0,.22))!important;transition:transform .18s ease!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}" +
    "#fox-tawk-preview-launcher:hover{transform:translateY(-3px) scale(1.02)!important}#fox-tawk-preview-launcher:active{transform:scale(.97)!important}#fox-tawk-preview-launcher:focus-visible{outline:3px solid #0664e8!important;outline-offset:3px!important;border-radius:18px!important}" +
    "#fox-tawk-preview-launcher .fox-tawk-preview-label{position:absolute;left:10px;right:10px;top:4px;text-align:center;font:900 21px/1.08 Arial,Helvetica,sans-serif;color:#ff922d;text-shadow:-1px -1px 0 #0664e8,1px -1px 0 #0664e8,-1px 1px 0 #0664e8,1px 1px 0 #0664e8;letter-spacing:.01em;pointer-events:none}" +
    "#fox-tawk-preview-launcher .fox-tawk-preview-hello{position:absolute;left:18px;top:72px;font-size:29px;transform:rotate(-9deg);pointer-events:none}" +
    "#fox-tawk-preview-launcher .fox-tawk-preview-mascot{position:absolute;right:20px;bottom:0;width:142px;height:142px;object-fit:contain;pointer-events:none;user-select:none}" +
    "#fox-tawk-preview-launcher .fox-tawk-preview-badge{position:absolute;right:18px;bottom:16px;width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#c91f26;color:#fff;font:800 13px/1 Arial,sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.25);pointer-events:none}" +
    "@media(max-width:700px){#fox-tawk-preview-launcher{right:4px!important;bottom:8px!important;width:205px!important;height:145px!important}#fox-tawk-preview-launcher .fox-tawk-preview-label{font-size:18px!important}#fox-tawk-preview-launcher .fox-tawk-preview-mascot{width:124px;height:124px;right:16px}#fox-tawk-preview-launcher .fox-tawk-preview-hello{left:14px;top:64px;font-size:25px}}";
  document.head.appendChild(style);

  var launcher = document.createElement("button");
  launcher.id = "fox-tawk-preview-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", copy.open);
  launcher.innerHTML =
    '<span class="fox-tawk-preview-label">' + copy.attention + "</span>" +
    '<span class="fox-tawk-preview-hello" aria-hidden="true">👋</span>' +
    '<img class="fox-tawk-preview-mascot" alt="" aria-hidden="true" src="' + mascotUrl + '">' +
    '<span class="fox-tawk-preview-badge" aria-hidden="true">1</span>';

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

  function concealNativeFrames() {
    document.documentElement.classList.add("fox-tawk-concealed");
  }

  function revealNativeFrames() {
    document.documentElement.classList.remove("fox-tawk-concealed");
  }

  var userOpened = false;

  function hideNativeWidget() {
    if (userOpened) return;
    concealNativeFrames();
    var api = window.Tawk_API;
    if (!api) return;
    try {
      if (typeof api.hideWidget === "function") api.hideWidget();
    } catch (_) {}
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

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
