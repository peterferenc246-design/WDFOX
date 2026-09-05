(function(){
  "use strict";
  var card=document.querySelector('.project-honda');
  var win=document.querySelector('.window-honda');
  if(!card||!win)return;

  var lang=((location.pathname.split('/')[1]||document.documentElement.lang||'').toLowerCase().slice(0,2));
  var title=card.querySelector('.project-info h3');
  if(title&&lang==='sk') title.textContent='Čunderlík MX Academy';

  // Original gallery photos + generated Jawa artwork. Čunderlík1.jpg is intentionally
  // excluded from the public gallery because it is the reference photograph with the bottle.
  var images=[
    '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk2.jpg',
    '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk3.jpg',
    '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk4.jpg',
    '/images/cunderlik-gallery/%C4%8Cunderl%C3%ADk5.jpg',
    '/images/cunderlik-gallery/cunderlik-jawa.webp'
  ];

  var style=document.createElement('style');
  style.textContent='\
.window-honda::before{animation:none!important;opacity:0!important}\
.window-honda .cunderlik-extra-photo{display:none!important}\
.window-honda .cunderlik-gallery-photo{position:absolute;left:12px;top:12px;width:122px;height:92px;object-fit:cover;border:3px solid #fff;border-radius:12px;z-index:7;box-shadow:0 8px 20px rgba(0,0,0,.32);background:#fff;cursor:zoom-in}\
#cunderlik-gallery-modal{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(9,13,20,.80);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}\
#cunderlik-gallery-modal.is-open{display:flex}\
#cunderlik-gallery-modal .cunderlik-modal-frame{position:relative;width:min(1080px,94vw);height:min(810px,88vh);border-radius:18px;overflow:hidden;background:#111;border:3px solid #fff;box-shadow:0 24px 70px rgba(0,0,0,.48);display:flex;align-items:center;justify-content:center}\
#cunderlik-gallery-modal img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;image-rendering:auto}\
#cunderlik-gallery-modal .cunderlik-modal-close{position:absolute;right:12px;top:12px;width:42px;height:42px;border:0;border-radius:50%;background:rgba(0,0,0,.68);color:#fff;font-size:28px;line-height:1;cursor:pointer;z-index:2}\
@media(max-width:640px){.window-honda .cunderlik-gallery-photo{left:10px;top:10px;width:96px;height:72px;border-radius:10px}#cunderlik-gallery-modal{padding:14px}#cunderlik-gallery-modal .cunderlik-modal-frame{width:94vw;height:78vh;border-radius:14px}}';
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
  var i=0,timer;

  function show(){
    img.src=images[i];
    if(modal.classList.contains('is-open'))modalImg.src=images[i];
    i=(i+1)%images.length;
  }
  function play(){clearInterval(timer);timer=setInterval(show,4000);}
  function openModal(){
    modalImg.src=img.src;
    modal.classList.add('is-open');
    document.body.style.overflow='hidden';
    clearInterval(timer);
  }
  function closeModal(){
    modal.classList.remove('is-open');
    document.body.style.overflow='';
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
})();
