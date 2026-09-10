import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Globe2, LoaderCircle, ShieldCheck, Sparkles, Target, Search, FileText, BadgeCheck, Smartphone } from "lucide-react";

type Category = { label: string; score: number; note: string };
type Result = {
  score: number;
  title: string;
  headings: number;
  links: number;
  images: number;
  https: boolean;
  contentLength: number;
  cta: boolean;
  categories: Category[];
  recommendations: string[];
};

export default function FoxWebAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const target = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
      const parsed = new URL(target);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("Zadaj platnú HTTP alebo HTTPS adresu.");

      const response = await fetch(`https://r.jina.ai/${target}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Stránku sa nepodarilo načítať na analýzu.");
      const raw = await response.text();

      let content = raw;
      let title = "";
      try {
        const json = JSON.parse(raw);
        const data = json?.data || json;
        content = data?.content || "";
        title = data?.title || "";
      } catch {
        // Reader can return plain text.
      }
      if (!content) content = raw;

      const headingMatches = content.match(/^#{1,3}\s+.+$/gm) || [];
      const links = content.match(/\[[^\]]+\]\([^\)]+\)/g) || [];
      const images = content.match(/!\[[^\]]*\]\([^\)]+\)/g) || [];
      const clean = content.replace(/[#*_`>\[\]()]/g, " ").replace(/\s+/g, " ").trim();
      const contentLength = clean.length;
      const lower = clean.toLowerCase();
      const ctaWords = ["kontakt", "contact", "objedna", "chcem", "kúpi", "kup", "rezerv", "book", "call", "get started", "začať", "nezáväz", "ponuka", "cena"];
      const trustWords = ["referenc", "recenzi", "testimonial", "klient", "case study", "certifik", "garanci", "skúsen", "skusen"];
      const benefitWords = ["výhod", "benefit", "riešen", "result", "výsled", "šetri", "získ", "rast", "pomôž", "pomoz", "prečo", "preco"];
      const hasCta = ctaWords.some((word) => lower.includes(word));
      const hasTrust = trustWords.some((word) => lower.includes(word));
      const hasBenefits = benefitWords.some((word) => lower.includes(word));

      const seoScore = Math.round((title.length >= 10 && title.length <= 70 ? 40 : title ? 20 : 0) + (headingMatches.length >= 2 ? 30 : headingMatches.length === 1 ? 15 : 0) + (contentLength >= 500 ? 30 : contentLength >= 250 ? 18 : 8));
      const conversionScore = Math.round((hasCta ? 40 : 5) + (links.length >= 3 ? 25 : links.length > 0 ? 12 : 0) + (hasBenefits ? 20 : 0) + (hasTrust ? 15 : 0));
      const contentScore = Math.min(100, Math.round((contentLength >= 1200 ? 45 : contentLength >= 700 ? 35 : contentLength >= 400 ? 25 : 12) + (headingMatches.length >= 3 ? 25 : headingMatches.length >= 2 ? 18 : 8) + (hasBenefits ? 20 : 5) + (images.length > 0 ? 10 : 0)));
      const trustScore = Math.min(100, Math.round((parsed.protocol === "https:" ? 35 : 0) + (hasTrust ? 35 : 5) + (hasCta ? 15 : 0) + (links.length >= 2 ? 15 : 5)));
      const uxScore = Math.min(100, Math.round((headingMatches.length >= 2 ? 30 : headingMatches.length === 1 ? 18 : 8) + (images.length > 0 ? 20 : 5) + (links.length >= 3 ? 25 : links.length > 0 ? 12 : 0) + (hasCta ? 25 : 5)));

      const categories: Category[] = [
        { label: "SEO", score: seoScore, note: seoScore >= 75 ? "Silný základ" : "Je priestor na zlepšenie" },
        { label: "Konverzia", score: conversionScore, note: conversionScore >= 75 ? "CTA funguje" : "Posilni ďalší krok" },
        { label: "Obsah", score: contentScore, note: contentScore >= 75 ? "Dostatočná hĺbka" : "Pridaj hodnotný obsah" },
        { label: "Dôvera", score: trustScore, note: trustScore >= 75 ? "Dobrá dôveryhodnosť" : "Pridaj dôkazy" },
        { label: "UX", score: uxScore, note: uxScore >= 75 ? "Jasná štruktúra" : "Zjednoduš cestu" },
      ];

      const score = Math.round(categories.reduce((sum, item) => sum + item.score, 0) / categories.length);
      const recommendations: string[] = [];
      if (!title) recommendations.push("Doplň jasný SEO titulok stránky s hlavnou hodnotou ponuky.");
      else if (title.length < 10 || title.length > 70) recommendations.push("Uprav titulok približne na 10–70 znakov a zameraj ho na zákazníka.");
      if (headingMatches.length < 2) recommendations.push("Vytvor jasnú hierarchiu nadpisov H1/H2 a rozdeľ obsah do sekcií.");
      if (!hasCta || links.length < 2) recommendations.push("Pridaj výrazné CTA, ktoré návštevníka vedie k jednému konkrétnemu ďalšiemu kroku.");
      if (!hasBenefits) recommendations.push("Komunikuj konkrétne benefity a výsledok, ktorý zákazník získa.");
      if (!hasTrust) recommendations.push("Pridaj referencie, recenzie, ukážky práce alebo iný dôkaz dôveryhodnosti.");
      if (contentLength < 500) recommendations.push("Rozšír obsah o služby, benefity, dôkazy a odpovede na najčastejšie otázky.");
      if (images.length === 0) recommendations.push("Zváž relevantné obrázky alebo ukážky práce, ktoré podporia ponuku.");
      if (parsed.protocol !== "https:") recommendations.push("Použi HTTPS pre bezpečný prenos a dôveryhodnosť webu.");

      setResult({ score, title, headings: headingMatches.length, links: links.length, images: images.length, https: parsed.protocol === "https:", contentLength, cta: hasCta, categories, recommendations });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analýzu sa nepodarilo dokončiť.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fox-analyzer section-wrap" id="analyza">
      <style>{`.fox-analyzer{margin-top:20px}.fox-analyzer-inner{display:grid;grid-template-columns:1fr 1.08fr;gap:44px;align-items:center;background:#171717;color:#fff;border-radius:34px;padding:54px;overflow:hidden;position:relative}.fox-analyzer-inner:before{content:"";position:absolute;width:420px;height:420px;right:-180px;top:-220px;border-radius:50%;background:rgba(243,106,10,.16);filter:blur(4px)}.fox-analyzer-copy,.fox-analyzer-card{position:relative;z-index:1}.fox-analyzer-copy .eyebrow{display:flex;align-items:center;gap:8px;color:#ff7a22}.fox-analyzer-copy h2{font-size:clamp(32px,4vw,54px);line-height:1.03;margin:14px 0}.fox-analyzer-copy h2 em{color:#f36a0a;font-style:normal}.fox-analyzer-copy>p:not(.eyebrow){color:#cfcfcf;max-width:560px;font-size:17px;line-height:1.65}.fox-analyzer-points{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:26px}.fox-analyzer-points span{display:flex;align-items:center;gap:8px;color:#eee;font-size:14px}.fox-analyzer-points svg{color:#f36a0a}.fox-analyzer-card{background:#fff;color:#171717;border-radius:24px;padding:28px;box-shadow:0 24px 70px rgba(0,0,0,.25)}.fox-analyzer-form label{display:block;font-weight:800;margin-bottom:9px}.fox-url-row{display:flex;gap:10px}.fox-url-input{display:flex;align-items:center;gap:9px;flex:1;border:1px solid #ddd;border-radius:14px;padding:0 14px;background:#fafafa}.fox-url-input svg{color:#f36a0a;flex:none}.fox-url-input input{width:100%;border:0;outline:0;background:transparent;padding:16px 0;font-size:15px;min-width:0}.fox-url-row .button{border:0;white-space:nowrap}.fox-analyzer-form small{display:block;color:#777;margin-top:10px;font-size:12px}.fox-analyzer-error{margin-top:18px;background:#fff1eb;color:#b33b08;border-radius:12px;padding:12px 14px;font-size:14px}.fox-result{margin-top:24px;border-top:1px solid #eee;padding-top:22px}.fox-score{display:flex;align-items:center;justify-content:space-between;background:#fff7f2;border-radius:16px;padding:14px 18px;margin-bottom:14px}.fox-score>div{display:flex;align-items:baseline;gap:14px}.fox-score span{font-size:11px;font-weight:900;letter-spacing:.12em;color:#777}.fox-score strong{font-size:34px;color:#f36a0a;line-height:1}.fox-score strong small{font-size:13px;color:#777}.fox-score>svg{color:#f36a0a}.fox-categories{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:14px}.fox-category{border:1px solid #eee;border-radius:12px;padding:10px;text-align:center;background:#fff}.fox-category strong{display:block;font-size:19px;color:#f36a0a}.fox-category span{display:block;font-size:10px;font-weight:800;margin-top:3px}.fox-category small{display:block;font-size:9px;color:#888;margin-top:3px;line-height:1.2}.fox-result-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.fox-result-item{display:flex;gap:9px;align-items:flex-start;border:1px solid #eee;border-radius:12px;padding:11px}.fox-result-item>svg{color:#f36a0a;flex:none}.fox-result-item strong,.fox-result-item span{display:block}.fox-result-item strong{font-size:13px}.fox-result-item span{font-size:11px;color:#777;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}.fox-recommendations{margin-top:14px;border-radius:14px;background:#f7f7f7;padding:14px;font-size:13px}.fox-recommendations ul{margin:8px 0 0;padding-left:18px;color:#555;line-height:1.6}.fox-analyzer-foot{display:flex;gap:8px;align-items:center;margin-top:12px;color:#777;font-size:11px}.fox-analyzer-foot svg{color:#f36a0a}.fox-spin{animation:fox-spin 1s linear infinite}@keyframes fox-spin{to{transform:rotate(360deg)}}@media(max-width:850px){.fox-analyzer-inner{grid-template-columns:1fr;padding:34px 24px;gap:28px}.fox-url-row{flex-direction:column}.fox-url-row .button{width:100%;justify-content:center}.fox-analyzer-points{grid-template-columns:1fr}.fox-categories{grid-template-columns:repeat(3,1fr)}}@media(max-width:520px){.fox-analyzer-card{padding:20px}.fox-analyzer-inner{border-radius:24px}.fox-result-grid{grid-template-columns:1fr}.fox-categories{grid-template-columns:repeat(2,1fr)}}`}</style>
      <div className="fox-analyzer-inner">
        <div className="fox-analyzer-copy">
          <p className="eyebrow"><Sparkles size={15} /> FOX LANDING PAGE AUDIT</p>
          <h2>Je tvoja stránka pripravená<br /><em>meniť návštevy na klientov?</em></h2>
          <p>Zadaj URL a získaj rýchly audit SEO, konverzie, obsahu, dôvery a UX. Vlastné FOX hodnotenie bez registrácie.</p>
          <div className="fox-analyzer-points"><span><Search size={16} /> SEO a štruktúra</span><span><Target size={16} /> Konverzia a CTA</span><span><FileText size={16} /> Obsah a benefity</span><span><BadgeCheck size={16} /> Dôvera a UX</span></div>
        </div>
        <div className="fox-analyzer-card">
          <form onSubmit={analyze} className="fox-analyzer-form">
            <label htmlFor="fox-url">URL webstránky</label>
            <div className="fox-url-row"><div className="fox-url-input"><Globe2 size={19} /><input id="fox-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://tvoja-stranka.sk" /></div><button className="button button-primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle size={18} className="fox-spin" /> Analyzujem…</> : <>Spustiť audit <ArrowRight size={17} /></>}</button></div>
            <small>Analyzujeme verejne dostupný obsah zadanej stránky.</small>
          </form>
          {error && <div className="fox-analyzer-error" role="alert">{error}</div>}
          {result && <div className="fox-result"><div className="fox-score"><div><span>FOX SCORE</span><strong>{result.score}<small>/100</small></strong></div><ShieldCheck size={34} /></div><div className="fox-categories">{result.categories.map((category) => <div className="fox-category" key={category.label}><strong>{category.score}</strong><span>{category.label}</span><small>{category.note}</small></div>)}</div><div className="fox-result-grid"><ResultItem label="HTTPS" ok={result.https} /><ResultItem label="SEO titulok" ok={!!result.title} detail={result.title || "Chýba"} /><ResultItem label="Nadpisy" ok={result.headings >= 2} detail={`${result.headings} nájdené`} /><ResultItem label="CTA / odkazy" ok={result.cta && result.links >= 2} detail={`${result.links} nájdené`} /><ResultItem label="Obrázky" ok={result.images > 0} detail={`${result.images} nájdených`} /><ResultItem label="Obsah" ok={result.contentLength >= 500} detail={`${result.contentLength} znakov`} /></div>{result.recommendations.length > 0 && <div className="fox-recommendations"><strong>Prioritné odporúčania</strong><ul>{result.recommendations.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul></div>}<div className="fox-analyzer-foot"><Smartphone size={14} /> Audit je orientačný a vychádza z verejne dostupného obsahu stránky.</div></div>}
        </div>
      </div>
    </section>
  );
}

function ResultItem({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return <div className="fox-result-item"><CheckCircle2 size={17} /><div><strong>{label}</strong><span>{detail || (ok ? "V poriadku" : "Vyžaduje pozornosť")}</span></div></div>;
}
