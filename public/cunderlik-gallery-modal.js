(function(){
  "use strict";
  const mxWindow=document.querySelector('.window-honda');
  if(!mxWindow||document.getElementById('cunderlik-gallery-modal'))return;

  const style=document.createElement('style');
  style.textContent=`
  .cunderlik-gallery-trigger{position:absolute;left:12px;top:12px;width:122px;height:92px;z-index:20;cursor:zoom-in;border-radius:12px;background:transparent}
  #cunderlik-gallery-modal{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(10,14,22,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  #cunderlik-gallery-modal.is-open{display:flex}
  #cunderlik-gallery-modal .cunderlik-modal-frame{position:relative;width:min(820px,88vw);aspect-ratio:16/9;border-radius:18px;overflow:hidden;background:#111;box-shadow:0 24px 70px rgba(0,0,0,.45);border:3px solid #fff}
  #cunderlik-gallery-modal img{display:block;width:100%;height:100%;object-fit:cover}
  #cunderlik-gallery-modal .cunderlik-modal-close{position:absolute;right:12px;top:12px;width:42px;height:42px;border:0;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:28px;line-height:1;cursor:pointer;z-index:2}
  @media(max-width:640px){.cunderlik-gallery-trigger{left:10px;top:10px;width:96px;height:72px;border-radius:10px}#cunderlik-gallery-modal{padding:14px}#cunderlik-gallery-modal .cunderlik-modal-frame{width:94vw;border-radius:14px}}
  `;
  document.head.appendChild(style);

  const trigger=document.createElement('div');
  trigger.className='cunderlik-gallery-trigger';
  trigger.setAttribute('aria-label','Zväčšiť galériu Čunderlík MX Academy');
  trigger.setAttribute('role','button');
  trigger.tabIndex=0;
  mxWindow.appendChild(trigger);

  const modal=document.createElement('div');
  modal.id='cunderlik-gallery-modal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-label','Galéria Čunderlík MX Academy');
  modal.innerHTML='<div class="cunderlik-modal-frame"><button type="button" class="cunderlik-modal-close" aria-label="Zavrieť">×</button><img alt="Čunderlík MX Academy – fotografia z galérie"></div>';
  document.body.appendChild(modal);

  const modalImg=modal.querySelector('img');
  const closeBtn=modal.querySelector('.cunderlik-modal-close');
  let syncTimer=null;

  function currentGalleryImage(){
    const extra=mxWindow.querySelector('.cunderlik-extra-photo');
    if(extra){
      const opacity=parseFloat(getComputedStyle(extra).opacity||'0');
      if(opacity>.5&&extra.src)return extra.src;
    }
    const pseudo=getComputedStyle(mxWindow,'::before').backgroundImage||'';
    const match=pseudo.match(/url\(["']?(.*?)["']?\)$/);
    return match?match[1]:'';
  }

  function sync(){
    const src=currentGalleryImage();
    if(src&&modalImg.src!==src)modalImg.src=src;
  }

  function openModal(){
    sync();
    modal.classList.add('is-open');
    document.body.style.overflow='hidden';
    clearInterval(syncTimer);
    syncTimer=setInterval(sync,180);
  }

  function closeModal(){
    modal.classList.remove('is-open');
    document.body.style.overflow='';
    clearInterval(syncTimer);
    syncTimer=null;
  }

  trigger.addEventListener('mouseenter',openModal);
  trigger.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openModal();});
  trigger.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal();}});
  closeBtn.addEventListener('click',function(e){e.stopPropagation();closeModal();});
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal();});
})();
