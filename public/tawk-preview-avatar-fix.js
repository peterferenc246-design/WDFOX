/* WDFOX preview: visual workaround for Tawk.to trigger avatar rendering in Widget 4.x.
   Scope: PREVIEW only. First validation pass: DE only. */
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

  var language = String(window.location.pathname.split("/")[1] || "").toLowerCase();
  if (language !== "de") return;

  var AVATAR_ID = "wdfox-tawk-trigger-avatar-fix";
  var AVATAR_SRC = "/images/peter-ferenc.jpg?v=20260928-avatar1";

  function tawkApi() {
    return window.Tawk_API || {};
  }

  function isChatMaximized() {
    try {
      return typeof tawkApi().isChatMaximized === "function" && tawkApi().isChatMaximized();
    } catch (_) {
      return false;
    }
  }

  function findVisibleTawkFrame() {
    var frames = Array.prototype.slice.call(document.querySelectorAll("iframe"));
    var candidates = frames.filter(function (frame) {
      var src = String(frame.src || "").toLowerCase();
      var title = String(frame.title || "").toLowerCase();
      if (src.indexOf("tawk.to") === -1 && src.indexOf("tawk.link") === -1 && title.indexOf("chat widget") === -1) return false;
      var rect = frame.getBoundingClientRect();
      var style = window.getComputedStyle(frame);
      return rect.width >= 280 && rect.height >= 360 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) !== 0;
    });

    candidates.sort(function (a, b) {
      var ra = a.getBoundingClientRect();
      var rb = b.getBoundingClientRect();
      return rb.width * rb.height - ra.width * ra.height;
    });

    return candidates[0] || null;
  }

  function ensureAvatar() {
    var avatar = document.getElementById(AVATAR_ID);
    if (avatar) return avatar;

    avatar = document.createElement("img");
    avatar.id = AVATAR_ID;
    avatar.src = AVATAR_SRC;
    avatar.alt = "Peter Ferenc";
    avatar.setAttribute("aria-hidden", "true");
    avatar.style.position = "fixed";
    avatar.style.display = "none";
    avatar.style.borderRadius = "999px";
    avatar.style.objectFit = "cover";
    avatar.style.background = "#ffffff";
    avatar.style.border = "3px solid #ffffff";
    avatar.style.boxShadow = "0 1px 3px rgba(0,0,0,.15)";
    avatar.style.pointerEvents = "none";
    avatar.style.zIndex = "2147483647";
    avatar.style.margin = "0";
    avatar.style.padding = "0";
    document.body.appendChild(avatar);
    return avatar;
  }

  function hideAvatar() {
    var avatar = document.getElementById(AVATAR_ID);
    if (avatar) avatar.style.display = "none";
  }

  function positionAvatar() {
    if (!isChatMaximized()) {
      hideAvatar();
      return;
    }

    var frame = findVisibleTawkFrame();
    if (!frame) {
      hideAvatar();
      return;
    }

    var rect = frame.getBoundingClientRect();
    var avatar = ensureAvatar();
    var size = Math.max(36, Math.min(42, Math.round(rect.width * 0.112)));

    /* Tawk Widget 4.x places the welcome-trigger avatar at a stable point
       in the maximized desktop iframe. Use proportional offsets so the
       overlay follows desktop width changes and browser zoom. */
    var left = Math.round(rect.left + rect.width * 0.055);
    var top = Math.round(rect.top + rect.height * 0.526);

    avatar.style.width = size + "px";
    avatar.style.height = size + "px";
    avatar.style.left = left + "px";
    avatar.style.top = top + "px";
    avatar.style.display = "block";

    /* Keep the visual patch above the cross-origin iframe even if Tawk
       recreates or reorders its iframe nodes. */
    if (avatar.parentNode === document.body) document.body.appendChild(avatar);
  }

  var timer = window.setInterval(positionAvatar, 250);
  window.addEventListener("resize", positionAvatar);
  window.addEventListener("scroll", positionAvatar, { passive: true });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) hideAvatar();
    else positionAvatar();
  });

  window.addEventListener("beforeunload", function () {
    window.clearInterval(timer);
  });
})();
