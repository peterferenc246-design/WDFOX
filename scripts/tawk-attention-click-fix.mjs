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
    try{
      if(typeof api.showWidget==='function')api.showWidget();
    }catch(e){}
  }
  function installMobileIcon(){
    try{
      if(document.getElementById('wdfox-tawk-mobile-icon-style'))return;
      var style=document.createElement('style');
      style.id='wdfox-tawk-mobile-icon-style';
      style.textContent='@media(max-width:700px){#fox-tawk-attention .fox-here{width:64px!important;height:64px!important;min-width:64px!important;min-height:64px!important;padding:0!important;border:0!important;border-radius:50%!important;background:#087bb5!important;color:transparent!important;font-size:0!important;line-height:0!important;box-shadow:0 4px 16px rgba(0,0,0,.22)!important;overflow:visible!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important}#fox-tawk-attention .fox-here:before{content:""!important;display:block!important;width:30px!important;height:22px!important;background:#fff!important;border-radius:50%!important;position:absolute!important;left:17px!important;top:18px!important}#fox-tawk-attention .fox-here:after{content:""!important;display:block!important;position:absolute!important;left:26px!important;top:36px!important;width:10px!important;height:10px!important;background:#fff!important;transform:skewY(-35deg) rotate(35deg)!important;border:0!important;border-radius:0 0 3px 0!important;pointer-events:none!important}#fox-tawk-attention .fox-here span{display:none!important}#fox-tawk-attention .fox-here .wdfox-chat-dot{display:block!important;position:absolute!important;left:27px!important;top:27px!important;width:11px!important;height:7px!important;border-bottom:2px solid #087bb5!important;border-radius:50%!important;z-index:2!important}#fox-tawk-attention .fox-here .wdfox-chat-badge{display:flex!important;position:absolute!important;right:-3px!important;top:-6px!important;width:24px!important;height:24px!important;align-items:center!important;justify-content:center!important;background:#c91f26!important;color:#fff!important;border-radius:50%!important;font:700 13px/1 system-ui,sans-serif!important;z-index:5!important;box-shadow:0 1px 3px rgba(0,0,0,.18)!important}#fox-tawk-attention .fox-here .wdfox-chat-label{display:none!important}}';
      document.head.appendChild(style);
      var link=document.querySelector('#fox-tawk-attention .fox-here');
      if(link&&!link.querySelector('.wdfox-chat-badge')){
        var dot=document.createElement('span');
        dot.className='wdfox-chat-dot';
        dot.setAttribute('aria-hidden','true');
        var badge=document.createElement('span');
        badge.className='wdfox-chat-badge';
        badge.textContent='1';
        badge.setAttribute('aria-hidden','true');
        link.appendChild(dot);
        link.appendChild(badge);
      }
    }catch(e){}
  }
  function bind(){
    keepAttentionOnTop();
    ensureWidgetVisible();
    installMobileIcon();
    var observer=new MutationObserver(function(){
      keepAttentionOnTop();
      ensureWidgetVisible();
      installMobileIcon();
    });
    observer.observe(document.documentElement,{subtree:true,childList:true});
    window.setInterval(function(){
      keepAttentionOnTop();
      ensureWidgetVisible();
      installMobileIcon();
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
