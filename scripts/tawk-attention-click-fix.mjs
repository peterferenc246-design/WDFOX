import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const marker = 'wdfox-tawk-attention-click-fix';
const script = `<script id="${marker}">
(function(){
  function isMaximized(api){
    try{return !!(api&&typeof api.isChatMaximized==='function'&&api.isChatMaximized());}
    catch(e){return false;}
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
  function openNativeTawk(){
    var api=window.Tawk_API;
    if(!api)return false;
    try{
      if(typeof api.showWidget==='function')api.showWidget();
      if(typeof api.maximize==='function')api.maximize();
      if(isMaximized(api))return true;
      if(typeof api.toggle==='function'){
        api.toggle();
        if(isMaximized(api))return true;
      }
    }catch(e){}
    return isMaximized(api);
  }
  function requestOpen(){
    window.__WDFOX_TAWK_OPEN_REQUEST=true;
    tawkFrames(true);
    return openNativeTawk();
  }
  function pendingOpen(){
    if(!window.__WDFOX_TAWK_OPEN_REQUEST)return;
    if(openNativeTawk()){
      window.__WDFOX_TAWK_OPEN_REQUEST=false;
      window.setTimeout(function(){tawkFrames(false);},150);
    }
  }
  function bind(){
    tawkFrames(true);
    document.addEventListener('click',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      requestOpen();
    },true);
    document.addEventListener('touchend',function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      requestOpen();
    },{capture:true,passive:false});
    window.setInterval(function(){
      if(isMaximized(window.Tawk_API)){
        window.__WDFOX_TAWK_OPEN_REQUEST=false;
        tawkFrames(false);
      }else if(window.__WDFOX_TAWK_OPEN_REQUEST){
        tawkFrames(true);
        pendingOpen();
      }else{
        tawkFrames(true);
      }
    },250);
    pendingOpen();
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
