import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const marker = 'wdfox-tawk-attention-click-fix';
const script = `<script id="${marker}">
(function(){
  var WDFOX_PROPERTY_ID='6a951d52c3c46c344587662a';
  var WIDGETS={sk:'1k1b9121q',de:'1k1bb2aln',en:'1k1bb9ast',hr:'1k1bjvbjq',fr:'1k1blk6o4',it:'1k1bovo5t',pl:'1k1bp5qda',es:'1k1bp6lk5',sv:'1k1bpdngj'};
  function widgetId(){
    var lang=(document.documentElement.lang||'sk').toLowerCase().split('-')[0].split('_')[0];
    return WIDGETS[lang]||WIDGETS.sk;
  }
  function ensureStyle(){
    if(document.getElementById('wdfox-tawk-mobile-icon-style'))return;
    var style=document.createElement('style');
    style.id='wdfox-tawk-mobile-icon-style';
    style.textContent='@media(max-width:700px){#fox-tawk-attention{position:fixed!important;right:14px!important;bottom:120px!important;left:auto!important;top:auto!important;width:72px!important;height:72px!important;z-index:2147483647!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;margin:0!important;padding:0!important}#fox-tawk-attention .fox-here{box-sizing:border-box!important;width:72px!important;height:72px!important;min-width:72px!important;min-height:72px!important;padding:0!important;margin:0!important;border:0!important;border-radius:50%!important;background:#087bb5!important;color:transparent!important;font-size:0!important;line-height:0!important;box-shadow:0 4px 16px rgba(0,0,0,.22)!important;overflow:visible!important;display:flex!important;align-items:center!important;justify-content:center!important;position:relative!important;text-decoration:none!important;cursor:pointer!important;touch-action:manipulation!important;pointer-events:auto!important}#fox-tawk-attention .fox-here:after{display:none!important;content:none!important}#fox-tawk-attention .fox-here>span:first-child{display:none!important}#fox-tawk-attention .wdfox-chat-icon{display:block!important;width:72px!important;height:72px!important;position:absolute!important;inset:0!important;pointer-events:none!important}#fox-tawk-attention .fox-here .wdfox-chat-badge{display:flex!important;position:absolute!important;right:-4px!important;top:-5px!important;width:25px!important;height:25px!important;align-items:center!important;justify-content:center!important;background:#c91f26!important;color:#fff!important;border-radius:50%!important;font:700 13px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;z-index:10!important;box-shadow:0 1px 3px rgba(0,0,0,.18)!important;pointer-events:none!important}}';
    document.head.appendChild(style);
  }
  function ensureAttention(){
    try{
      ensureStyle();
      var attention=document.getElementById('fox-tawk-attention');
      if(!attention){
        attention=document.createElement('div');
        attention.id='fox-tawk-attention';
        attention.setAttribute('aria-label','Open live chat');
        document.body.appendChild(attention);
      }
      var link=attention.querySelector('.fox-here');
      if(!link){
        link=document.createElement('a');
        link.className='fox-here';
        link.href='https://tawk.to/chat/'+WDFOX_PROPERTY_ID+'/'+widgetId()+'?layout=modern';
        link.setAttribute('aria-label','Open live chat');
        attention.replaceChildren(link);
      }
      link.innerHTML='<svg class="wdfox-chat-icon" viewBox="0 0 72 72" aria-hidden="true" focusable="false"><circle cx="36" cy="36" r="36" fill="#087bb5"/><path d="M22 31.5c0-7.2 6.3-12.5 14-12.5h1.5c7.7 0 14 5.3 14 12.5S45.2 44 37.5 44H32l-7 6v-7.2c-1.9-2.3-3-5.1-3-8.3Z" fill="#fff"/><path d="M29 34.5c2.4 1.6 4.8 2.3 7.3 2.3 2.7 0 5.3-.8 7.7-2.5" fill="none" stroke="#087bb5" stroke-width="2.6" stroke-linecap="round"/></svg><span class="wdfox-chat-badge" aria-hidden="true">1</span>';
      if(link.dataset.wdfxBound!=='1'){
        link.dataset.wdfxBound='1';
        link.addEventListener('click',function(e){
          var api=window.Tawk_API;
          if(!api||typeof api.maximize!=='function')return;
          e.preventDefault();
          e.stopPropagation();
          window.__WDFOX_TAWK_OPEN_REQUEST=true;
          try{if(typeof api.showWidget==='function')api.showWidget();}catch(err){}
          try{api.maximize();}catch(err){}
          [250,750,1500].forEach(function(ms){
            window.setTimeout(function(){
              try{if(typeof api.showWidget==='function')api.showWidget();if(typeof api.maximize==='function')api.maximize();}catch(err){}
            },ms);
          });
          window.setTimeout(function(){window.__WDFOX_TAWK_OPEN_REQUEST=false;},1800);
        },false);
      }
      if(attention.parentNode===document.body&&document.body.lastElementChild!==attention)document.body.appendChild(attention);
    }catch(e){}
  }
  function ensureNativeWidgetVisible(){
    var api=window.Tawk_API;
    if(!api)return;
    try{if(typeof api.showWidget==='function')api.showWidget();}catch(e){}
  }
  function bind(){
    ensureAttention();
    ensureNativeWidgetVisible();
    var observer=new MutationObserver(function(){
      ensureAttention();
      ensureNativeWidgetVisible();
    });
    observer.observe(document.documentElement,{subtree:true,childList:true});
    window.setInterval(function(){
      ensureAttention();
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
