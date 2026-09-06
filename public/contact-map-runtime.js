(function(){
  function initContactMap(){
    const grid=document.querySelector('#kontakt .register-identity-grid');
    const left=grid?.querySelector('.register-identity-left');
    const right=grid?.querySelector('.register-identity-right');
    const name=left?.querySelector('.register-person-name');
    const address=left?.querySelector('.register-address');
    const portrait=right?.querySelector('img');
    const details=right?.querySelector('.register-right-details');
    if(!grid||!left||!right||!name||!address||!portrait||!details)return;

    let map=grid.querySelector('.register-google-map');
    if(!map){
      map=document.createElement('div');
      map.className='register-google-map';
      map.innerHTML='<iframe title="Google Maps – Rammelkam 2, 84036 Kumhausen" src="https://www.google.com/maps?q=Rammelkam%202%2C%2084036%20Kumhausen%2C%20Deutschland&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
      left.insertBefore(map,address);
    }

    grid.classList.add('contact-map-layout');
  }

  const style=document.createElement('style');
  style.textContent=`
  #kontakt .register-identity-grid.contact-map-layout{display:grid!important;grid-template-columns:minmax(0,1fr) 270px!important;grid-template-rows:auto auto auto!important;column-gap:1.5rem!important;row-gap:1.25rem!important;align-items:start!important}
  #kontakt .contact-map-layout .register-identity-left,#kontakt .contact-map-layout .register-identity-right{display:contents!important}
  #kontakt .contact-map-layout .register-person-name{grid-column:1!important;grid-row:1!important}
  #kontakt .contact-map-layout .register-identity-right>img{grid-column:2!important;grid-row:1!important;justify-self:start!important;width:270px!important;height:180px!important;object-fit:cover!important}
  #kontakt .contact-map-layout .register-google-map{grid-column:1!important;grid-row:2!important;width:100%!important;min-height:210px!important;border-radius:12px!important;overflow:hidden!important;box-shadow:0 8px 24px rgba(0,0,0,.12)!important;background:#eee!important}
  #kontakt .contact-map-layout .register-google-map iframe{display:block!important;width:100%!important;height:210px!important;border:0!important}
  #kontakt .contact-map-layout .register-address{grid-column:1!important;grid-row:3!important;margin:0!important;align-self:start!important;display:flex!important;gap:.65rem!important}
  #kontakt .contact-map-layout .register-right-details{grid-column:2!important;grid-row:3!important;width:270px!important;margin:0!important;justify-self:start!important;white-space:nowrap!important}
  @media(max-width:760px){
    #kontakt .register-identity-grid.contact-map-layout{grid-template-columns:1fr!important;grid-template-rows:auto!important}
    #kontakt .contact-map-layout .register-person-name,#kontakt .contact-map-layout .register-identity-right>img,#kontakt .contact-map-layout .register-google-map,#kontakt .contact-map-layout .register-address,#kontakt .contact-map-layout .register-right-details{grid-column:1!important;grid-row:auto!important;width:100%!important;max-width:100%!important}
    #kontakt .contact-map-layout .register-identity-right>img{max-width:270px!important;height:auto!important}
    #kontakt .contact-map-layout .register-right-details{white-space:normal!important}
  }`;
  document.head.appendChild(style);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initContactMap);
  else initContactMap();
})();
