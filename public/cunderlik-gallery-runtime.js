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
    style.textContent='\
.window-honda::before{animation:none!important;opacity:0!important}\
.window-honda .cunderlik-gallery-photo{position:absolute;left:12px;top:12px;width:122px;height:92px;object-fit:cover;border:3px solid #fff;border-radius:12px;z-index:7;box-shadow:0 8px 20px rgba(0,0,0,.32);background:#fff;cursor:zoom-in}\
#cunderlik-gallery-modal{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(9,13,20,.80);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}\
#cunderlik-gallery-modal.is-open{display:flex}\
#cunderlik-gallery-modal .cunderlik-modal-frame{position:relative;width:min(900px,90vw);height:min(675px,82vh);border-radius:18px;overflow:hidden;background:#111;border:3px solid #fff;box-shadow:0 24px 70px rgba(0,0,0,.48);display:flex;align-items:center;justify-content:center}\
#cunderlik-gallery-modal img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;image-rendering:auto;transform:translateZ(0)}\
#cunderlik-gallery-modal .cunderlik-modal-close{position:absolute;right:12px;top:12px;width:42px;height:42px;border:0;border-radius:50%;background:rgba(0,0,0,.68);color:#fff;font-size:28px;line-height:1;cursor:pointer;z-index:2}\
@media(max-width:640px){.window-honda .cunderlik-gallery-photo{left:10px;top:10px;width:96px;height:72px;border-radius:10px}#cunderlik-gallery-modal{padding:14px}#cunderlik-gallery-modal .cunderlik-modal-frame{width:94vw;height:72vh;border-radius:14px}}';
    document.head.appendChild(style);

    var old=win.querySelector('.cunderlik-extra-photo');if(old)old.remove();
    var img=document.createElement('img');
    img.className='cunderlik-gallery-photo';
    img.alt='Čunderlík MX Academy – galéria';
    img.loading='eager';
    win.appendChild(img);

    var modal=document.getElementById('cunderlik-gallery-modal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='cunderlik-gallery-modal';
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      modal.setAttribute('aria-label','Galéria Čunderlík MX Academy');
      modal.innerHTML='<div class="cunderlik-modal-frame"><button type="button" class="cunderlik-modal-close" aria-label="Zavrieť">×</button><img alt="Čunderlík MX Academy – zväčšená fotografia"></div>';
      document.body.appendChild(modal);
    }
    var modalImg=modal.querySelector('img');
    var closeBtn=modal.querySelector('.cunderlik-modal-close');
    var enhancedCache=new Map();
    var requestToken=0;

    function enhanceSource(src){
      if(enhancedCache.has(src))return Promise.resolve(enhancedCache.get(src));
      return new Promise(function(resolve){
        var source=new Image();
        source.onload=function(){
          var nw=source.naturalWidth||source.width;
          var nh=source.naturalHeight||source.height;
          if(nw>=700||nh>=500){enhancedCache.set(src,src);resolve(src);return;}
          var target=900;
          var scale=target/Math.max(nw,nh);
          var tw=Math.max(1,Math.round(nw*scale));
          var th=Math.max(1,Math.round(nh*scale));
          var canvas=document.createElement('canvas');
          canvas.width=tw;canvas.height=th;
          var ctx=canvas.getContext('2d',{willReadFrequently:true});
          if(!ctx){resolve(src);return;}
          ctx.imageSmoothingEnabled=true;
          ctx.imageSmoothingQuality='high';
          ctx.drawImage(source,0,0,tw,th);
          try{
            if(tw*th<=1000000){
              var data=ctx.getImageData(0,0,tw,th);
              var px=data.data;
              var copy=new Uint8ClampedArray(px);
              var strength=.30;
              for(var y=1;y<th-1;y++){
                for(var x=1;x<tw-1;x++){
                  var n=(y*tw+x)*4;
                  for(var c=0;c<3;c++){
                    var center=copy[n+c];
                    var blur=(copy[n-4+c]+copy[n+4+c]+copy[n-tw*4+c]+copy[n+tw*4+c])/4;
                    px[n+c]=Math.max(0,Math.min(255,center+(center-blur)*strength));
                  }
                }
              }
              ctx.putImageData(data,0,0);
            }
          }catch(e){}
          var result=src;
          try{result=canvas.toDataURL('image/webp',.95);}catch(e){}
          enhancedCache.set(src,result);
          resolve(result);
        };
        source.onerror=function(){resolve(src);};
        source.src=src;
      });
    }

    function setModalSource(src){
      var token=++requestToken;
      enhanceSource(src).then(function(result){if(token===requestToken&&result)modalImg.src=result;});
    }

    var i=0,timer;
    function show(){
      img.src=images[i];
      if(modal.classList.contains('is-open')) setModalSource(images[i]);
      i=(i+1)%images.length;
    }
    function play(){clearInterval(timer);timer=setInterval(show,4000);}
    function openModal(){
      setModalSource(img.src);
      modal.classList.add('is-open');
      document.body.style.overflow='hidden';
      play();
    }
    function closeModal(){
      modal.classList.remove('is-open');
      document.body.style.overflow='';
      requestToken++;
      play();
    }

    show();play();

    img.addEventListener('mouseenter',openModal);
    img.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openModal();});
    img.tabIndex=0;
    img.setAttribute('role','button');
    img.setAttribute('aria-label','Zväčšiť galériu Čunderlík MX Academy');
    img.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal();}});

    closeBtn.addEventListener('click',function(e){e.stopPropagation();closeModal();});
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal();});

    win.addEventListener('mouseenter',function(){clearInterval(timer)});
    win.addEventListener('mouseleave',function(){if(!modal.classList.contains('is-open'))play();});
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
