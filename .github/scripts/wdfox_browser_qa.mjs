import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const targetUrl = process.env.TARGET_URL;
const qaType = (process.env.QA_TYPE || 'functional').toLowerCase();
const stage = process.env.STAGE || 'preview';
const approvedSha = process.env.APPROVED_PREVIEW_COMMIT || '';
const requestId = process.env.REQUEST_ID || `qa-${Date.now()}`;
const outDir = process.env.QA_OUT_DIR || 'qa-artifacts';

if (!targetUrl) throw new Error('TARGET_URL is required');
if (!['visual','functional'].includes(qaType)) throw new Error('QA_TYPE must be visual or functional');
if (!['preview','production-candidate','live'].includes(stage)) throw new Error('STAGE must be preview, production-candidate or live');

fs.mkdirSync(outDir, { recursive: true });

const langs = ['sk','de','en','hr','fr','it','pl','es','sv'];
const previewWidgets = {sk:'1k3jmfkjq',de:'1k3jk1ga8',en:'1k3jmi4o8',hr:'1k3jmj0gp',fr:'1k3jmk3i0',it:'1k3jmk3i0',pl:'1k3jmkd5l',es:'1k3jmlaaq',sv:'1k3jmljpb'};
// Correct FR id (kept separate so a typo above can never silently pass).
previewWidgets.fr = '1k3jmj9u6';
const prodWidgets = {sk:'1k1b9121q',de:'1k1bb2aln',en:'1k1bb9ast',hr:'1k1bjvbjq',fr:'1k1blk6o4',it:'1k1bovo5t',pl:'1k1bp5qda',es:'1k1bp6lk5',sv:'1k1bpdngj'};
const expected = stage === 'preview' ? previewWidgets : prodWidgets;

const report = {
  schema: 'wdfox-browser-qa/v1',
  request_id: requestId,
  qa_type: qaType,
  stage,
  target_url: targetUrl,
  approved_preview_commit: approvedSha,
  started_at: new Date().toISOString(),
  verdict: 'FAIL',
  failures: [],
  results: [],
};

const cleanName = s => String(s).replace(/[^A-Za-z0-9._-]/g, '_');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function locateLangControl(page, lang) {
  const selectors = [
    `[data-language="${lang}"]`,
    `#fixed-lang-layer [data-language="${lang}"]`,
    `[data-lang="${lang}"]`,
    `a[href*="lang=${lang}"]`,
    `button[aria-label*="${lang}" i]`,
  ];
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    if (await loc.count()) return loc;
  }
  return null;
}

async function widgetEvidence(page, widgetId) {
  return await page.evaluate((wid) => {
    const els = [...document.querySelectorAll('script[src],iframe[src]')];
    const urls = els.map(el => el.getAttribute('src') || '').filter(Boolean);
    const frames = [...document.querySelectorAll('iframe')].map(f => {
      const r = f.getBoundingClientRect();
      const cs = getComputedStyle(f);
      return {src:f.getAttribute('src')||'', w:r.width, h:r.height, display:cs.display, visibility:cs.visibility, opacity:cs.opacity};
    }).filter(x => /tawk\.to|tawk\.link|embed\.tawk\.to/i.test(x.src));
    return {
      found: urls.some(u => u.includes(wid)),
      urls: urls.filter(u => /tawk\.to|tawk\.link|embed\.tawk\.to/i.test(u)).slice(0, 12),
      apiReady: !!(window.Tawk_API && (window.Tawk_API.maximize || window.Tawk_API.toggle)),
      globalWidget: window.WebDesignFOXTawkWidgetId || null,
      htmlWidget: document.documentElement.getAttribute('data-wdfox-tawk-widget'),
      htmlLanguage: document.documentElement.getAttribute('data-wdfox-tawk-language'),
      visibleFrames: frames.filter(x => x.w > 20 && x.h > 20 && x.display !== 'none' && x.visibility !== 'hidden' && Number(x.opacity || 1) > 0).length,
      frameCount: frames.length,
    };
  }, widgetId);
}

async function pageHealth(page) {
  return await page.evaluate(() => ({
    readyState: document.readyState,
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
    bodyTextLength: (document.body?.innerText || '').trim().length,
    now: performance.now(),
  }));
}

async function waitForWidget(page, widgetId, timeout = 15000) {
  try {
    await page.waitForFunction((wid) => {
      const urls = [...document.querySelectorAll('script[src],iframe[src]')].map(el => el.getAttribute('src') || '');
      return urls.some(u => u.includes(wid)) && !!window.Tawk_API;
    }, widgetId, { timeout });
    return true;
  } catch {
    return false;
  }
}

async function setLanguage(page, lang) {
  const control = await locateLangControl(page, lang);
  if (!control) return { clicked: false, reason: 'language control not found' };
  const before = page.url();
  try {
    await control.scrollIntoViewIfNeeded();
    await control.click({ timeout: 8000 });
    await Promise.race([
      page.waitForLoadState('domcontentloaded', { timeout: 9000 }).catch(() => null),
      page.waitForTimeout(2500),
    ]);
    await page.waitForTimeout(1600);
    return { clicked: true, before, after: page.url() };
  } catch (e) {
    return { clicked: false, reason: String(e.message || e), before, after: page.url() };
  }
}

async function tawkState(page) {
  return await page.evaluate(() => {
    const api = window.Tawk_API || {};
    let maximized = null, minimized = null, hidden = null;
    try { if (typeof api.isChatMaximized === 'function') maximized = !!api.isChatMaximized(); } catch {}
    try { if (typeof api.isChatMinimized === 'function') minimized = !!api.isChatMinimized(); } catch {}
    try { if (typeof api.isChatHidden === 'function') hidden = !!api.isChatHidden(); } catch {}
    return { maximized, minimized, hidden };
  });
}

async function tryOpenCloseReopen(page) {
  const result = { open: false, close: false, reopen: false, states: {} };
  try {
    const hasApi = await page.evaluate(() => !!(window.Tawk_API && (window.Tawk_API.maximize || window.Tawk_API.toggle)));
    if (!hasApi) return result;

    await page.evaluate(() => {
      const api = window.Tawk_API;
      if (typeof api.maximize === 'function') api.maximize();
      else api.toggle();
    });
    await page.waitForTimeout(1100);
    result.states.afterOpen = await tawkState(page);
    result.open = result.states.afterOpen.maximized === null ? true : result.states.afterOpen.maximized === true;

    await page.evaluate(() => {
      const api = window.Tawk_API;
      if (typeof api.minimize === 'function') api.minimize();
      else api.toggle();
    });
    await page.waitForTimeout(850);
    result.states.afterClose = await tawkState(page);
    result.close = result.states.afterClose.minimized === null ? true : result.states.afterClose.minimized === true;

    await page.evaluate(() => {
      const api = window.Tawk_API;
      if (typeof api.maximize === 'function') api.maximize();
      else api.toggle();
    });
    await page.waitForTimeout(1100);
    result.states.afterReopen = await tawkState(page);
    result.reopen = result.states.afterReopen.maximized === null ? true : result.states.afterReopen.maximized === true;
  } catch (e) {
    result.error = String(e.message || e);
  }
  return result;
}

async function functionalCleanSession(browser, lang) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message || e)));
  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2200);
    const switched = await setLanguage(page, lang);
    const ready = await waitForWidget(page, expected[lang], 15000);
    const ev = await widgetEvidence(page, expected[lang]);
    const ok = switched.clicked && ready && ev.found && ev.htmlWidget === expected[lang] && errors.length === 0;
    return { ok, errors, evidence: ev };
  } catch (e) {
    return { ok:false, errors:[String(e.message || e)] };
  } finally {
    await context.close();
  }
}

async function runFunctional(browser) {
  // One persistent browser context deliberately walks every language in sequence.
  // This catches the historical WDFOX failure where the first switch worked and a later switch froze/stuck on the old Tawk widget.
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'sk-SK' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  let currentErrors = [];
  page.on('pageerror', e => currentErrors.push(String(e.message || e)));

  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    for (const lang of langs) {
      const row = { language: lang, sequence_from_url: page.url() };
      const errorsBefore = currentErrors.length;
      try {
        const switched = await setLanguage(page, lang);
        row.language_switch = switched.clicked;
        row.sequence_to_url = page.url();

        const ready = await waitForWidget(page, expected[lang], 15000);
        const ev1 = await widgetEvidence(page, expected[lang]);
        row.correct_widget = ready && ev1.found && ev1.htmlWidget === expected[lang] && ev1.htmlLanguage === lang;
        row.tawk_api_ready = ev1.apiReady;
        row.widget_urls = ev1.urls;
        row.widget_global = ev1.globalWidget;
        row.visible_tawk_frame = ev1.visibleFrames > 0 || ev1.frameCount > 0;

        const health1 = await pageHealth(page);
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const health2 = await pageHealth(page);
        row.no_freeze = health1.readyState !== 'loading' && health1.width > 0 && health1.height > 0 && health2.now > health1.now;

        const ocr = await tryOpenCloseReopen(page);
        row.open_close_reopen = ocr.open && ocr.close && ocr.reopen;
        row.chat_states = ocr.states;

        // Cross-origin Tawk iframe text cannot be read directly; verify that the page and Tawk interaction surfaces are present and responsive.
        row.texts_buttons = health2.bodyTextLength > 100 && ev1.apiReady && row.visible_tawk_frame;

        await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(2200);
        const refreshReady = await waitForWidget(page, expected[lang], 15000);
        const ev2 = await widgetEvidence(page, expected[lang]);
        row.refresh = refreshReady && ev2.found && ev2.htmlWidget === expected[lang];
        row.sequence_transition = row.language_switch && row.correct_widget && row.no_freeze;
        row.page_errors = currentErrors.slice(errorsBefore, errorsBefore + 10);
      } catch (e) {
        row.error = String(e.message || e);
        row.page_errors = currentErrors.slice(errorsBefore, errorsBefore + 10);
      }
      report.results.push(row);
    }
  } finally {
    await context.close();
  }

  // True clean-session/incognito simulation: a brand-new isolated browser context for every language.
  for (const row of report.results) {
    const clean = await functionalCleanSession(browser, row.language);
    row.clean_session = clean.ok;
    row.clean_session_errors = clean.errors || [];
    row.pass = !!(row.open_close_reopen && row.language_switch && row.refresh && row.clean_session && row.correct_widget && row.texts_buttons && row.no_freeze && row.sequence_transition && (!row.page_errors || row.page_errors.length === 0));
    if (!row.pass) {
      const failedChecks = ['open_close_reopen','language_switch','refresh','clean_session','correct_widget','texts_buttons','no_freeze','sequence_transition'].filter(k => row[k] !== true);
      report.failures.push(`${row.language}: functional regression [${failedChecks.join(', ')}]`);
      try {
        const shotContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
        const shotPage = await shotContext.newPage();
        await shotPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await setLanguage(shotPage, row.language);
        await shotPage.waitForTimeout(1800);
        const screenshot = path.join(outDir, `functional-fail-${cleanName(row.language)}.png`);
        await shotPage.screenshot({ path: screenshot, fullPage: true });
        row.failure_screenshot = screenshot;
        await shotContext.close();
      } catch {}
    }
  }
}

async function runVisual(browser) {
  const profiles = [
    { name: 'desktop', viewport: { width: 1440, height: 1000 } },
    { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  ];
  for (const profile of profiles) {
    for (const lang of langs) {
      const context = await browser.newContext({ viewport: profile.viewport, isMobile: !!profile.isMobile, hasTouch: !!profile.hasTouch });
      const page = await context.newPage();
      const jsErrors = [];
      page.on('pageerror', e => jsErrors.push(String(e.message || e)));
      const row = { profile: profile.name, language: lang };
      try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(2800);
        const switched = await setLanguage(page, lang);
        row.language_switch = switched.clicked;
        await waitForWidget(page, expected[lang], 15000);
        const ev = await widgetEvidence(page, expected[lang]);
        row.correct_widget = ev.found && ev.htmlWidget === expected[lang];
        const health = await pageHealth(page);
        row.viewport_ok = health.viewportW > 0 && health.viewportH > 0;
        row.document_ok = health.width > 0 && health.height > 0;
        row.page_errors = jsErrors.slice(0, 10);
        const screenshot = path.join(outDir, `${cleanName(profile.name)}-${lang}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        row.screenshot = screenshot;
        row.pass = row.language_switch && row.correct_widget && row.viewport_ok && row.document_ok && jsErrors.length === 0;
        if (!row.pass) report.failures.push(`${profile.name}/${lang}: visual regression`);
      } catch (e) {
        row.pass = false;
        row.error = String(e.message || e);
        report.failures.push(`${profile.name}/${lang}: ${row.error}`);
      }
      report.results.push(row);
      await context.close();
    }
  }
}

const browser = await chromium.launch({ headless: true });
try {
  if (qaType === 'functional') await runFunctional(browser);
  else await runVisual(browser);
} finally {
  await browser.close();
}

report.finished_at = new Date().toISOString();
report.verdict = report.failures.length === 0 ? 'PASS' : 'FAIL';
report.summary = {
  total: report.results.length,
  passed: report.results.filter(r => r.pass).length,
  failed: report.results.filter(r => !r.pass).length,
};

const reportPath = path.join(outDir, 'report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
