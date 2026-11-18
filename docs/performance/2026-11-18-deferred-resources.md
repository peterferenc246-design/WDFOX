# Follow-up: fonts and below-fold resources

Baseline: https://pagespeed.web.dev/analysis/https-www-foxprof-club-en/tixmepw6z4?form_factor=mobile

The supplied report fetched at 2026-11-18T09:01:31.912Z measures performance
82, accessibility 88, best practices 96, SEO 100, FCP 1.7 s, LCP 4.8 s,
TBT 20 ms and CLS 0.013. These are pre-change laboratory results.

## Changes

- Self-host the existing DM Sans and Plus Jakarta Sans variable fonts in
  WOFF2, with Latin and extended Latin coverage and their SIL OFL licenses.
  Keep font-display: swap and preload the heading's Latin font. Remove the
  external Google Fonts stylesheet and the associated DNS/preconnect chain.
  The baseline reports 750 ms of render-blocking font CSS.
- Keep contact map iframe URLs inert in data-map-src until within 200px of
  the viewport. Observe runtime-created maps as well as static markup.
  Browsers without IntersectionObserver keep an eager-loading fallback.
- Remove gallery preloading and pause rotation while outside the viewport or
  while the document is hidden. Use 384px WebP thumbnails. Load original
  full-resolution images only when the zoom modal is open. Keep next/previous
  controls, add Enter/Space opening and Escape closing.
- Scope Jobcenter evidence/poster injections to /jobcenter/. Remove existing
  copies before injecting one of each. Preserve the existing homepage-only
  chat policy and the predproduction iframe wrapper behavior.

The cache-TTL warning cannot be fixed with an HTML tag: GitHub Pages controls
those HTTP headers. Accessibility contrast/target-size and Tawk CORS findings
are outside this change.

## Verification

- Astro build passed for all 14 routes.
- 109 existing Node tests and 6 Python tests passed.
- New regression test executes the actual production postprocessor twice,
  checks evidence/poster deduplication and route scoping, preserves page text,
  and checks homepage chat injection.
- Actual postprocessing on built pages passed the home-only chat validator.
- Chromium checks passed at mobile 390x844/DPR 2 and desktop 1440x900/DPR 1:
  no external Google Fonts, maps or gallery image downloads at the top after
  5.5 seconds; local Latin/extended Latin fonts loaded; scrolling to portfolio
  loaded thumbnails; zoom and next loaded original images; Escape closed the
  modal; scrolling to contact initiated the map iframe request. The map response
  was stubbed in the interaction test; no claim is made about Google service
  availability. The contact form remained present.

No new PageSpeed score is claimed. Re-run the linked test after deployment.
