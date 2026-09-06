(function(){
  function init(){
    var el=document.querySelector('.hero-section .hero-lede');
    if(!el)return false;
    var lang=((location.pathname.split('/')[1]||document.documentElement.lang||'de').toLowerCase().slice(0,2));
    var copy={
      sk:'Kompletné riešenia od webdesignu a technického zabezpečenia až po komplexné marketingové kampane na Facebooku, Google Ads, TikToku, Instagrame, WhatsAppe a mnohých ďalších platformách, zamerané na získavanie nových zákazníkov.',
      de:'Komplettlösungen von Webdesign und technischer Umsetzung bis hin zu umfassenden Marketingkampagnen auf Facebook, Google Ads, TikTok, Instagram, WhatsApp und vielen weiteren Plattformen – mit dem Ziel, neue Kunden zu gewinnen.',
      en:'Complete solutions from web design and technical implementation to comprehensive marketing campaigns on Facebook, Google Ads, TikTok, Instagram, WhatsApp and many other platforms, focused on acquiring new customers.',
      fr:'Des solutions complètes, du webdesign et de la mise en œuvre technique aux campagnes marketing globales sur Facebook, Google Ads, TikTok, Instagram, WhatsApp et de nombreuses autres plateformes, afin d’acquérir de nouveaux clients.',
      hr:'Cjelovita rješenja od web dizajna i tehničke izvedbe do sveobuhvatnih marketinških kampanja na Facebooku, Google Adsu, TikToku, Instagramu, WhatsAppu i mnogim drugim platformama, usmjerenih na privlačenje novih klijenata.',
      pl:'Kompleksowe rozwiązania od webdesignu i realizacji technicznej po kompleksowe kampanie marketingowe na Facebooku, Google Ads, TikToku, Instagramie, WhatsAppie i wielu innych platformach, ukierunkowane na pozyskiwanie nowych klientów.',
      it:'Soluzioni complete, dal web design e dalla realizzazione tecnica fino a campagne di marketing complete su Facebook, Google Ads, TikTok, Instagram, WhatsApp e molte altre piattaforme, finalizzate all’acquisizione di nuovi clienti.',
      es:'Soluciones completas, desde el diseño web y la implementación técnica hasta campañas de marketing integrales en Facebook, Google Ads, TikTok, Instagram, WhatsApp y muchas otras plataformas, enfocadas en captar nuevos clientes.',
      sv:'Kompletta lösningar från webbdesign och teknisk implementation till omfattande marknadsföringskampanjer på Facebook, Google Ads, TikTok, Instagram, WhatsApp och många andra plattformar, med fokus på att skaffa nya kunder.'
    };
    var ranking={sk:'Lepšie pozície vo vyhľadávačoch',de:'Bessere Positionen in Suchmaschinen',en:'Better search engine rankings',fr:'Meilleur classement dans les moteurs de recherche',hr:'Bolje pozicije u tražilicama',pl:'Lepsze pozycje w wyszukiwarkach',it:'Migliori posizioni nei motori di ricerca',es:'Mejores posiciones en los buscadores',sv:'Bättre placeringar i sökmotorer'};
    el.textContent=copy[lang]||copy.de;
    var row=document.querySelector('.hero-section .benefit-row');
    if(row&&!row.querySelector('.search-ranking-benefit')){
      var item=document.createElement('span');
      item.className='benefit search-ranking-benefit';
      item.innerHTML='<span aria-hidden="true">✓</span> '+(ranking[lang]||ranking.de);
      row.appendChild(item);
    }
    return true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
