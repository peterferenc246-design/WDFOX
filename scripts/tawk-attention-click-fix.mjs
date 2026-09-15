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
  function isTawkElement(el){
    if(!el||el.id==='fox-tawk-attention'||(el.closest&&el.closest('#fox-tawk-attention')))return false;
    var src=(el.getAttribute&&el.getAttribute('src'))||'';
    var id=el.id||'';
    var cls=typeof el.className==='string'?el.className:'';
    return src.indexOf('tawk.to')!==-1||src.indexOf('embed.tawk')!==-1||id.toLowerCase().indexOf('tawk')!==-1||cls.toLowerCase().indexOf('tawk')!==-1;
  }
  function setTawkPointerEvents(enabled){
    try{
      document.querySelectorAll('iframe,[id*="tawk" i],[class*="tawk" i]').forEach(function(el){
        if(isTawkElement(el))el.style.setProperty('pointer-events',enabled?'auto':'none','important');
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
    }catch(e){return false;}
  }
  function requestOpen(){
    window.__WDFOX_TAWK_OPEN_REQUEST=true;
    setTawkPointerEvents(false);
    if(openNativeTawk()){
      window.setTimeout(function(){setTawkPointerEvents(true);},200);
      window.setTimeout(function(){setTawkPointerEvents(true);},600);
      return;
    }
    window.setTimeout(openNativeTawk,250);
    window.setTimeout(openNativeTawk,750);
    window.setTimeout(openNativeTawk,1500);
  }
  function pendingOpen(){
    if(window.__WDFOX_TAWK_OPEN_REQUEST&&!isMaximized(window.Tawk_API))openNativeTawk();
  }
  function bind(){
    setTawkPointerEvents(false);
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
      var open=isMaximized(window.Tawk_API);
      setTawkPointerEvents(open);
      if(!open)pendingOpen();
      else window.__WDFOX_TAWK_OPEN_REQUEST=false;
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
