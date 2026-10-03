/* WDFOX Jobcenter poster quality fix */
(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  function applyPosterFix(){
    var poster = document.getElementById('jobcenter-social-poster-2026-10-03');
    if (!poster) return false;
    var img = poster.querySelector('img');
    if (!img) return false;
    img.src = '/jobcenter/jobcenter-social-poster.svg?v=20261003-1401';
    img.removeAttribute('srcset');
    img.style.width = '100%';
    img.style.height = 'auto';
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
