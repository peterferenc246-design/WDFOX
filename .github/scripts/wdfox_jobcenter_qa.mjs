import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const targetUrl = process.env.TARGET_URL;
const productionUrl = process.env.PRODUCTION_URL || 'https://www.foxprof.club/jobcenter/';
const qaType = (process.env.QA_TYPE || 'functional').toLowerCase();
const approvedSha = process.env.APPROVED_PREVIEW_COMMIT || '';
const requestId = process.env.REQUEST_ID || `jobcenter-${Date.now()}`;
const expectedSectionId = process.env.EXPECTED_SECTION_ID || '';
const translationCycle = String(process.env.TRANSLATION_CYCLE || 'false').toLowerCase() === 'true';
const outDir = process.env.QA_OUT_DIR || 'qa-artifacts';

if (!targetUrl) throw new Error('TARGET_URL is required');
if (!['visual','functional'].includes(qaType)) throw new Error('QA_TYPE must be visual or functional');
if (!/^[0-9a-f]{40}$/i.test(approvedSha)) throw new Error('APPROVED_PREVIEW_COMMIT must be 40-char SHA');
if (!/^[A-Za-z0-9._-]{3,120}$/.test(requestId)) throw new Error('Invalid REQUEST_ID');
if (expectedSectionId && !/^[A-Za-z0-9._:-]{3,160}$/.test(expectedSectionId)) throw new Error('Invalid EXPECTED_SECTION_ID');

fs.mkdirSync(outDir,{recursive:true});

const report = {
  schema:'wdfox-jobcenter-qa/v1',
  request_id:requestId,
  qa_type:qaType,
  stage:'predproduction',
  target_url:targetUrl,
  production_url:productionUrl,
  approved_preview_commit:approvedSha,
  expected_section_id:expectedSectionId || null,
  translation_cycle:translationCycle,
  started_at:new Date().toISOString(),
  verdict:'FAIL',
  failures:[],
  results:[]
};

async function getInner(page){
  await page.goto(targetUrl,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#jobcenter-preview',{timeout:30000});
  const handle = await page.$('#jobcenter-preview');
  const frame = await handle.contentFrame();
  if (!frame) throw new Error('Jobcenter preview iframe is not accessible');
  await frame.waitForLoadState('domcontentloaded').catch(()=>{});
  await frame.waitForTimeout(2000);
  return frame;
}

async function basicChecks(page, frame){
  const banner = await page.locator('.preview-badge').innerText().catch(()=> '');
  const errorVisible = await page.locator('#preview-error').isVisible().catch(()=>false);
  const regionalExists = await frame.locator('#jobcenter-regionaldirektion-beschwerde-2026-10-06').count();
  const patchScript = await frame.locator('#wdfox-jobcenter-predproduction-patch').count();
  const sectionExists = expectedSectionId ? await frame.locator('#'+expectedSectionId).count() : 1;
  let beforeRegional = true;
  if (expectedSectionId) {
    beforeRegional = await frame.evaluate((id)=>{
      const a=document.getElementById(id);
      const b=document.getElementById('jobcenter-regionaldirektion-beschwerde-2026-10-06');
      if(!a||!b) return false;
      return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    }, expectedSectionId);
  }
  return {
    banner_ok:banner.trim()==='PREDPRODUCTION',
    preview_error_visible:errorVisible,
    regional_exists:regionalExists===1,
    patch_script_injected:patchScript===1,
    expected_section_exists:sectionExists===1,
    new_section_before_regional:beforeRegional
  };
}

async function productionUntouched(browser){
  if (!expectedSectionId) return true;
  const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
  const p=await ctx.newPage();
  try{
    await p.goto(productionUrl,{waitUntil:'domcontentloaded',timeout:60000});
    await p.waitForTimeout(1500);
    return (await p.locator('#'+expectedSectionId).count())===0;
  } finally { await ctx.close(); }
}

async function testTranslation(frame){
  if (!translationCycle) return {required:false,pass:true};
  if (!expectedSectionId) return {required:true,pass:false,error:'expected_section_id required for translation cycle'};
  const root=frame.locator('#'+expectedSectionId);
  const btn=root.locator('[data-jobcenter-lang-toggle]').first();
  if ((await btn.count())!==1) return {required:true,pass:false,error:'translation button missing'};
  const sequence=[];
  const read=async()=>{
    const visible=await root.locator('[data-panel]').evaluateAll(nodes=>nodes.filter(n=>!n.hidden && getComputedStyle(n).display!=='none').map(n=>n.getAttribute('data-panel')));
    const text=await btn.innerText().catch(()=> '');
    return {visible,button:text.trim()};
  };
  sequence.push(await read());
  for(let i=0;i<3;i++){
    await btn.click({timeout:10000});
    await frame.waitForTimeout(250);
    sequence.push(await read());
  }
  const langs=sequence.map(x=>x.visible.length===1?x.visible[0]:null);
  const expected=['de','en','sk','de'];
  const pass=langs.length===4 && expected.every((x,i)=>langs[i]===x);
  return {required:true,pass,sequence,expected};
}

async function runVisual(browser){
  const profiles=[
    {name:'desktop',viewport:{width:1440,height:1000}},
    {name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true}
  ];
  for(const profile of profiles){
    const ctx=await browser.newContext({viewport:profile.viewport,isMobile:!!profile.isMobile,hasTouch:!!profile.hasTouch});
    const page=await ctx.newPage();
    const row={profile:profile.name};
    try{
      const frame=await getInner(page);
      Object.assign(row,await basicChecks(page,frame));
      if(expectedSectionId){
        const box=await frame.locator('#'+expectedSectionId).boundingBox();
        row.section_visible=!!box && box.width>0 && box.height>0;
      } else row.section_visible=true;
      const shot=path.join(outDir,`jobcenter-${profile.name}.png`);
      await page.screenshot({path:shot,fullPage:true});
      row.screenshot=shot;
      row.pass=row.banner_ok&&!row.preview_error_visible&&row.regional_exists&&row.patch_script_injected&&row.expected_section_exists&&row.new_section_before_regional&&row.section_visible;
    }catch(e){row.pass=false;row.error=String(e.message||e);}
    if(!row.pass) report.failures.push(`${profile.name}: visual check failed`);
    report.results.push(row);
    await ctx.close();
  }
}

async function runFunctional(browser){
  const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await ctx.newPage();
  const row={profile:'functional'};
  try{
    const frame=await getInner(page);
    Object.assign(row,await basicChecks(page,frame));
    row.translation=await testTranslation(frame);
    row.production_untouched=await productionUntouched(browser);
    row.pass=row.banner_ok&&!row.preview_error_visible&&row.regional_exists&&row.patch_script_injected&&row.expected_section_exists&&row.new_section_before_regional&&row.translation.pass&&row.production_untouched;
  }catch(e){row.pass=false;row.error=String(e.message||e);}
  if(!row.pass) report.failures.push('functional check failed');
  report.results.push(row);
  await ctx.close();
}

const browser=await chromium.launch({headless:true});
try{
  if(qaType==='visual') await runVisual(browser);
  else await runFunctional(browser);
} finally {await browser.close();}

report.finished_at=new Date().toISOString();
report.verdict=report.failures.length===0?'PASS':'FAIL';
report.summary={total:report.results.length,passed:report.results.filter(x=>x.pass).length,failed:report.results.filter(x=>!x.pass).length};
fs.writeFileSync(path.join(outDir,'report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
