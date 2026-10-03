/* WDFOX Jobcenter poster quality fix */
(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  var POSTER_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Jahrelange%20Arbeit%20%E2%80%93%20und%20dann_de.png?v=20261003-1415';

  function applyPosterFix(){
    var poster = document.getElementById('jobcenter-social-poster-2026-10-03');
    if (!poster) return false;
    var img = poster.querySelector('img');
    if (!img) return false;
    img.src = POSTER_URL;
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxWidth = '1672px';
    img.style.margin = '0 auto';
    img.style.imageRendering = 'auto';
    return true;
  }

  if (applyPosterFix()) return;

  var observer = new MutationObserver(function(){
    if (applyPosterFix()) observer.disconnect();
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});
  setTimeout(function(){ observer.disconnect(); applyPosterFix(); }, 5000);
})();
