(function () {
  'use strict';
  var seen = new WeakSet();
  function load(frame) {
    var source = frame.getAttribute('data-map-src');
    if (!source || !frame.isConnected) return;
    frame.src = source;
    frame.removeAttribute('data-map-src');
  }
  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || !entry.target.getClientRects().length) return;
      load(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '200px 0px' }) : null;
  function scan() {
    document.querySelectorAll('iframe[data-map-src]').forEach(function (frame) {
      if (seen.has(frame)) return;
      seen.add(frame);
      if (observer) observer.observe(frame);
      else load(frame);
    });
  }
  function start() {
    scan();
    // The contact layout runtime can create its map after the initial DOM.
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
