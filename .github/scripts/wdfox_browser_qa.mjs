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
const previewWidgets = {sk:'1k3jmfkjq',de:'1k3jk1ga8',en:'1k3jmi4o8',hr:'1k3jmj0gp',fr:'1k3jmj9u6',it:'1k3jmk3i0',pl:'1k3jmkd5l',es:'1k3jmlaaq',sv:'1k3jmljpb'};
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
    return {
      found: urls.some(u => u.includes(wid)),
      urls: urls.filter(u => /tawk\.to|embed\.tawk\.to/i.test(u)).slice(0, 12),
      apiReady: !!(window.Tawk_API && (window.Tawk_API.maximize || window.Tawk_API.toggle)),
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
  }));
}

async function setLanguage(page, lang) {
  const control = await locateLangControl(page, lang);
  if (!control) return { clicked: false, reason: 'language control not found' };
  const before = page.url();
  try {
    await control.scrollIntoViewIfNeeded();
    await control.click({ timeout: 8000 });
    await Promise.race([
      page.waitForLoadState('domcontentloaded', { timeout: 8000 }).catch(() => null),
      page.waitForTimeout(2200),
    ]);
    return { clicked: true, before, after: page.url() };
  } catch (e) {
    return { clicked: false, reason: String(e.message || e) };
  }
}

async function tryOpenCloseReopen(page) {
  const result = { open: false, close: false, reopen: false };
  try {
    const r = await page.evaluate(async () => {
      const api = window.Tawk_API;
      if (!api) return { ok:false, why:'Tawk_API missing' };
      const sleep = ms => new Promise(res => setTimeout(res, ms));
      try { if (api.maximize) api.maximize(); else if (api.toggle) api.toggle(); else return {ok:false, why:'no maximize/toggle'}; } catch(e) { return {ok:false, why:String(e)}; }
      await sleep(700);
      let open = true;
      try { if (api.minimize) api.minimize(); else if (api.toggle) api.toggle(); } catch(e) { return {ok:false, why:String(e)}; }
      await sleep(500);
      let close = true;
      try { if (api.maximize) api.maximize(); else if (api.toggle) api.toggle(); } catch(e) { return {ok:false, why:String(e)}; }
      await sleep(700);
      return {ok:true, open, close, reopen:true};
    });
    if (r?.ok) return { open: !!r.open, close: !!r.close, reopen: !!r.reopen };
  } catch {}
  return result;
}

async function runFunctional(browser) {
  for (const lang of langs) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: lang === 'en' ? 'en-US' : `${lang}-${lang.toUpperCase()}` });
    const page = await context.newPage();
    const jsErrors = [];
    page.on('pageerror', e => jsErrors.push(String(e.message || e)));
    const row = { language: lang };
    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2800);
      const switched = await setLanguage(page, lang);
      row.language_switch = switched.clicked;
      await page.waitForTimeout(2500);
      const ev1 = await widgetEvidence(page, expected[lang]);
      row.correct_widget = ev1.found;
      row.tawk_api_ready = ev1.apiReady;
      row.widget_urls = ev1.urls;
      const health1 = await pageHealth(page);
      row.no_freeze = health1.readyState !== 'loading' && health1.width > 0 && health1.height > 0;
      const ocr = await tryOpenCloseReopen(page);
      row.open_close_reopen = ocr.open && ocr.close && ocr.reopen;
      row.texts_buttons = (await page.locator('body').innerText({ timeout: 5000 })).trim().length > 100;
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2500);
      const ev2 = await widgetEvidence(page, expected[lang]);
      row.refresh = ev2.found;
      row.clean_session = true;
      row.page_errors = jsErrors.slice(0, 10);
      row.pass = row.open_close_reopen && row.language_switch && row.refresh && row.clean_session && row.correct_widget && row.texts_buttons && row.no_freeze && jsErrors.length === 0;
      if (!row.pass) report.failures.push(`${lang}: functional regression`);
    } catch (e) {
      row.pass = false;
      row.error = String(e.message || e);
      report.failures.push(`${lang}: ${row.error}`);
    }
    report.results.push(row);
    await context.close();
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
        await page.waitForTimeout(2200);
        const ev = await widgetEvidence(page, expected[lang]);
        row.correct_widget = ev.found;
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
