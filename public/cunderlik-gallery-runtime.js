(function(){
  "use strict";

  function init(){
    var card=document.querySelector('.project-honda');
    var win=document.querySelector('.window-honda');
    if(!card||!win)return false;
    if(win.dataset.cunderlikGalleryReady==='1')return true;
    win.dataset.cunderlikGalleryReady='1';

    var lang=((location.pathname.split('/')[1]||document.documentElement.lang||'').toLowerCase().slice(0,2));
    var title=card.querySelector('.project-info h3');
    if(title&&lang==='sk')title.textContent='Čunderlík MX Academy';

    var images=[
      '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk2.jpg',
      '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk3.jpg',
      '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk4.jpg',
      '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk5.jpg',
      '/images/cunderlik-gallery/cunderlik-jawa-final.webp?v=1'
    ];

    images.forEach(function(src){var p=new Image();p.src=src;});

    var style=document.createElement('style');
    style.id='cunderlik-gallery-runtime-style';
    style.textContent='\
.window-honda::before{animation:none!important;opacity:0!important}\
.window-honda .cunderlik-extra-photo{display:none!important}\
.window-honda .cunderlik-gallery-photo{position:absolute;left:12px;top:12px;width:122px;height:92px;object-fit:cover;border:3px solid #fff;border-radius:12px;z-index:7;box-shadow:0 8px 20px rgba(0,0,0,.32);background:#fff;cursor:zoom-in;transition:opacity .28s ease}\
#cunderlik-gallery-modal{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(9,13,20,.80);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}\
#cunderlik-gallery-modal.is-open{display:flex}\
#cunderlik-gallery-modal .cunderlik-modal-frame{position:relative;width:min(1080px,94vw);height:min(810px,88vh);border-radius:18px;overflow:hidden;background:#111;border:3px solid #fff;box-shadow:0 24px 70px rgba(0,0,0,.48);display:flex;align-items:center;justify-content:center}\
#cunderlik-gallery-modal img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;image-rendering:auto;transition:opacity .28s ease}\
#cunderlik-gallery-modal .cunderlik-modal-close{position:absolute;right:12px;top:12px;width:42px;height:42px;border:0;border-radius:50%;background:rgba(0,0,0,.68);color:#fff;font-size:28px;line-height:1;cursor:pointer;z-index:3}\
#cunderlik-gallery-modal .cunderlik-modal-arrow{position:absolute;top:50%;transform:translateY(-50%);width:52px;height:52px;border:0;border-radius:50%;background:rgba(0,0,0,.58);color:#fff;font-size:34px;line-height:1;cursor:pointer;z-index:3;display:flex;align-items:center;justify-content:center}\
#cunderlik-gallery-modal .cunderlik-modal-prev{left:14px}\
#cunderlik-gallery-modal .cunderlik-modal-next{right:14px}\
#cunderlik-gallery-modal .cunderlik-modal-arrow:hover{background:rgba(0,0,0,.78)}\
@media(max-width:640px){.window-honda .cunderlik-gallery-photo{left:10px;top:10px;width:96px;height:72px;border-radius:10px}#cunderlik-gallery-modal{padding:14px}#cunderlik-gallery-modal .cunderlik-modal-frame{width:94vw;height:78vh;border-radius:14px}#cunderlik-gallery-modal .cunderlik-modal-arrow{width:44px;height:44px;font-size:28px}.cunderlik-modal-prev{left:8px!important}.cunderlik-modal-next{right:8px!important}}';
    if(!document.getElementById(style.id))document.head.appendChild(style);

    var old=win.querySelector('.cunderlik-extra-photo');
    if(old)old.remove();
    var img=win.querySelector('.cunderlik-gallery-photo');
    if(!img){
      img=document.createElement('img');
      img.className='cunderlik-gallery-photo';
      img.alt='Čunderlík MX Academy – galéria';
      img.loading='eager';
      img.decoding='async';
      img.tabIndex=0;
      img.setAttribute('role','button');
      img.setAttribute('aria-label','Zväčšiť galériu Čunderlík MX Academy');
      win.appendChild(img);
    }

    var modal=document.getElementById('cunderlik-gallery-modal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='cunderlik-gallery-modal';
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      modal.setAttribute('aria-label','Galéria Čunderlík MX Academy');
      modal.innerHTML='<div class="cunderlik-modal-frame"><button type="button" class="cunderlik-modal-close" aria-label="Zavrieť">×</button><button type="button" class="cunderlik-modal-arrow cunderlik-modal-prev" aria-label="Predchádzajúci obrázok">‹</button><img alt="Čunderlík MX Academy – zväčšená fotografia"><button type="button" class="cunderlik-modal-arrow cunderlik-modal-next" aria-label="Ďalší obrázok">›</button></div>';
      document.body.appendChild(modal);
    }

    var modalImg=modal.querySelector('img');
    var closeBtn=modal.querySelector('.cunderlik-modal-close');
    var prevBtn=modal.querySelector('.cunderlik-modal-prev');
    var nextBtn=modal.querySelector('.cunderlik-modal-next');
    var index=0;
    var timer=null;

    function setImage(target,src){
      var token=String(Date.now())+Math.random();
      target.dataset.galleryToken=token;
      target.style.opacity='0';
      var next=new Image();
      next.onload=function(){if(target.dataset.galleryToken!==token)return;target.src=src;target.style.opacity='1';};
      next.onerror=function(){if(target.dataset.galleryToken!==token)return;target.style.opacity='1';};
      next.src=src;
    }

    function renderCurrent(){
      var src=images[index];
      setImage(img,src);
      if(modal.classList.contains('is-open'))setImage(modalImg,src);
    }

    function advance(){index=(index+1)%images.length;renderCurrent();}
    function back(){index=(index-1+images.length)%images.length;renderCurrent();}
    function start(){stop();timer=setInterval(advance,4000);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}

    function openModal(){
      modal.classList.add('is-open');
      document.body.style.overflow='hidden';
      setImage(modalImg,images[index]);
      start();
    }

    function closeModal(){
      modal.classList.remove('is-open');
      document.body.style.overflow='';
      start();
    }

    function manualPrev(e){if(e){e.preventDefault();e.stopPropagation();}back();start();}
    function manualNext(e){if(e){e.preventDefault();e.stopPropagation();}advance();start();}

    renderCurrent();
    start();

    img.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openModal();});
    img.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal();}});
    closeBtn.addEventListener('click',function(e){e.stopPropagation();closeModal();});
    prevBtn.addEventListener('click',manualPrev);
    nextBtn.addEventListener('click',manualNext);
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
    document.addEventListener('keydown',function(e){
      if(!modal.classList.contains('is-open'))return;
      if(e.key==='Escape')closeModal();
      else if(e.key==='ArrowLeft')manualPrev(e);
      else if(e.key==='ArrowRight')manualNext(e);
    });

    document.addEventListener('visibilitychange',function(){
      if(document.hidden)stop();
      else start();
    });

    return true;
  }

  if(!init()){
    var tries=0;
    var wait=setInterval(function(){
      tries++;
      if(init()||tries>20)clearInterval(wait);
    },250);
  }
})();
