// Vizuálny smer: Friendly Conversion Studio — svetlá editorial kompozícia, FOX Orange #F36A0A, tmavý text, líščí maskot a výrazné konverzné CTA.
// Táto stránka drží referenčnú hierarchiu: asymetrický hero, benefit strip, službová polica, široké panely a vzdušný footer.

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  Mail,
  Menu,
  Monitor,
  PenTool,
  Phone,
  Rocket,
  ServerCog,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";

const heroFox = "/manus-storage/webdizainfox-fox-hero_96b4821d.png";
const supportFox = heroFox;
const hondaCrf450r = "https://powersports.honda.com/motorcycle/motocross/crf450r/2027/-/media/products/family/crf450r/campaign/desktop/2027/2027-crf450rwe-campaign-desktop.jpg";

const navItems = [
  { label: "Domov", href: "#domov" },
  { label: "Služby", href: "#sluzby" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "O mne", href: "#o-mne" },
  { label: "Referencie", href: "#referencie" },
  { label: "Kontakt", href: "#kontakt" },
];

const services = [
  { icon: Monitor, title: "Tvorba webstránok", text: "Moderné, rýchle a responzívne weby na mieru vašim potrebám." },
  { icon: PenTool, title: "Webdesign & grafika", text: "Dizajn webov, grafické práce a profesionálna úprava obrázkov." },
  { icon: Globe2, title: "Domény & DNS", text: "Registrácia domén a konfigurácia DNS pre bezproblémový chod." },
  { icon: ServerCog, title: "Hosting & technika", text: "Výber, nastavenie a správa webhostingu s podporou." },
  { icon: BarChart3, title: "Online marketing", text: "Facebook, Instagram a Google Ads kampane, ktoré prinášajú výsledky." },
  { icon: Settings2, title: "Údržba & podpora", text: "Pravidelná údržba, aktualizácie a technická podpora." },
];

const benefits = ["Moderný dizajn", "Rýchle načítanie", "SEO základ", "Responzívne"];
const process = [
  { number: "01", title: "Povieme si, čo potrebujete", text: "Krátko, vecne a bez zbytočného technického jazyka." },
  { number: "02", title: "Navrhnem riešenie", text: "Dostanete jasný koncept, rozsah a odporúčanie ďalších krokov." },
  { number: "03", title: "Spustíme web, ktorý pracuje", text: "Odovzdám vám rýchly, premyslený web pripravený na rast." },
];

const portfolioProjects = [
  { id: "cunderlik", type: "Motokros · Prezentačný web", title: "Cunderlik MX Academy", meta: "Webdesign · Vývoj · Vercel", href: "https://cunderlikmx.vercel.app/#home" },
  { id: "ovocie", type: "E-commerce", title: "Ovocie & spol.", meta: "Branding · Webdesign · Vývoj" },
  { id: "atelier", type: "Prezentačný web", title: "Ateliér Forma", meta: "Stratégia · Dizajn · Vývoj" },
];

function Logo() {
  return (
    <a className="brand" href="#domov" aria-label="WebDizainFOX – domov">
      <span className="brand-mark" aria-hidden="true"><span className="fox-symbol"><i /><b /></span></span>
      <span className="brand-copy"><span className="brand-name">WebDizain<span>FOX</span></span><span className="brand-tagline">Moderné weby, ktoré predávajú</span></span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [portfolioPaused, setPortfolioPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (portfolioPaused) return;
    const timer = window.setInterval(() => setPortfolioIndex((value) => (value + 1) % portfolioProjects.length), 5000);
    return () => window.clearInterval(timer);
  }, [portfolioPaused]);

  const previousProject = () => setPortfolioIndex((value) => (value - 1 + portfolioProjects.length) % portfolioProjects.length);
  const nextProject = () => setPortfolioIndex((value) => (value + 1) % portfolioProjects.length);
  const orderedProjects = [...portfolioProjects.slice(portfolioIndex), ...portfolioProjects.slice(0, portfolioIndex)];

  return (
    <div className="site-shell" id="domov">
      <style>{`
        .portfolio-carousel{position:relative;margin-top:8px}.portfolio-carousel-viewport{overflow:hidden;padding:4px}.portfolio-carousel-track{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.portfolio-carousel .project-card{min-width:0;transition:transform .35s ease,box-shadow .35s ease}.portfolio-carousel .project-card:hover{transform:translateY(-5px)}.project-card-link{color:inherit;text-decoration:none;display:block}.project-honda{background:linear-gradient(145deg,#fff 0%,#fff5f0 100%)}.window-honda{position:relative;overflow:hidden;background:#111;min-height:235px}.window-honda img{width:100%;height:100%;min-height:235px;object-fit:cover;display:block;transition:transform .45s ease}.project-honda:hover .window-honda img{transform:scale(1.035)}.window-honda:after{content:"2027 HONDA CRF450R";position:absolute;left:16px;bottom:14px;background:rgba(10,10,10,.78);color:#fff;padding:7px 10px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.08em}.portfolio-controls{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:20px}.portfolio-arrow{width:42px;height:42px;border:1px solid #e8e8e8;border-radius:50%;background:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 8px 22px rgba(28,31,36,.08);transition:.2s ease}.portfolio-arrow:hover{border-color:#f36a0a;color:#f36a0a;transform:translateY(-2px)}.portfolio-dots{display:flex;gap:8px}.portfolio-dot{width:9px;height:9px;border:0;border-radius:50%;background:#d9d9d9;cursor:pointer;padding:0;transition:.2s}.portfolio-dot.is-active{width:26px;border-radius:999px;background:#f36a0a}@media(max-width:900px){.portfolio-carousel-track{grid-template-columns:repeat(2,minmax(260px,1fr));overflow-x:auto;scroll-snap-type:x mandatory}.portfolio-carousel .project-card{scroll-snap-align:start}}@media(max-width:640px){.portfolio-carousel-track{display:flex;overflow-x:auto;gap:14px}.portfolio-carousel .project-card{flex:0 0 88%;scroll-snap-align:center}.window-honda,.window-honda img{min-height:210px}}
      `}</style>
      <div className="topline" aria-hidden="true" />
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Hlavná navigácia">
            {navItems.map((item, index) => <a key={item.href} href={item.href} className={index === 0 ? "nav-link active" : "nav-link"} onClick={closeMenu}>{item.label}</a>)}
            <a className="nav-cta mobile-only" href="#kontakt" onClick={closeMenu}><Sparkles size={16} /> Nezáväzná konzultácia</a>
          </nav>
          <a className="nav-cta desktop-only" href="#kontakt"><Sparkles size={16} /> Nezáväzná konzultácia</a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? "Zavrieť menu" : "Otvoriť menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <main>
        <section className="hero-section section-wrap">
          <div className="hero-copy reveal-up">
            <p className="eyebrow"><span /> WEBY, KTORÉ PRINÁŠAJÚ VÝSLEDKY</p>
            <h1>Moderné webstránky,<br />ktoré pomáhajú<br />firmám <em>rásť.</em></h1>
            <p className="hero-lede">Kompletné riešenia od webdesignu a technického zabezpečenia až po <strong>marketingové kampane</strong>, ktoré vám prinesú nových zákazníkov.</p>
            <div className="hero-actions"><a className="button button-primary" href="#kontakt"><Rocket size={18} /> Chcem webstránku <ArrowRight size={17} /></a><a className="button button-secondary" href="#portfolio"><span className="eye-icon">◉</span> Pozrieť moje projekty</a></div>
            <div className="benefit-row" aria-label="Hlavné výhody">{benefits.map((benefit) => <span className="benefit" key={benefit}><CheckCircle2 size={16} /> {benefit}</span>)}</div>
          </div>
          <div className="hero-visual reveal-up-delay">
            <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" /><span className="scribble scribble-one" aria-hidden="true">⌁</span><span className="scribble scribble-two" aria-hidden="true">⌁</span><span className="spark spark-one" aria-hidden="true">✧</span><span className="spark spark-two" aria-hidden="true">○</span><img className="hero-mascot" src={heroFox} alt="Líščí maskot WebDizainFOX s palcom hore" /><div className="hero-note"><span className="note-arrow">↗</span><span>Váš partner<br />pre <strong>úspešný web!</strong></span></div>
          </div>
        </section>

        <section className="services-section section-wrap" id="sluzby"><div className="section-heading centered"><p className="eyebrow eyebrow-center">ČO PRE VÁS <strong>VYBAVÍM?</strong></p><h2>Všetko, čo váš web potrebuje<br /><span>na jednom mieste.</span></h2></div><div className="services-grid">{services.map(({ icon: Icon, title, text }) => <a className="service-card" href="#kontakt" key={title}><span className="service-icon"><Icon size={24} strokeWidth={1.8} /></span><h3>{title}</h3><p>{text}</p><span className="card-arrow"><ArrowUpRight size={15} /></span></a>)}</div></section>

        <section className="about-panel section-wrap" id="o-mne"><div className="panel-noise" aria-hidden="true" /><div className="about-copy"><p className="eyebrow">KOMPLETNÉ RIEŠENIE POD JEDNOU STRECHOU</p><h2>Od prvého nápadu<br />až po <em>nových zákazníkov.</em></h2><p>Postarám sa o všetko – vy sa môžete sústrediť na svoje podnikanie. Dizajn, technika, marketing aj podpora.</p><a className="text-link" href="#kontakt">Spoznajme sa <ArrowRight size={16} /></a></div><div className="about-mascot-wrap"><div className="about-burst" aria-hidden="true" /><img className="about-mascot" src={supportFox} alt="Líščí maskot WebDizainFOX ukazuje na riešenie" /></div><ul className="about-list"><li><span><Check size={15} /></span><div><strong>Individuálny prístup</strong><small>Každý projekt riešim na mieru podľa vašich cieľov a potrieb.</small></div></li><li><span><Check size={15} /></span><div><strong>Moderné technológie</strong><small>Pracujem s najnovšími nástrojmi a AI technológiami.</small></div></li><li><span><Check size={15} /></span><div><strong>Spoľahlivosť a rýchlosť</strong><small>Dodržujem termíny a zabezpečujem rýchly chod webov.</small></div></li><li><span><Check size={15} /></span><div><strong>Zamerané na výsledky</strong><small>Moje weby sú navrhnuté tak, aby prinášali klientov a rast.</small></div></li></ul></section>

        <section className="portfolio-section section-wrap" id="portfolio">
          <div className="section-heading split-heading"><div><p className="eyebrow">VYBRANÉ PROJEKTY</p><h2>Web, ktorý vyzerá dobre.<br /><span>Výsledok, ktorý funguje.</span></h2></div><a className="text-link" href="#kontakt">Chcem podobný web <ArrowRight size={16} /></a></div>
          <div className="portfolio-carousel" onMouseEnter={() => setPortfolioPaused(true)} onMouseLeave={() => setPortfolioPaused(false)} onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => { if (touchStartX === null) return; const endX = event.changedTouches[0]?.clientX ?? touchStartX; if (touchStartX - endX > 45) nextProject(); if (endX - touchStartX > 45) previousProject(); setTouchStartX(null); }}>
            <div className="portfolio-carousel-viewport">
              <div className="portfolio-carousel-track">
                {orderedProjects.map((project) => project.id === "cunderlik" ? (
                  <a className="project-card project-honda project-card-link" href={project.href} target="_blank" rel="noreferrer" key={project.id}>
                    <div className="project-topline"><span>{project.type}</span><ArrowUpRight size={18} /></div>
                    <div className="project-window window-honda"><img src={hondaCrf450r} alt="Honda CRF450R 2027 – titulný motokrosový vizuál projektu Cunderlik MX Academy" /></div>
                    <div className="project-info"><h3>{project.title}</h3><span>{project.meta}</span></div>
                  </a>
                ) : project.id === "ovocie" ? (
                  <article className="project-card project-orange" key={project.id}><div className="project-topline"><span>{project.type}</span><ArrowUpRight size={18} /></div><div className="project-window window-sunrise"><div className="window-nav"><i /><i /><i /></div><div className="window-lines"><b>OBJAVTE SVOJ</b><strong>nový rytmus.</strong><small>Príbeh značky v každom detaile.</small></div><div className="window-shape" /></div><div className="project-info"><h3>{project.title}</h3><span>{project.meta}</span></div></article>
                ) : (
                  <article className="project-card project-ink" key={project.id}><div className="project-topline"><span>{project.type}</span><ArrowUpRight size={18} /></div><div className="project-window window-ink"><div className="window-nav"><i /><i /><i /></div><div className="ink-copy"><small>THE ART OF</small><strong>DETAIL.</strong><span>Crafted for people<br />who notice.</span></div><div className="ink-circle" /></div><div className="project-info"><h3>{project.title}</h3><span>{project.meta}</span></div></article>
                ))}
              </div>
            </div>
            <div className="portfolio-controls" aria-label="Ovládanie referencií"><button className="portfolio-arrow" type="button" onClick={previousProject} aria-label="Predchádzajúci projekt"><ChevronLeft size={20} /></button><div className="portfolio-dots">{portfolioProjects.map((project, index) => <button key={project.id} className={index === portfolioIndex ? "portfolio-dot is-active" : "portfolio-dot"} type="button" aria-label={`Projekt ${index + 1}`} onClick={() => setPortfolioIndex(index)} />)}</div><button className="portfolio-arrow" type="button" onClick={nextProject} aria-label="Ďalší projekt"><ChevronRight size={20} /></button></div>
          </div>
        </section>

        <section className="process-section section-wrap" id="referencie"><div className="process-intro"><p className="eyebrow">AKO TO PREBIEHA</p><h2>Jednoduchý proces.<br /><em>Žiadne prekvapenia.</em></h2><p>Od prvého telefonátu až po spustený web viete, čo sa deje a prečo.</p><div className="process-arrow" aria-hidden="true"><ArrowDown size={22} /></div></div><div className="process-list">{process.map((step) => <div className="process-step" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><ChevronRight className="step-chevron" size={22} /></div>)}</div></section>

        <section className="workspace-panel section-wrap"><div className="workspace-visual" aria-hidden="true"><span className="workspace-orb orb-large" /><span className="workspace-orb orb-small" /><span className="workspace-browser"><i /><i /><i /><b /><em /></span><Sparkles className="workspace-spark" size={24} /></div><div className="workspace-copy"><p className="eyebrow">PRIPRAVENÍ POSUNÚŤ VÁŠ BIZNIS?</p><h2>Poďme z nápadu<br />spraviť <em>výsledok.</em></h2><a className="button button-primary" href="#kontakt">Dohodnúť konzultáciu <ArrowRight size={17} /></a></div></section>

        <section className="contact-section section-wrap" id="kontakt"><div className="contact-card"><div className="contact-copy"><p className="eyebrow">OZVITE SA</p><h2>Máte nápad?<br /><em>Napíšte mi.</em></h2><p>Stačí pár viet o vašom projekte. Ozvem sa vám do 1 pracovného dňa s prvými otázkami a návrhom ďalšieho kroku.</p></div><div className="contact-actions"><a className="contact-line" href="mailto:ahoj@webdizainfox.sk"><span><Mail size={19} /></span><div><small>E-mail</small><strong>ahoj@webdizainfox.sk</strong></div><ArrowUpRight size={18} /></a><a className="contact-line" href="tel:+421900123456"><span><Phone size={19} /></span><div><small>Telefonát</small><strong>+421 900 123 456</strong></div><ArrowUpRight size={18} /></a><div className="availability"><Clock3 size={16} /> Odpovedám počas pracovných dní do 24 hodín</div></div></div></section>
      </main>

      <footer className="site-footer section-wrap"><div className="footer-main"><div><Logo /><p className="footer-note">Moderné weby, ktoré predávajú.<br />A technika, ktorá vás nezdržiava.</p></div><div className="footer-links"><strong>Preskočiť na</strong>{navItems.slice(0, 4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-links"><strong>Kontakt</strong><a href="mailto:ahoj@webdizainfox.sk">ahoj@webdizainfox.sk</a><a href="tel:+421900123456">+421 900 123 456</a><span>Slovensko · online</span></div></div><div className="footer-bottom"><span>© 2026 WebDizainFOX</span><span>Vytvorené s rozumom a kúskom líščej energie.</span><a href="#domov">Späť hore ↑</a></div></footer>
    </div>
  );
}
