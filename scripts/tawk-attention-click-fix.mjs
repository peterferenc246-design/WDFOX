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
    try{
      var link=document.querySelector('#fox-tawk-attention .fox-here');
      if(!link)return;
      if(!document.getElementById('wdfox-tawk-mobile-icon-style')){
        var style=document.createElement('style');
        style.id='wdfox-tawk-mobile-icon-style';
        style.textContent='@media(max-width:700px){#fox-tawk-attention{right:14px!important;bottom:120px!important;width:72px!important;height:72px!important;z-index:2147483647!important}#fox-tawk-attention .fox-here{box-sizing:border-box!important;width:72px!important;height:72px!important;min-width:72px!important;min-height:72px!important;padding:0!important;margin:0!important;border:0!important;border-radius:50%!important;background:#087bb5!important;color:transparent!important;font-size:0!important;line-height:0!important;box-shadow:0 4px 16px rgba(0,0,0,.22)!important;overflow:visible!important;display:flex!important;align-items:center!important;justify-content:center!important;position:relative!important;text-decoration:none!important;cursor:pointer!important;touch-action:manipulation!important;pointer-events:auto!important}#fox-tawk-attention .wdfox-chat-icon{display:block!important;width:72px!important;height:72px!important;position:absolute!important;inset:0!important;pointer-events:none!important}#fox-tawk-attention .fox-here>span:first-child{display:none!important}#fox-tawk-attention .fox-here .wdfox-chat-badge{display:flex!important;position:absolute!important;right:-4px!important;top:-5px!important;width:25px!important;height:25px!important;align-items:center!important;justify-content:center!important;background:#c91f26!important;color:#fff!important;border-radius:50%!important;font:700 13px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;z-index:10!important;box-shadow:0 1px 3px rgba(0,0,0,.18)!important;pointer-events:none!important}}';
        document.head.appendChild(style);
      }
      if(!link.querySelector('.wdfox-chat-icon')){
        link.insertAdjacentHTML('afterbegin','<svg class="wdfox-chat-icon" viewBox="0 0 72 72" aria-hidden="true" focusable="false"><circle cx="36" cy="36" r="36" fill="#087bb5"/><path d="M22 31.5c0-7.2 6.3-12.5 14-12.5h1.5c7.7 0 14 5.3 14 12.5S45.2 44 37.5 44H32l-7 6v-7.2c-1.9-2.3-3-5.1-3-8.3Z" fill="#fff"/><path d="M29 34.5c2.4 1.6 4.8 2.3 7.3 2.3 2.7 0 5.3-.8 7.7-2.5" fill="none" stroke="#087bb5" stroke-width="2.6" stroke-linecap="round"/></svg>');
      }
      var badge=link.querySelector('.wdfox-chat-badge');
      if(!badge){
        badge=document.createElement('span');
        badge.className='wdfox-chat-badge';
        badge.textContent='1';
        badge.setAttribute('aria-hidden','true');
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
