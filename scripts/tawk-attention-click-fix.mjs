import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const marker = 'wdfox-tawk-attention-click-fix';
const script = `<script id="${marker}">
(function(){
  function openNativeTawk(){
    var api=window.Tawk_API;
    if(!api)return false;
    try{
      if(typeof api.showWidget==='function')api.showWidget();
      if(typeof api.maximize==='function')api.maximize();
      if(typeof api.isChatMaximized==='function' && api.isChatMaximized()){
        var b=document.getElementById('fox-tawk-attention');
        if(b)b.style.setProperty('display','none','important');
        return true;
      }
    }catch(e){}
    return false;
  }
  function pendingOpen(){
    if(!window.__WDFOX_TAWK_PENDING)return;
    if(openNativeTawk())window.__WDFOX_TAWK_PENDING=false;
  }
  function bind(){
    document.addEventListener('click',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if(!openNativeTawk())window.__WDFOX_TAWK_PENDING=true;
    },true);
    document.addEventListener('touchend',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if(!openNativeTawk())window.__WDFOX_TAWK_PENDING=true;
    },true);
    window.setInterval(pendingOpen,250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
</script>`;

for(const file of fs.readdirSync(root,{recursive:true})){
  if(typeof file!=='string'||!file.endsWith('.html'))continue;
  const full=path.join(root,file);
  let html=fs.readFileSync(full,'utf8');
  if(html.includes(marker))continue;
  html=html.replace('</body>',script+'\n</body>');
  fs.writeFileSync(full,html);
}
