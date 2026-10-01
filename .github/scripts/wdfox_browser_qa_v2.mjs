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
if (!['visual', 'functional'].includes(qaType)) throw new Error('QA_TYPE must be visual or functional');
if (!['preview', 'production-candidate', 'live'].includes(stage)) throw new Error('Invalid STAGE');

fs.mkdirSync(outDir, { recursive: true });

const langs = ['sk','de','en','hr','fr','it','pl','es','sv'];
const previewWidgets = {sk:'1k3jmfkjq',de:'1k3jk1ga8',en:'1k3jmi4o8',hr:'1k3jmj0gp',fr:'1k3jmj9u6',it:'1k3jmk3i0',pl:'1k3jmkd5l',es:'1k3jmlaaq',sv:'1k3jmljpb'};
const prodWidgets = {sk:'1k1b9121q',de:'1k1bb2aln',en:'1k1bb9ast',hr:'1k1bjvbjq',fr:'1k1blk6o4',it:'1k1bovo5t',pl:'1k1bp5qda',es:'1k1bp6lk5',sv:'1k1bpdngj'};
const expected = stage === 'preview' ? previewWidgets : prodWidgets;
const cleanName = s => String(s).replace(/[^A-Za-z0-9._-]/g, '_');
const safeTarget = (() => { try { const u = new URL(targetUrl); u.searchParams.delete('_vercel_share'); return u.toString(); } catch { return targetUrl; } })();

const report = {
  schema: 'wdfox-browser-qa/v2',
  request_id: requestId,
  qa_type: qaType,
  stage,
  target_url: safeTarget,
  approved_preview_commit: approvedSha,
  started_at: new Date().toISOString(),
  verdict: 'FAIL',
  failures: [],
  results: [],
};

async function locateLangControl(page, lang) {
  const selectors = [
    `[data-language="${lang}"]`,
    `#fixed-lang-layer [data-language="${lang}"]`,
    `[data-lang="${lang}"]`,
    `a[href*="/${lang}/"]`,
    `a[href*="lang=${lang}"]`,
    `button[aria-label*="${lang}" i]`,
  ];
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    if (await loc.count()) return loc;
  }
  return null;
}

async function assertNotVercelAuth(page) {
  const text = await page.locator('body').innerText().catch(() => '');
  if (/Protected by Vercel Authentication|Log in to Vercel|Vercel Authentication/i.test(text)) {
    throw new Error('Vercel Preview is protected; browser QA cannot reach the application');
  }
}

async function setLanguage(page, lang) {
  const control = await locateLangControl(page, lang);
  if (!control) return { clicked:false, reason:'language control not found' };
  const before = page.url();
  try {
    await control.scrollIntoViewIfNeeded();
    await control.click({ timeout: 10000 });
    await Promise.race([
      page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => null),
      page.waitForFunction(l => document.documentElement.getAttribute('data-wdfox-tawk-language') === l, lang, { timeout: 10000 }).catch(() => null),
      page.waitForTimeout(3000),
    ]);
    await page.waitForTimeout(1400);
    return { clicked:true, before, after:page.url() };
  } catch (e) {
    return { clicked:false, before, after:page.url(), reason:String(e.message || e) };
  }
}

async function evidence(page, widgetId) {
  return page.evaluate(wid => {
    const urls = [...document.querySelectorAll('script[src],iframe[src]')].map(el => el.getAttribute('src') || '').filter(Boolean);
    const frames = [...document.querySelectorAll('iframe')].map(f => {
      const r = f.getBoundingClientRect();
      const cs = getComputedStyle(f);
      return {src:f.getAttribute('src')||'', w:r.width, h:r.height, display:cs.display, visibility:cs.visibility, opacity:Number(cs.opacity || 1)};
    }).filter(x => /tawk\.to|tawk\.link|embed\.tawk\.to/i.test(x.src));
    const api = window.Tawk_API || {};
    let maximized = null, minimized = null, hidden = null;
    try { if (typeof api.isChatMaximized === 'function') maximized = !!api.isChatMaximized(); } catch {}
    try { if (typeof api.isChatMinimized === 'function') minimized = !!api.isChatMinimized(); } catch {}
    try { if (typeof api.isChatHidden === 'function') hidden = !!api.isChatHidden(); } catch {}
    const launcher = document.getElementById('fox-tawk-preview-launcher');
    const launcherStyle = launcher ? getComputedStyle(launcher) : null;
    return {
      found: urls.some(u => u.includes(wid)),
      tawkUrls: urls.filter(u => /tawk\.to|tawk\.link|embed\.tawk\.to/i.test(u)).slice(0,20),
      apiReady: typeof api.maximize === 'function' || typeof api.toggle === 'function',
      htmlWidget: document.documentElement.getAttribute('data-wdfox-tawk-widget'),
      htmlLanguage: document.documentElement.getAttribute('data-wdfox-tawk-language'),
      globalWidget: window.WebDesignFOXTawkWidgetId || null,
      launcherExists: !!launcher,
      launcherVisible: !!launcher && launcherStyle.display !== 'none' && launcherStyle.visibility !== 'hidden' && Number(launcherStyle.opacity || 1) > 0,
      concealed: document.documentElement.classList.contains('fox-tawk-preview-concealed'),
      maximized, minimized, hidden,
      frameCount: frames.length,
      visibleFrameCount: frames.filter(x => x.w > 180 && x.h > 180 && x.display !== 'none' && x.visibility !== 'hidden' && x.opacity > 0).length,
    };
  }, widgetId);
}

async function waitBootstrap(page, lang, timeout = 30000) {
  const wid = expected[lang];
  try {
    await page.waitForFunction(({wid, lang, preview}) => {
      const urls = [...document.querySelectorAll('script[src],iframe[src]')].map(el => el.getAttribute('src') || '');
      const widget = document.documentElement.getAttribute('data-wdfox-tawk-widget');
      const language = document.documentElement.getAttribute('data-wdfox-tawk-language');
      const api = window.Tawk_API || {};
      const launcherOk = !preview || !!document.getElementById('fox-tawk-preview-launcher');
      return urls.some(u => u.includes(wid)) && widget === wid && language === lang && launcherOk && (typeof api.maximize === 'function' || typeof api.toggle === 'function');
    }, {wid, lang, preview:stage === 'preview'}, { timeout });
    return true;
  } catch { return false; }
}

async function frameSurface(page) {
  let best = { textLength:0, buttonCount:0, url:null };
  for (const frame of page.frames()) {
    if (!/tawk\.to|tawk\.link/i.test(frame.url())) continue;
    try {
      const text = (await frame.locator('body').innerText({ timeout: 2500 })).trim();
      const buttons = await frame.locator('button, [role="button"], input, textarea').count();
      const candidate = { textLength:text.length, buttonCount:buttons, url:frame.url() };
      if (candidate.textLength + candidate.buttonCount * 10 > best.textLength + best.buttonCount * 10) best = candidate;
    } catch {}
  }
  return best;
}

async function waitOpen(page, widgetId, timeout = 12000) {
  try {
    await page.waitForFunction(wid => {
      const api = window.Tawk_API || {};
      try { if (typeof api.isChatMaximized === 'function' && api.isChatMaximized()) return true; } catch {}
      const frames = [...document.querySelectorAll('iframe')].filter(f => {
        const src = f.getAttribute('src') || '';
        if (!/tawk\.to|tawk\.link/i.test(src)) return false;
        const r = f.getBoundingClientRect(); const cs = getComputedStyle(f);
        return r.width > 180 && r.height > 180 && cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity || 1) > 0;
      });
      return frames.length > 0 && !document.documentElement.classList.contains('fox-tawk-preview-concealed');
    }, widgetId, { timeout });
    return true;
  } catch { return false; }
}

async function openCloseReopen(page, lang) {
  const wid = expected[lang];
  const out = { open:false, close:false, reopen:false, launcher_first:false, launcher_second:false, surface:null };
  const launcher = page.locator('#fox-tawk-preview-launcher').first();
  if (stage === 'preview') {
    if (!(await launcher.count())) return out;
    out.launcher_first = await launcher.isVisible().catch(() => false);
    if (!out.launcher_first) return out;
    await launcher.click({ timeout:10000 });
  } else {
    await page.evaluate(() => { const a=window.Tawk_API||{}; if (a.maximize) a.maximize(); else if (a.toggle) a.toggle(); });
  }
  out.open = await waitOpen(page, wid);
  out.surface = await frameSurface(page);
  if (!out.open) return out;

  await page.evaluate(() => { const a=window.Tawk_API||{}; if (a.minimize) a.minimize(); else if (a.toggle) a.toggle(); });
  await page.waitForTimeout(1000);
  if (stage === 'preview') {
    out.close = await launcher.isVisible().catch(() => false);
    out.launcher_second = out.close;
    if (out.close) await launcher.click({ timeout:10000 });
  } else {
    const ev = await evidence(page, wid); out.close = ev.minimized === true || ev.maximized === false;
    await page.evaluate(() => { const a=window.Tawk_API||{}; if (a.maximize) a.maximize(); else if (a.toggle) a.toggle(); });
  }
  out.reopen = await waitOpen(page, wid);
  return out;
}

function attachDiagnostics(page, diag) {
  page.on('pageerror', e => diag.pageErrors.push(String(e.message || e)));
  page.on('console', msg => { if (msg.type() === 'error') diag.consoleErrors.push(msg.text()); });
  page.on('requestfailed', req => { if (/tawk\.to|tawk\.link/i.test(req.url())) diag.tawkRequestFailures.push(`${req.url()} :: ${req.failure()?.errorText || 'failed'}`); });
  page.on('response', res => { if (/tawk\.to|tawk\.link/i.test(res.url()) && res.status() >= 400) diag.tawkHttpErrors.push(`${res.status()} ${res.url()}`); });
}

async function cleanSession(browser, lang) {
  const context = await browser.newContext({ viewport:{width:1440,height:1000}, locale:lang === 'en' ? 'en-US' : `${lang}-${lang.toUpperCase()}` });
  const page = await context.newPage();
  const diag = {pageErrors:[],consoleErrors:[],tawkRequestFailures:[],tawkHttpErrors:[]};
  attachDiagnostics(page, diag);
  try {
    await page.goto(targetUrl, { waitUntil:'domcontentloaded', timeout:45000 });
    await assertNotVercelAuth(page);
    await page.waitForTimeout(1800);
    const sw = await setLanguage(page, lang);
    const ready = await waitBootstrap(page, lang);
    const ev = await evidence(page, expected[lang]);
    return { ok:sw.clicked && ready && ev.found && ev.apiReady && ev.htmlWidget === expected[lang] && diag.pageErrors.length === 0 && diag.tawkRequestFailures.length === 0 && diag.tawkHttpErrors.length === 0, evidence:ev, diagnostics:diag };
  } catch (e) { return {ok:false,error:String(e.message||e),diagnostics:diag}; }
  finally { await context.close(); }
}

async function runFunctional(browser) {
  const context = await browser.newContext({ viewport:{width:1440,height:1000}, locale:'sk-SK' });
  const page = await context.newPage();
  const diag = {pageErrors:[],consoleErrors:[],tawkRequestFailures:[],tawkHttpErrors:[]};
  attachDiagnostics(page, diag);
  try {
    await page.goto(targetUrl, { waitUntil:'domcontentloaded', timeout:45000 });
    await assertNotVercelAuth(page);
    await page.waitForTimeout(1800);

    for (const lang of langs) {
      const row = { language:lang, sequence_from_url:page.url() };
      const pe = diag.pageErrors.length, rf = diag.tawkRequestFailures.length, he = diag.tawkHttpErrors.length;
      try {
        const sw = await setLanguage(page, lang);
        row.language_switch = sw.clicked;
        row.sequence_to_url = page.url();
        await assertNotVercelAuth(page);
        const ready = await waitBootstrap(page, lang);
        const ev = await evidence(page, expected[lang]);
        row.correct_widget = ready && ev.found && ev.htmlWidget === expected[lang] && ev.htmlLanguage === lang;
        row.tawk_api_ready = ev.apiReady;
        row.launcher_present = stage !== 'preview' || ev.launcherExists;
        row.widget_urls = ev.tawkUrls;

        const t1 = await page.evaluate(() => performance.now());
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        const t2 = await page.evaluate(() => performance.now());
        row.no_freeze = t2 > t1;

        const interaction = await openCloseReopen(page, lang);
        row.open_close_reopen = interaction.open && interaction.close && interaction.reopen;
        row.chat_surface = interaction.surface;
        row.texts_buttons = !!interaction.surface && (interaction.surface.textLength > 20 || interaction.surface.buttonCount > 0);

        await page.reload({ waitUntil:'domcontentloaded', timeout:45000 });
        await assertNotVercelAuth(page);
        row.refresh = await waitBootstrap(page, lang);
        row.sequence_transition = row.language_switch && row.correct_widget && row.no_freeze;
        row.page_errors = diag.pageErrors.slice(pe);
        row.tawk_request_failures = diag.tawkRequestFailures.slice(rf);
        row.tawk_http_errors = diag.tawkHttpErrors.slice(he);
      } catch (e) {
        row.error = String(e.message || e);
        row.page_errors = diag.pageErrors.slice(pe);
        row.tawk_request_failures = diag.tawkRequestFailures.slice(rf);
        row.tawk_http_errors = diag.tawkHttpErrors.slice(he);
      }
      report.results.push(row);
    }
  } finally { await context.close(); }

  for (const row of report.results) {
    const clean = await cleanSession(browser, row.language);
    row.clean_session = clean.ok;
    row.clean_session_error = clean.error || null;
    row.clean_session_diagnostics = clean.diagnostics || null;
    row.pass = !!(row.open_close_reopen && row.language_switch && row.refresh && row.clean_session && row.correct_widget && row.texts_buttons && row.no_freeze && row.sequence_transition && (!row.page_errors || row.page_errors.length === 0) && (!row.tawk_request_failures || row.tawk_request_failures.length === 0) && (!row.tawk_http_errors || row.tawk_http_errors.length === 0));
    if (!row.pass) {
      const checks = ['open_close_reopen','language_switch','refresh','clean_session','correct_widget','texts_buttons','no_freeze','sequence_transition'].filter(k => row[k] !== true);
      report.failures.push(`${row.language}: functional regression [${checks.join(', ')}]`);
      try {
        const c = await browser.newContext({viewport:{width:1440,height:1000}}); const p = await c.newPage();
        await p.goto(targetUrl,{waitUntil:'domcontentloaded',timeout:45000}); await setLanguage(p,row.language); await p.waitForTimeout(1800);
        const shot = path.join(outDir,`functional-fail-${cleanName(row.language)}.png`); await p.screenshot({path:shot,fullPage:true}); row.failure_screenshot=shot; await c.close();
      } catch {}
    }
  }
}

async function runVisual(browser) {
  const profiles = [{name:'desktop',viewport:{width:1440,height:1000}},{name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true}];
  for (const profile of profiles) for (const lang of langs) {
    const context = await browser.newContext({viewport:profile.viewport,isMobile:!!profile.isMobile,hasTouch:!!profile.hasTouch});
    const page = await context.newPage(); const diag={pageErrors:[],consoleErrors:[],tawkRequestFailures:[],tawkHttpErrors:[]}; attachDiagnostics(page,diag);
    const row={profile:profile.name,language:lang};
    try {
      await page.goto(targetUrl,{waitUntil:'domcontentloaded',timeout:45000}); await assertNotVercelAuth(page); await page.waitForTimeout(1800);
      const sw=await setLanguage(page,lang); row.language_switch=sw.clicked; const ready=await waitBootstrap(page,lang); const ev=await evidence(page,expected[lang]);
      row.correct_widget=ready&&ev.found&&ev.htmlWidget===expected[lang]; row.launcher_present=stage!=='preview'||ev.launcherExists; row.page_errors=diag.pageErrors;
      const shot=path.join(outDir,`${profile.name}-${lang}.png`); await page.screenshot({path:shot,fullPage:true}); row.screenshot=shot;
      row.pass=row.language_switch&&row.correct_widget&&row.launcher_present&&diag.pageErrors.length===0&&diag.tawkRequestFailures.length===0&&diag.tawkHttpErrors.length===0;
      if(!row.pass) report.failures.push(`${profile.name}/${lang}: visual regression`);
    } catch(e){row.pass=false;row.error=String(e.message||e);report.failures.push(`${profile.name}/${lang}: ${row.error}`);} finally { report.results.push(row); await context.close(); }
  }
}

const browser = await chromium.launch({ headless:true });
try { if (qaType === 'functional') await runFunctional(browser); else await runVisual(browser); }
finally { await browser.close(); }

report.finished_at = new Date().toISOString();
report.verdict = report.failures.length === 0 ? 'PASS' : 'FAIL';
report.summary = { total:report.results.length, passed:report.results.filter(r=>r.pass).length, failed:report.results.filter(r=>!r.pass).length };
fs.writeFileSync(path.join(outDir,'report.json'), JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
