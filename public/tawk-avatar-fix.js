/* WDFOX production: visual workaround promoted from the tested PREVIEW avatar fix for Widget 4.x. */
(function () {
  "use strict";

  // Tawk belongs only to top-level localized home pages, never embedded tools.
  if (window.self !== window.top ||
      !/^\/(?:sk|de|en|hr|fr|it|pl|es|sv)\/(?:index\.html)?$/.test(window.location.pathname)) return;


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

      var extraLinks = section.querySelector('[data-wdfox-email-links="1"]');
      if (extraLinks) extraLinks.remove();

      section.querySelectorAll('a').forEach(function (a) {
        var label = String(a.textContent || "").replace(/\s+/g, " ").trim();
        if (label.indexOf("postfachnachricht-04.10.2026 15_21_existenz.pdf") !== -1) a.remove();
      });

      var extracted = section.querySelector('#existenz-postfach-pdf-text');
      if (extracted) {
        extracted.querySelectorAll('p').forEach(function (p) {
          var text = String(p.textContent || "").replace(/\s+/g, " ").trim();
          if (
            text.indexOf("fbid=981014231708856") !== -1 ||
            text.indexOf("Anhang:") !== -1 ||
            text.indexOf("Unverz_gliche finanzielle Sicherung meiner Existenz_DE.pdf") !== -1 ||
            text.indexOf("Unverzügliche finanzielle Sicherung meiner Existenz_DE.pdf") !== -1 ||
            /\b1 von 1\b/i.test(text)
          ) p.remove();
        });
      }

      var body = section.querySelector(".outlook-view-body");
      if (body) {
        if (extracted && extracted.parentElement) {
          var extractedBlock = extracted.parentElement;
          if (body.firstElementChild !== extractedBlock) body.insertBefore(extractedBlock, body.firstElementChild);
          extractedBlock.style.borderTop = "0";
          extractedBlock.style.paddingTop = "0";
          extractedBlock.style.marginTop = "0";
          extractedBlock.style.marginBottom = "16px";
        }

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
    window.setTimeout(apply, 2500);
  }

  normalizeJobcenterExistenzMessage();

  var language = String(window.location.pathname.split("/")[1] || "").toLowerCase();
  if (language !== "de" && language !== "en" && language !== "sk" && language !== "fr" && language !== "hr" && language !== "pl" && language !== "it" && language !== "es" && language !== "sv") return;

  // Native Tawk avatars must be configured in Tawk, never painted over the iframe.
  var AVATAR_ID = "wdfox-tawk-trigger-avatar-fix";
  var staleOverlay = document.getElementById(AVATAR_ID);
  if (staleOverlay) staleOverlay.remove();
})();
