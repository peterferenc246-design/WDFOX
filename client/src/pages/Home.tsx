// Vizuálny smer: Friendly Conversion Studio — svetlá editorial kompozícia, FOX Orange #F36A0A, tmavý text, líščí maskot a výrazné konverzné CTA.
// Táto stránka drží referenčnú hierarchiu: asymetrický hero, benefit strip, službová polica, široké panely a vzdušný footer.

import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
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

const navItems = [
  { label: "Domov", href: "#domov" },
  { label: "Služby", href: "#sluzby" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "O mne", href: "#o-mne" },
  { label: "Referencie", href: "#referencie" },
  { label: "Kontakt", href: "#kontakt" },
];

const services = [
  {
    icon: Monitor,
    title: "Tvorba webstránok",
    text: "Moderné, rýchle a responzívne weby na mieru vašim potrebám.",
  },
  {
    icon: PenTool,
    title: "Webdesign & grafika",
    text: "Dizajn webov, grafické práce a profesionálna úprava obrázkov.",
  },
  {
    icon: Globe2,
    title: "Domény & DNS",
    text: "Registrácia domén a konfigurácia DNS pre bezproblémový chod.",
  },
  {
    icon: ServerCog,
    title: "Hosting & technika",
    text: "Výber, nastavenie a správa webhostingu s podporou.",
  },
  {
    icon: BarChart3,
    title: "Online marketing",
    text: "Facebook, Instagram a Google Ads kampane, ktoré prinášajú výsledky.",
  },
  {
    icon: Settings2,
    title: "Údržba & podpora",
    text: "Pravidelná údržba, aktualizácie a technická podpora.",
  },
];

const benefits = ["Moderný dizajn", "Rýchle načítanie", "SEO základ", "Responzívne"];
const process = [
  {
    number: "01",
    title: "Povieme si, čo potrebujete",
    text: "Krátko, vecne a bez zbytočného technického jazyka.",
  },
  {
    number: "02",
    title: "Navrhnem riešenie",
    text: "Dostanete jasný koncept, rozsah a odporúčanie ďalších krokov.",
  },
  {
    number: "03",
    title: "Spustíme web, ktorý pracuje",
    text: "Odovzdám vám rýchly, premyslený web pripravený na rast.",
  },
];

function Logo() {
  return (
    <a className="brand" href="#domov" aria-label="WebDizainFOX – domov">
      <span className="brand-mark" aria-hidden="true"><span className="fox-symbol"><i /><b /></span></span>
      <span className="brand-copy">
        <span className="brand-name">
          WebDizain<span>FOX</span>
        </span>
        <span className="brand-tagline">Moderné weby, ktoré predávajú</span>
      </span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" id="domov">
      <div className="topline" aria-hidden="true" />
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Hlavná navigácia">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={index === 0 ? "nav-link active" : "nav-link"}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <a className="nav-cta mobile-only" href="#kontakt" onClick={closeMenu}>
              <Sparkles size={16} /> Nezáväzná konzultácia
            </a>
          </nav>
          <a className="nav-cta desktop-only" href="#kontakt">
            <Sparkles size={16} /> Nezáväzná konzultácia
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Zavrieť menu" : "Otvoriť menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section section-wrap">
          <div className="hero-copy reveal-up">
            <p className="eyebrow"><span /> WEBY, KTORÉ PRINÁŠAJÚ VÝSLEDKY</p>
            <h1>
              Moderné webstránky,<br />
              ktoré pomáhajú<br />
              firmám <em>rásť.</em>
            </h1>
            <p className="hero-lede">
              Kompletné riešenia od webdesignu a technického zabezpečenia až po <strong>marketingové kampane</strong>, ktoré vám prinesú nových zákazníkov.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#kontakt">
                <Rocket size={18} /> Chcem webstránku <ArrowRight size={17} />
              </a>
              <a className="button button-secondary" href="#portfolio">
                <span className="eye-icon">◉</span> Pozrieť moje projekty
              </a>
            </div>
            <div className="benefit-row" aria-label="Hlavné výhody">
              {benefits.map((benefit) => (
                <span className="benefit" key={benefit}>
                  <CheckCircle2 size={16} /> {benefit}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual reveal-up-delay">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <span className="scribble scribble-one" aria-hidden="true">⌁</span>
            <span className="scribble scribble-two" aria-hidden="true">⌁</span>
            <span className="spark spark-one" aria-hidden="true">✧</span>
            <span className="spark spark-two" aria-hidden="true">○</span>
            <img className="hero-mascot" src={heroFox} alt="Líščí maskot WebDizainFOX s palcom hore" />
            <div className="hero-note">
              <span className="note-arrow">↗</span>
              <span>Váš partner<br />pre <strong>úspešný web!</strong></span>
            </div>
          </div>
        </section>

        <section className="services-section section-wrap" id="sluzby">
          <div className="section-heading centered">
            <p className="eyebrow eyebrow-center">ČO PRE VÁS <strong>VYBAVÍM?</strong></p>
            <h2>Všetko, čo váš web potrebuje<br /><span>na jednom mieste.</span></h2>
          </div>
          <div className="services-grid">
            {services.map(({ icon: Icon, title, text }) => (
              <a className="service-card" href="#kontakt" key={title}>
                <span className="service-icon"><Icon size={24} strokeWidth={1.8} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="card-arrow"><ArrowUpRight size={15} /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="about-panel section-wrap" id="o-mne">
          <div className="panel-noise" aria-hidden="true" />
          <div className="about-copy">
            <p className="eyebrow">KOMPLETNÉ RIEŠENIE POD JEDNOU STRECHOU</p>
            <h2>Od prvého nápadu<br />až po <em>nových zákazníkov.</em></h2>
            <p>Postarám sa o všetko – vy sa môžete sústrediť na svoje podnikanie. Dizajn, technika, marketing aj podpora.</p>
            <a className="text-link" href="#kontakt">Spoznajme sa <ArrowRight size={16} /></a>
          </div>
          <div className="about-mascot-wrap">
            <div className="about-burst" aria-hidden="true" />
            <img className="about-mascot" src={supportFox} alt="Líščí maskot WebDizainFOX ukazuje na riešenie" />
          </div>
          <ul className="about-list">
            <li><span><Check size={15} /></span><div><strong>Individuálny prístup</strong><small>Každý projekt riešim na mieru podľa vašich cieľov a potrieb.</small></div></li>
            <li><span><Check size={15} /></span><div><strong>Moderné technológie</strong><small>Pracujem s najnovšími nástrojmi a AI technológiami.</small></div></li>
            <li><span><Check size={15} /></span><div><strong>Spoľahlivosť a rýchlosť</strong><small>Dodržujem termíny a zabezpečujem rýchly chod webov.</small></div></li>
            <li><span><Check size={15} /></span><div><strong>Zamerané na výsledky</strong><small>Moje weby sú navrhnuté tak, aby prinášali klientov a rast.</small></div></li>
          </ul>
        </section>

        <section className="portfolio-section section-wrap" id="portfolio">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">VYBRANÉ PROJEKTY</p>
              <h2>Web, ktorý vyzerá dobre.<br /><span>Výsledok, ktorý funguje.</span></h2>
            </div>
            <a className="text-link" href="#kontakt">Chcem podobný web <ArrowRight size={16} /></a>
          </div>
          <div className="project-grid">
            <article className="project-card project-orange">
              <div className="project-topline"><span>E-commerce</span><ArrowUpRight size={18} /></div>
              <div className="project-window window-sunrise"><div className="window-nav"><i /><i /><i /></div><div className="window-lines"><b>OBJAVTE SVOJ</b><strong>nový rytmus.</strong><small>Príbeh značky v každom detaile.</small></div><div className="window-shape" /></div>
              <div className="project-info"><h3>Ovocie & spol.</h3><span>Branding · Webdesign · Vývoj</span></div>
            </article>
            <article className="project-card project-ink">
              <div className="project-topline"><span>Prezentačný web</span><ArrowUpRight size={18} /></div>
              <div className="project-window window-ink"><div className="window-nav"><i /><i /><i /></div><div className="ink-copy"><small>THE ART OF</small><strong>DETAIL.</strong><span>Crafted for people<br />who notice.</span></div><div className="ink-circle" /></div>
              <div className="project-info"><h3>Ateliér Forma</h3><span>Stratégia · Dizajn · Vývoj</span></div>
            </article>
          </div>
        </section>

        <section className="process-section section-wrap" id="referencie">
          <div className="process-intro">
            <p className="eyebrow">AKO TO PREBIEHA</p>
            <h2>Jednoduchý proces.<br /><em>Žiadne prekvapenia.</em></h2>
            <p>Od prvého telefonátu až po spustený web viete, čo sa deje a prečo.</p>
            <div className="process-arrow" aria-hidden="true"><ArrowDown size={22} /></div>
          </div>
          <div className="process-list">
            {process.map((step) => (
              <div className="process-step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
                <ChevronRight className="step-chevron" size={22} />
              </div>
            ))}
          </div>
        </section>

        <section className="workspace-panel section-wrap">
          <div className="workspace-visual" aria-hidden="true"><span className="workspace-orb orb-large" /><span className="workspace-orb orb-small" /><span className="workspace-browser"><i /><i /><i /><b /><em /></span><Sparkles className="workspace-spark" size={24} /></div>
          <div className="workspace-copy">
            <p className="eyebrow">PRIPRAVENÍ POSUNÚŤ VÁŠ BIZNIS?</p>
            <h2>Poďme z nápadu<br />spraviť <em>výsledok.</em></h2>
            <a className="button button-primary" href="#kontakt">Dohodnúť konzultáciu <ArrowRight size={17} /></a>
          </div>
        </section>

        <section className="contact-section section-wrap" id="kontakt">
          <div className="contact-card">
            <div className="contact-copy">
              <p className="eyebrow">OZVITE SA</p>
              <h2>Máte nápad?<br /><em>Napíšte mi.</em></h2>
              <p>Stačí pár viet o vašom projekte. Ozvem sa vám do 1 pracovného dňa s prvými otázkami a návrhom ďalšieho kroku.</p>
            </div>
            <div className="contact-actions">
              <a className="contact-line" href="mailto:ahoj@webdizainfox.sk"><span><Mail size={19} /></span><div><small>E-mail</small><strong>ahoj@webdizainfox.sk</strong></div><ArrowUpRight size={18} /></a>
              <a className="contact-line" href="tel:+421900123456"><span><Phone size={19} /></span><div><small>Telefonát</small><strong>+421 900 123 456</strong></div><ArrowUpRight size={18} /></a>
              <div className="availability"><Clock3 size={16} /> Odpovedám počas pracovných dní do 24 hodín</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <div className="footer-main">
          <div><Logo /><p className="footer-note">Moderné weby, ktoré predávajú.<br />A technika, ktorá vás nezdržiava.</p></div>
          <div className="footer-links"><strong>Preskočiť na</strong>{navItems.slice(0, 4).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <div className="footer-links"><strong>Kontakt</strong><a href="mailto:ahoj@webdizainfox.sk">ahoj@webdizainfox.sk</a><a href="tel:+421900123456">+421 900 123 456</a><span>Slovensko · online</span></div>
        </div>
        <div className="footer-bottom"><span>© 2026 WebDizainFOX</span><span>Vytvorené s rozumom a kúskom líščej energie.</span><a href="#domov">Späť hore ↑</a></div>
      </footer>
    </div>
  );
}
