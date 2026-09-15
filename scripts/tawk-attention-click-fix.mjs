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
          frame.style.setProperty('pointer-events',block?'none':'auto','important');
        }
      });
    }catch(e){}
  }
  function directChatUrl(){
    try{
      var b=document.querySelector('#fox-tawk-attention .fox-here');
      return b&&(b.getAttribute('data-tawk-chat-url')||b.getAttribute('href'))||'';
    }catch(e){return '';}
  }
  function directFallback(){
    var url=directChatUrl();
    if(url){window.location.assign(url);return true;}
    return false;
  }
  function openNativeTawk(){
    var api=window.Tawk_API;
    if(!api||typeof api.maximize!=='function')return false;
    try{
      if(typeof api.showWidget==='function')api.showWidget();
      api.maximize();
      return isMaximized(api);
    }catch(e){return false;}
  }
  function openFromAttention(){
    tawkFrames(true);
    if(openNativeTawk()){
      window.__WDFOX_TAWK_PENDING=null;
      window.setTimeout(function(){tawkFrames(false);},700);
      return true;
    }
    window.__WDFOX_TAWK_PENDING=1;
    return false;
  }
  function pendingOpen(){
    if(typeof window.__WDFOX_TAWK_PENDING!=='number')return;
    if(openNativeTawk()){
      window.__WDFOX_TAWK_PENDING=null;
      window.setTimeout(function(){tawkFrames(false);},700);
      return;
    }
    window.__WDFOX_TAWK_PENDING++;
    if(window.__WDFOX_TAWK_PENDING>=12){
      window.__WDFOX_TAWK_PENDING=null;
      directFallback();
    }
  }
  function bind(){
    tawkFrames(true);
    document.addEventListener('click',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      if(!window.Tawk_API||typeof window.Tawk_API.maximize!=='function')return;
      e.preventDefault();
      e.stopImmediatePropagation();
      openFromAttention();
    },true);
    document.addEventListener('touchend',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      if(!window.Tawk_API||typeof window.Tawk_API.maximize!=='function')return;
      e.preventDefault();
      e.stopImmediatePropagation();
      openFromAttention();
    },{capture:true,passive:false});
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
