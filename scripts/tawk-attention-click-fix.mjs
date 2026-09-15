import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const marker = 'wdfox-tawk-attention-click-fix';
const script = `<script id="${marker}">
(function(){
  function isMaximized(api){
    try{
      return !!(api && typeof api.isChatMaximized==='function' && api.isChatMaximized());
    }catch(e){return false;}
  }
  function tawkFrames(block){
    try{
      document.querySelectorAll('iframe').forEach(function(frame){
        var src=frame.getAttribute('src')||'';
        if(src.indexOf('tawk.to')!==-1||src.indexOf('embed.tawk')!==-1){
          frame.style.pointerEvents=block?'none':'auto';
        }
      });
    }catch(e){}
  }
  function openNativeTawk(){
    var api=window.Tawk_API;
    if(!api)return false;
    try{
      if(typeof api.showWidget==='function')api.showWidget();
      if(typeof api.maximize==='function')api.maximize();
      return isMaximized(api);
    }catch(e){}
    return false;
  }
  function openFromAttention(){
    tawkFrames(true);
    if(openNativeTawk()){
      window.setTimeout(function(){tawkFrames(false);},700);
      return true;
    }
    window.__WDFOX_TAWK_PENDING=true;
    return false;
  }
  function pendingOpen(){
    if(!window.__WDFOX_TAWK_PENDING)return;
    if(openNativeTawk()){
      window.__WDFOX_TAWK_PENDING=false;
      window.setTimeout(function(){tawkFrames(false);},700);
    }
  }
  function bind(){
    tawkFrames(true);
    document.addEventListener('click',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      openFromAttention();
    },true);
    document.addEventListener('touchend',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      openFromAttention();
    },true);
    window.setInterval(function(){
      if(isMaximized(window.Tawk_API))tawkFrames(false);
      else tawkFrames(true);
      pendingOpen();
    },250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
</script>`;

for(const file of fs.readdirSync(root,{recursive:true})){
  if(typeof file!=='string'||!file.endsWith('.html'))continue;
  const full=path.join(root,file);
  let html=fs.readFileSync(full,'utf8');
  if(html.includes(marker))html=html.replace(new RegExp(`<script id="${marker}">[\\s\\S]*?<\\/script>`),script);
  else html=html.replace('</body>',script+'\n</body>');
  fs.writeFileSync(full,html);
}
