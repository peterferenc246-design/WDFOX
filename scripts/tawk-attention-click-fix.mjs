import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const marker = 'wdfox-tawk-attention-click-fix';
const script = `<script id="${marker}">
(function(){
  function removeLegacyAttention(){
    try{
      var attention=document.getElementById('fox-tawk-attention');
      if(attention)attention.remove();
      var style=document.getElementById('fox-tawk-attention-style');
      if(style)style.remove();
      var legacyScript=document.getElementById('fox-tawk-attention-script');
      if(legacyScript)legacyScript.remove();
    }catch(e){}
  }
  function ensureNativeWidgetVisible(){
    var api=window.Tawk_API;
    if(!api)return;
    try{
      if(typeof api.showWidget==='function')api.showWidget();
    }catch(e){}
  }
  function bind(){
    removeLegacyAttention();
    ensureNativeWidgetVisible();
    var observer=new MutationObserver(function(){
      removeLegacyAttention();
      ensureNativeWidgetVisible();
    });
    observer.observe(document.documentElement,{subtree:true,childList:true});
    window.setInterval(function(){
      removeLegacyAttention();
      ensureNativeWidgetVisible();
    },1000);
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
