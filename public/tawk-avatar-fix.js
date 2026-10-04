/* WDFOX production: visual workaround promoted from the tested PREVIEW avatar fix for Widget 4.x. */
(function () {
  "use strict";

  function injectJobcenterPortalEvidence() {
    if (window.location.pathname !== "/jobcenter/" && window.location.pathname !== "/jobcenter") return;
    if (document.getElementById("portal-ausfall-2026-10-02")) return;

    var mount = function () {
      if (!document.body || document.getElementById("portal-ausfall-2026-10-02")) return;
      var section = document.createElement("section");
      section.className = "attachment evidence-section";
      section.id = "portal-ausfall-2026-10-02";
      section.innerHTML =
        '<hr class="evidence-divider">' +
        '<p class="update-date">Aktualisiert am: 02.10.2026</p>' +
        '<h2>Nachweis der Nichtverfügbarkeit des „ONLINE“-Portals</h2>' +
        '<p>Am 02.10.2026 war das Online-Portal der Bundesagentur für Arbeit beziehungsweise des Jobcenters erneut nicht erreichbar. Dadurch war es mir nicht möglich, die vorgesehenen Online-Dienste zuverlässig zu nutzen.</p>' +
        '<p>Besonders problematisch ist, dass damit zugleich auch der Zugang zur vorgesehenen Online-Unterstützung beziehungsweise zur Kontaktaufnahme mit dem Portal-Support beeinträchtigt war. Ein funktionsfähiger alternativer Kommunikationsweg wurde mir trotz der bestehenden technischen Störung nicht zur Verfügung gestellt.</p>' +
        '<p class="emph">Damit war aus meiner Sicht eine rechtzeitige elektronische Kommunikation mit dem Jobcenter erneut erheblich erschwert. Dies ist besonders kritisch, weil das Jobcenter diesen Kommunikationsweg selbst als „ONLINE“-Service bezeichnet und gleichzeitig Fristen sowie Mitwirkungspflichten an die Nutzung dieses Systems knüpft.</p>' +
        '<img src="https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Diese%20Website%20ist%20nicht%20erreichbar.png" alt="Nachweis der Nichtverfügbarkeit des Online-Portals der Bundesagentur für Arbeit / des Jobcenters am 2. Oktober 2026">' +
        '<p class="caption">Dokumentierter Nachweis vom 02.10.2026: Das Anmelde- beziehungsweise Online-Portal war nicht erreichbar; eine Verbindung über den vorgesehenen Online-Weg war nicht möglich.</p>';
      document.body.appendChild(section);
    };

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
    else mount();
  }

  injectJobcenterPortalEvidence();

  function normalizeJobcenterExistenzMessage() {
    if (window.location.pathname !== "/jobcenter/" && window.location.pathname !== "/jobcenter") return;

    function apply() {
      var section = document.getElementById("jobcenter-existenz-message-2026-10-04");
      if (!section) return false;

      var details = section.querySelector("details.outlook-details");
      if (details && !details.hasAttribute("data-wdfox-initialized")) {
        details.removeAttribute("open");
        details.setAttribute("data-wdfox-initialized", "1");
      }

      var body = section.querySelector(".outlook-view-body");
      if (body) {
        body.style.lineHeight = "1.45";
        body.style.padding = "16px 18px";
        body.querySelectorAll("p").forEach(function (p) {
          p.style.margin = "0 0 10px";
        });
        body.querySelectorAll("ul,ol").forEach(function (list) {
          list.style.marginTop = "4px";
          list.style.marginBottom = "12px";
        });
        body.querySelectorAll("li").forEach(function (li) {
          li.style.marginBottom = "6px";
        });
      }

      var summary = section.querySelector("summary.outlook-summary");
      if (summary) summary.style.cursor = "pointer";
      return true;
    }

    if (!apply()) {
      var observer = new MutationObserver(function () {
        if (apply()) observer.disconnect();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      window.setTimeout(function () { apply(); observer.disconnect(); }, 4000);
    }

    window.setTimeout(apply, 250);
    window.setTimeout(apply, 1300);
  }

  normalizeJobcenterExistenzMessage();

  var language = String(window.location.pathname.split("/")[1] || "").toLowerCase();
  if (language !== "de" && language !== "en" && language !== "sk" && language !== "fr" && language !== "hr" && language !== "pl" && language !== "it" && language !== "es" && language !== "sv") return;

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
