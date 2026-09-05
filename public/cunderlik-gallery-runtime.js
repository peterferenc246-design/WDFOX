(function(){
  "use strict";
  var card=document.querySelector('.project-honda');
  var win=document.querySelector('.window-honda');
  if(!card||!win)return;

  var lang=((location.pathname.split('/')[1]||document.documentElement.lang||'').toLowerCase().slice(0,2));
  var title=card.querySelector('.project-info h3');
  if(title&&lang==='sk') title.textContent='Čunderlík MX Academy';

  function extractGalleryImages(){
    var found=[];
    try{
      Array.prototype.forEach.call(document.styleSheets,function(sheet){
        var rules;
        try{rules=sheet.cssRules||[];}catch(e){return;}
        Array.prototype.forEach.call(rules,function(rule){
          var text=rule.cssText||'';
          if(text.indexOf('cunderlikMiniGallery')===-1)return;
          var re=/url\(["']?(data:image\/[^"')]+)["']?\)/g,m;
          while((m=re.exec(text))){if(found.indexOf(m[1])===-1)found.push(m[1]);}
        });
      });
    }catch(e){}
    return found;
  }

  function start(images){
    if(images.length<4)return;
    var style=document.createElement('style');
    style.textContent='.window-honda::before{animation:none!important;opacity:0!important}.window-honda .cunderlik-gallery-photo{position:absolute;left:12px;top:12px;width:122px;height:92px;object-fit:cover;border:3px solid #fff;border-radius:12px;z-index:7;box-shadow:0 8px 20px rgba(0,0,0,.32);background:#fff}@media(max-width:640px){.window-honda .cunderlik-gallery-photo{left:10px;top:10px;width:96px;height:72px;border-radius:10px}}';
    document.head.appendChild(style);
    var old=win.querySelector('.cunderlik-extra-photo');if(old)old.remove();
    var img=document.createElement('img');img.className='cunderlik-gallery-photo';img.alt='Čunderlík MX Academy – galéria';img.loading='eager';win.appendChild(img);
    var i=0,timer;
    function show(){img.src=images[i];i=(i+1)%images.length;}
    function play(){clearInterval(timer);timer=setInterval(show,4000);}
    show();play();
    win.addEventListener('mouseenter',function(){clearInterval(timer)});
    win.addEventListener('mouseleave',play);
  }

  function init(){
    var first=extractGalleryImages();
    fetch('/tawk-language-loader.js?v=ee97e723',{cache:'no-store'}).then(function(r){return r.text();}).then(function(text){
      var m=text.match(/extraPhoto\.src\s*=\s*["'](data:image\/[^"']+)["']/);
      if(m&&first.indexOf(m[1])===-1)first.push(m[1]);
      start(first.slice(0,4));
    }).catch(function(){start(first.slice(0,4));});
  }

  setTimeout(init,250);
})();
