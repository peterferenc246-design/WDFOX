import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const marker = 'wdfox-tawk-attention-click-fix';
const script = `<script id="${marker}">
(function(){
  function keepAttentionOnTop(){
    try{
      var attention=document.getElementById('fox-tawk-attention');
      if(attention&&attention.parentNode===document.body&&document.body.lastElementChild!==attention){
        document.body.appendChild(attention);
      }
    }catch(e){}
  }
  function ensureWidgetVisible(){
    var api=window.Tawk_API;
    if(!api)return;
    try{if(typeof api.showWidget==='function')api.showWidget();}catch(e){}
  }
  function installMobileIcon(){
    if(document.getElementById('wdfox-tawk-mobile-icon-style'))return;
    var style=document.createElement('style');
    style.id='wdfox-tawk-mobile-icon-style';
    style.textContent='@media(max-width:700px){'+
      '#fox-tawk-attention{right:12px!important;bottom:120px!important;width:68px!important;height:68px!important;z-index:2147483647!important;}'+
      '#fox-tawk-attention .fox-here{width:68px!important;height:68px!important;min-width:68px!important;min-height:68px!important;padding:0!important;border:0!important;border-radius:50%!important;background:#0369a9!important;color:transparent!important;font-size:0!important;line-height:0!important;box-shadow:0 3px 12px rgba(0,0,0,.20)!important;display:flex!important;align-items:center!important;justify-content:center!important;position:relative!important;overflow:visible!important;touch-action:manipulation!important;pointer-events:auto!important;}'+
      '#fox-tawk-attention .fox-here span{display:block!important;position:relative!important;width:43px!important;height:32px!important;margin:0!important;padding:0!important;font-size:0!important;line-height:0!important;background:#fff!important;border-radius:50%!important;pointer-events:none!important;}'+
      '#fox-tawk-attention .fox-here span:after{content:""!important;position:absolute!important;left:10px!important;bottom:-7px!important;width:13px!important;height:13px!important;background:#fff!important;clip-path:polygon(0 0,100% 0,100% 100%)!important;transform:rotate(10deg)!important;}'+
      '#fox-tawk-attention .fox-here:after{content:"1"!important;position:absolute!important;right:-3px!important;top:-7px!important;width:30px!important;height:30px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#d71920!important;color:#fff!important;border:2px solid #fff!important;border-radius:50%!important;font:700 17px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;transform:none!important;pointer-events:none!important;}'+
    '}';
    (document.head||document.documentElement).appendChild(style);
  }
  function bind(){
    installMobileIcon();
    keepAttentionOnTop();
    ensureWidgetVisible();
    var observer=new MutationObserver(function(){
      installMobileIcon();
      keepAttentionOnTop();
      ensureWidgetVisible();
    });
    observer.observe(document.documentElement,{subtree:true,childList:true});
    window.setInterval(function(){
      installMobileIcon();
      keepAttentionOnTop();
      ensureWidgetVisible();
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
