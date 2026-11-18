# Mobile image-loading audit — 2026-11-18

Source: https://pagespeed.web.dev/analysis/https-www-foxprof-club-en/g8zx31ewhk?form_factor=mobile

## Baseline (supplied report, not a new post-change measurement)

- Page: https://www.foxprof.club/en/
- Lighthouse fetch time: 2026-11-18T08:16:39.498Z
- Performance 74; accessibility 88; best practices 96; SEO 100.
- FCP 1.7 s; LCP 28.2 s; TBT 40 ms; CLS 0.013; Speed Index 1.9 s.
- Total network transfer: approximately 6,370 KiB.
- No sufficient CrUX field data for this page. These are laboratory results.

## Implemented change

The LCP element was the fox mascot. It used a 1920×1920 PNG served via an
external Manus redirect and a signed CloudFront URL. The report recorded
4,598,026 image bytes. The same image was also used in the about section.

Serve the same artwork locally with transparent WebP variants:

| Width | File bytes |
| --- | ---: |
| 384 | 40,942 |
| 768 | 111,552 |
| 1024 | 176,070 |

The 768-wide variant is 97.6% smaller than the reported PNG; the largest
variant is 96.2% smaller. The browser selects one candidate per image, not all
three. The hero is eager/high-priority with declared dimensions; the about
image is lazy. Visual CSS and copy are unchanged.

Also replace the external Honda portfolio JPEG with an 800×475 WebP
(83,746 bytes) and the portrait with a 450×300 WebP (18,044 bytes), preserving
the existing images. Both are lazy and have intrinsic dimensions. The shared
Landing component applies to all nine language homepages. Original portrait
and gallery assets are retained for other consumers.

## Remaining findings (outside this image-only change)

- Google Fonts stylesheet is render blocking (reported duration 751 ms).
- Google Maps contributes unused JavaScript; defer interactive map loading
  until the contact section is visible or the visitor requests it.
- Gallery runtime preloads all photos; load on visibility/interaction instead.
- Jobcenter scripts are injected into homepages by the deployment workflow;
  scope them to Jobcenter after verifying its evidence and poster behavior.
- English Tawk embed returned CORS errors in the supplied report.
- Accessibility: orange/white contrast, small language targets, invalid
  aria-pressed on a div, and skipped heading level in the contact section.
- GitHub Pages controls cache headers; do not promise an immutable-cache
  policy through HTML tags or a nonfunctional headers file.

## Verification limits

Asset byte counts are deterministic. A new PageSpeed score and mobile LCP
must be measured against a deployed preview/production build; no improved
score is claimed from byte savings alone. Production remains unchanged until
this branch is reviewed and merged.

Local verification completed:

- Installed dependencies with the repository-pinned pnpm 10.4.1 and frozen lockfile.
- Astro production build passed: 14 routes, including nine language homepages.
- Chromium checks passed at 390×844 / DPR 2 and 1440×900 / DPR 1.
- The hero decoded, kept its square aspect ratio, and selected the 768px local
  candidate in both tested viewports. All four changed image elements decoded.
- Verified lazy loading and intrinsic dimensions for the three below-fold
  images, all nine language links, and the contact CTA anchor.
- No requests to the original Manus mascot or Honda image host were observed.
- Browser checks cover the built page and image behavior, not the GitHub Pages
  post-build Tawk injection or a new remote Lighthouse run.
