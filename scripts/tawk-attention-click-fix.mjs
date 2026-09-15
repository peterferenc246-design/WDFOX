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
  function isAttention(el){
    return !!(el&&((el.id==='fox-tawk-attention')||(el.closest&&el.closest('#fox-tawk-attention'))));
  }
  function isTawkElement(el){
    if(!el||isAttention(el))return false;
    var src=(el.getAttribute&&el.getAttribute('src'))||'';
    var id=el.id||'';
    var cls=typeof el.className==='string'?el.className:'';
    return src.indexOf('tawk.to')!==-1||src.indexOf('embed.tawk')!==-1||id.toLowerCase().indexOf('tawk')!==-1||cls.toLowerCase().indexOf('tawk')!==-1;
  }
  function scanRoot(root,enabled){
    if(!root||!root.querySelectorAll)return;
    root.querySelectorAll('iframe,[id*="tawk" i],[class*="tawk" i]').forEach(function(el){
      if(isTawkElement(el))el.style.setProperty('pointer-events',enabled?'auto':'none','important');
    });
    root.querySelectorAll('*').forEach(function(el){
      if(el.shadowRoot)scanRoot(el.shadowRoot,enabled);
    });
  }
  function setTawkPointerEvents(enabled){
    try{scanRoot(document,enabled);}catch(e){}
  }
  function keepAttentionOnTop(){
    try{
      var attention=document.getElementById('fox-tawk-attention');
      if(attention&&attention.parentNode===document.body&&document.body.lastElementChild!==attention){
        document.body.appendChild(attention);
      }
    }catch(e){}
  }
  function openNativeTawk(){
    var api=window.Tawk_API;
    if(!api)return false;
    try{
      if(typeof api.showWidget==='function')api.showWidget();
      if(typeof api.maximize==='function')api.maximize();
      var open=typeof api.isChatMaximized==='function'?api.isChatMaximized():true;
      if(open)window.__WDFOX_TAWK_OPEN_REQUEST=false;
      return open;
    }catch(e){return false;}
  }
  function requestOpen(){
    window.__WDFOX_TAWK_OPEN_REQUEST=true;
    setTawkPointerEvents(false);
    keepAttentionOnTop();
    openNativeTawk();
    [100,250,500,750,1500].forEach(function(ms){window.setTimeout(function(){keepAttentionOnTop();openNativeTawk();},ms);});
  }
  function pendingOpen(){
    keepAttentionOnTop();
    if(window.__WDFOX_TAWK_OPEN_REQUEST&&!isMaximized(window.Tawk_API))openNativeTawk();
  }
  function bind(){
    keepAttentionOnTop();
    setTawkPointerEvents(false);
    var activate=function(e){
      var b=e.target&&e.target.closest&&e.target.closest('#fox-tawk-attention .fox-here');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      requestOpen();
    };
    document.addEventListener('pointerup',activate,true);
    document.addEventListener('touchend',activate,{capture:true,passive:false});
    document.addEventListener('click',activate,true);
    var observer=new MutationObserver(function(){
      keepAttentionOnTop();
      setTawkPointerEvents(isMaximized(window.Tawk_API));
      pendingOpen();
    });
    observer.observe(document.documentElement,{subtree:true,childList:true});
    window.setInterval(function(){
      keepAttentionOnTop();
      var open=isMaximized(window.Tawk_API);
      setTawkPointerEvents(open);
      if(!open)pendingOpen();
      else window.__WDFOX_TAWK_OPEN_REQUEST=false;
    },500);
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
