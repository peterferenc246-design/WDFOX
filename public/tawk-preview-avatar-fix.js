/* WDFOX preview: visual workaround for Tawk.to trigger avatar rendering in Widget 4.x.
   Scope: PREVIEW only. Validated for DE, EN, SK, FR, HR and PL; enabled for IT test. */
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
  if (language !== "de" && language !== "en" && language !== "sk" && language !== "fr" && language !== "hr" && language !== "pl" && language !== "it") return;

  var AVATAR_ID = "wdfox-tawk-trigger-avatar-fix";
  var AVATAR_SRC = "/images/peter-ferenc.jpg?v=20260928-avatar2";

  function isVisible(frame) {
    try {
      var rect = frame.getBoundingClientRect();
      var style = window.getComputedStyle(frame);
      return (
        rect.width >= 280 &&
        rect.width <= 560 &&
        rect.height >= 360 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) !== 0
      );
    } catch (_) {
      return false;
    }
  }

  function geometryLooksLikeOpenChat(frame) {
    var rect = frame.getBoundingClientRect();
    var nearRight = rect.right >= window.innerWidth - 140;
    var nearBottom = rect.bottom >= window.innerHeight - 180;
    return nearRight && nearBottom;
  }

  function findVisibleTawkFrame() {
    var frames = Array.prototype.slice.call(document.querySelectorAll("iframe"));

    var explicit = frames.filter(function (frame) {
      if (!isVisible(frame)) return false;
      var src = String(frame.getAttribute("src") || frame.src || "").toLowerCase();
      var title = String(frame.getAttribute("title") || frame.title || "").toLowerCase();
      return (
        src.indexOf("tawk.to") !== -1 ||
        src.indexOf("tawk.link") !== -1 ||
        title.indexOf("tawk") !== -1 ||
        title.indexOf("chat widget") !== -1
      );
    });

    var candidates = explicit.length
      ? explicit
      : frames.filter(function (frame) {
          return isVisible(frame) && geometryLooksLikeOpenChat(frame);
        });

    candidates.sort(function (a, b) {
      var ra = a.getBoundingClientRect();
      var rb = b.getBoundingClientRect();
      var scoreA = (ra.right >= window.innerWidth - 140 ? 1000000 : 0) + ra.width * ra.height;
      var scoreB = (rb.right >= window.innerWidth - 140 ? 1000000 : 0) + rb.width * rb.height;
      return scoreB - scoreA;
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
    avatar.setAttribute("data-wdfox-avatar-fix", language);
    avatar.style.position = "fixed";
    avatar.style.display = "none";
    avatar.style.borderRadius = "999px";
    avatar.style.objectFit = "cover";
    avatar.style.background = "#ffffff";
    avatar.style.border = "3px solid #ffffff";
    avatar.style.boxShadow = "0 1px 4px rgba(0,0,0,.20)";
    avatar.style.pointerEvents = "none";
    avatar.style.zIndex = "2147483647";
    avatar.style.margin = "0";
    avatar.style.padding = "0";
    avatar.style.transform = "none";
    document.body.appendChild(avatar);
    return avatar;
  }

  function hideAvatar() {
    var avatar = document.getElementById(AVATAR_ID);
    if (avatar) avatar.style.display = "none";
  }

  function positionAvatar() {
    var frame = findVisibleTawkFrame();
    if (!frame) {
      hideAvatar();
      return;
    }

    var rect = frame.getBoundingClientRect();
    var avatar = ensureAvatar();
    var size = Math.max(36, Math.min(42, Math.round(rect.width * 0.112)));

    /* Widget 4.x welcome-trigger avatar position, measured against the
       visible chat iframe. The overlay is outside the cross-origin iframe. */
    var left = Math.round(rect.left + rect.width * 0.055);
    var top = Math.round(rect.top + rect.height * 0.526);

    avatar.style.width = size + "px";
    avatar.style.height = size + "px";
    avatar.style.left = left + "px";
    avatar.style.top = top + "px";
    avatar.style.display = "block";

    /* Move to the end of <body> on every pass so it stays above Tawk's
       own iframe when Tawk recreates its DOM. */
    document.body.appendChild(avatar);
  }

  var timer = window.setInterval(positionAvatar, 180);
  window.addEventListener("resize", positionAvatar);
  window.addEventListener("scroll", positionAvatar, { passive: true });
  window.addEventListener("focus", positionAvatar);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) hideAvatar();
    else positionAvatar();
  });

  window.addEventListener("beforeunload", function () {
    window.clearInterval(timer);
  });
})();
