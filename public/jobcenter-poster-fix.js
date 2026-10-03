/* WDFOX Jobcenter poster exact-image fix */
(function(){
  'use strict';
  if (!/^\/jobcenter\/?$/.test(window.location.pathname)) return;

  var POSTER_URL = 'https://raw.githubusercontent.com/peterferenc246-design/WDFOX/main/privat/Jahrelange%20Arbeit%20%E2%80%93%20und%20dann_de.png';

  function replacePoster(){
    var existing = document.getElementById('jobcenter-social-poster-2026-10-03');
    if (existing) existing.remove();

    var poster = document.createElement('section');
    poster.id = 'jobcenter-social-poster-2026-10-03';
    poster.className = 'jobcenter-social-poster';
    poster.setAttribute('aria-label', 'Jahrelange Arbeit - und dann');

    var img = document.createElement('img');
    img.src = POSTER_URL;
    img.alt = 'Jahrelange Arbeit - und dann';
    img.decoding = 'async';
    img.loading = 'eager';
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxWidth = '1672px';
    img.style.margin = '0 auto';
    img.style.border = '0';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0 3px 16px rgba(0,0,0,.2)';

    poster.appendChild(img);
    document.body.appendChild(poster);
    return true;
  }

  function run(){
    replacePoster();
    setTimeout(replacePoster, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, {once:true});
  } else {
    run();
  }
})();
