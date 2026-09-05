(function(){
  "use strict";
  const mxWindow=document.querySelector('.window-honda');
  if(!mxWindow||document.getElementById('cunderlik-gallery-modal'))return;

  const style=document.createElement('style');
  style.textContent=`
  .cunderlik-gallery-trigger{position:absolute;left:12px;top:12px;width:122px;height:92px;z-index:20;cursor:zoom-in;border-radius:12px;background:transparent}
  #cunderlik-gallery-modal{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;padding:28px;background:rgba(10,14,22,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  #cunderlik-gallery-modal.is-open{display:flex}
  #cunderlik-gallery-modal .cunderlik-modal-frame{position:relative;width:min(900px,90vw);height:min(675px,82vh);border-radius:18px;overflow:hidden;background:#111;box-shadow:0 24px 70px rgba(0,0,0,.45);border:3px solid #fff;display:flex;align-items:center;justify-content:center}
  #cunderlik-gallery-modal img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;image-rendering:auto;transform:translateZ(0)}
  #cunderlik-gallery-modal .cunderlik-modal-close{position:absolute;right:12px;top:12px;width:42px;height:42px;border:0;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:28px;line-height:1;cursor:pointer;z-index:2}
  @media(max-width:640px){.cunderlik-gallery-trigger{left:10px;top:10px;width:96px;height:72px;border-radius:10px}#cunderlik-gallery-modal{padding:14px}#cunderlik-gallery-modal .cunderlik-modal-frame{width:94vw;height:72vh;border-radius:14px}}
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
  const enhancedCache=new Map();
  let syncTimer=null;
  let requestedSource='';

  function currentGalleryImage(){
    const runtime=mxWindow.querySelector('.cunderlik-gallery-photo');
    if(runtime&&runtime.src)return runtime.src;
    const extra=mxWindow.querySelector('.cunderlik-extra-photo');
    if(extra){
      const opacity=parseFloat(getComputedStyle(extra).opacity||'0');
      if(opacity>.5&&extra.src)return extra.src;
    }
    const pseudo=getComputedStyle(mxWindow,'::before').backgroundImage||'';
    const match=pseudo.match(/url\(["']?(.*?)["']?\)$/);
    return match?match[1]:'';
  }

  function sharpenCanvas(canvas,amount){
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if(!ctx)return;
    const w=canvas.width,h=canvas.height;
    if(w*h>1300000)return;
    const img=ctx.getImageData(0,0,w,h);
    const src=img.data;
    const out=new Uint8ClampedArray(src);
    const a=Math.max(0,Math.min(amount,0.34));
    for(let y=1;y<h-1;y++){
      for(let x=1;x<w-1;x++){
        const i=(y*w+x)*4;
        for(let c=0;c<3;c++){
          const center=src[i+c];
          const blur=(src[i-4+c]+src[i+4+c]+src[i-w*4+c]+src[i+w*4+c])/4;
          out[i+c]=Math.max(0,Math.min(255,center+(center-blur)*a));
        }
      }
    }
    img.data.set(out);
    ctx.putImageData(img,0,0);
  }

  function enhanceSource(src){
    if(enhancedCache.has(src))return Promise.resolve(enhancedCache.get(src));
    return new Promise((resolve)=>{
      const im=new Image();
      im.onload=function(){
        const nw=im.naturalWidth||im.width;
        const nh=im.naturalHeight||im.height;
        if(nw>=700||nh>=500){
          enhancedCache.set(src,src);
          resolve(src);
          return;
        }
        const targetLong=900;
        const scale=targetLong/Math.max(nw,nh);
        const tw=Math.max(1,Math.round(nw*scale));
        const th=Math.max(1,Math.round(nh*scale));
        const canvas=document.createElement('canvas');
        canvas.width=tw;canvas.height=th;
        const ctx=canvas.getContext('2d');
        if(!ctx){resolve(src);return;}
        ctx.imageSmoothingEnabled=true;
        ctx.imageSmoothingQuality='high';
        ctx.drawImage(im,0,0,tw,th);
        try{sharpenCanvas(canvas,.28);}catch(e){}
        let result=src;
        try{result=canvas.toDataURL('image/webp',.94);}catch(e){}
        enhancedCache.set(src,result);
        resolve(result);
      };
      im.onerror=function(){resolve(src);};
      im.src=src;
    });
  }

  function sync(){
    const src=currentGalleryImage();
    if(!src||src===requestedSource)return;
    requestedSource=src;
    enhanceSource(src).then(function(result){
      if(requestedSource===src&&result&&modalImg.src!==result)modalImg.src=result;
    });
  }

  function openModal(){
    requestedSource='';
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
    requestedSource='';
  }

  trigger.addEventListener('mouseenter',openModal);
  trigger.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openModal();});
  trigger.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal();}});
  closeBtn.addEventListener('click',function(e){e.stopPropagation();closeModal();});
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal();});
})();
