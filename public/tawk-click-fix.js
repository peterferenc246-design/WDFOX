(function(){
  'use strict';
  var PROPERTY_ID='6a951d52c3c46c344587662a';
  var WIDGETS={sk:'1k1b9121q',de:'1k1bb2aln',en:'1k1bb9ast',hr:'1k1bjvbjq',fr:'1k1blk6o4',it:'1k1bovo5t',pl:'1k1bp5qda',es:'1k1bp6lk5',sv:'1k1bpdngj'};
  var lang=(document.documentElement.lang||'sk').toLowerCase().split(/[-_]/)[0];
  if(!WIDGETS[lang])lang='sk';
  function openChat(){
    if(window.Tawk_API){
      try{
        if(typeof window.Tawk_API.show==='function')window.Tawk_API.show();
        if(typeof window.Tawk_API.maximize==='function'){window.Tawk_API.maximize();return;}
      }catch(_){ }
    }
    window.open('https://tawk.to/chat/'+PROPERTY_ID+'/'+WIDGETS[lang],'_blank','noopener,noreferrer');
  }
  function install(){
    if(document.getElementById('fox-tawk-hit-area'))return;
    var b=document.createElement('button');
    b.id='fox-tawk-hit-area';
    b.type='button';
    b.setAttribute('aria-label','Open live chat');
    b.title='Open live chat';
    b.onclick=function(e){e.preventDefault();e.stopPropagation();openChat();b.style.display='none';setTimeout(function(){b.style.display='block';},2500);};
    b.style.cssText='position:fixed!important;right:8px!important;bottom:8px!important;width:76px!important;height:76px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;opacity:0!important;cursor:pointer!important;z-index:2147483647!important;display:block!important;pointer-events:auto!important;';
    document.body.appendChild(b);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
  setTimeout(install,1000);
  setTimeout(install,3000);
})();
