import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Globe2, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";

type Result = { score: number; title: string; headings: number; links: number; images: number; https: boolean; contentLength: number; recommendations: string[] };

export default function FoxWebAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setResult(null); setLoading(true);
    try {
      const target = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
      const parsed = new URL(target);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("Zadaj platnú HTTP alebo HTTPS adresu.");
      const response = await fetch(`https://r.jina.ai/${target}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Stránku sa nepodarilo načítať na analýzu.");
      const raw = await response.text();
      let content = raw; let title = "";
      try { const json = JSON.parse(raw); const data = json?.data || json; content = data?.content || ""; title = data?.title || ""; } catch { /* Reader may return plain text. */ }
      if (!content) content = raw;
      const headingMatches = content.match(/^#{1,3}\s+.+$/gm) || [];
      const links = content.match(/\[[^\]]+\]\([^\)]+\)/g) || [];
      const images = content.match(/!\[[^\]]*\]\([^\)]+\)/g) || [];
      const https = parsed.protocol === "https:";
      const contentLength = content.replace(/[#*_`>\[\]()]/g, " ").replace(/\s+/g, " ").trim().length;
      let score = (https ? 20 : 0) + (title.length >= 10 && title.length <= 70 ? 20 : 0) + (headingMatches.length >= 2 ? 20 : headingMatches.length === 1 ? 12 : 0) + (contentLength >= 500 ? 20 : contentLength >= 250 ? 12 : 5) + (links.length > 2 ? 10 : links.length > 0 ? 5 : 0) + (images.length > 0 ? 10 : 0);
      const recommendations: string[] = [];
      if (!https) recommendations.push("Použi HTTPS pre dôveryhodnosť a bezpečný prenos.");
      if (!title) recommendations.push("Doplň jasný titulok stránky, ktorý vysvetlí jej hlavnú hodnotu."); else if (title.length < 10 || title.length > 70) recommendations.push("Uprav dĺžku titulku približne na 10–70 znakov.");
      if (headingMatches.length < 2) recommendations.push("Rozdeľ stránku do jasnejšej hierarchie nadpisov a sekcií.");
      if (contentLength < 500) recommendations.push("Rozšír obsah o konkrétne benefity, dôkazy a odpovede na námietky klienta.");
      if (links.length < 2) recommendations.push("Pridaj výraznejšie CTA alebo ďalšie relevantné odkazy na ďalší krok.");
      setResult({ score: Math.min(100, score), title, headings: headingMatches.length, links: links.length, images: images.length, https, contentLength, recommendations });
    } catch (err) { setError(err instanceof Error ? err.message : "Analýzu sa nepodarilo dokončiť."); }
    finally { setLoading(false); }
  };

  return (
    <section className="fox-analyzer section-wrap" id="analyza">
      <style>{`.fox-analyzer{margin-top:20px}.fox-analyzer-inner{display:grid;grid-template-columns:1fr 1.08fr;gap:44px;align-items:center;background:#171717;color:#fff;border-radius:34px;padding:54px;overflow:hidden;position:relative}.fox-analyzer-inner:before{content:"";position:absolute;width:420px;height:420px;right:-180px;top:-220px;border-radius:50%;background:rgba(243,106,10,.16);filter:blur(4px)}.fox-analyzer-copy{position:relative;z-index:1}.fox-analyzer-copy .eyebrow{display:flex;align-items:center;gap:8px;color:#ff7a22}.fox-analyzer-copy h2{font-size:clamp(32px,4vw,54px);line-height:1.03;margin:14px 0}.fox-analyzer-copy h2 em{color:#f36a0a;font-style:normal}.fox-analyzer-copy>p:not(.eyebrow){color:#cfcfcf;max-width:560px;font-size:17px;line-height:1.65}.fox-analyzer-points{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:26px}.fox-analyzer-points span{display:flex;align-items:center;gap:8px;color:#eee;font-size:14px}.fox-analyzer-points svg{color:#f36a0a}.fox-analyzer-card{background:#fff;color:#171717;border-radius:24px;padding:28px;position:relative;z-index:1;box-shadow:0 24px 70px rgba(0,0,0,.25)}.fox-analyzer-form label{display:block;font-weight:800;margin-bottom:9px}.fox-url-row{display:flex;gap:10px}.fox-url-input{display:flex;align-items:center;gap:9px;flex:1;border:1px solid #ddd;border-radius:14px;padding:0 14px;background:#fafafa}.fox-url-input svg{color:#f36a0a;flex:none}.fox-url-input input{width:100%;border:0;outline:0;background:transparent;padding:16px 0;font-size:15px;min-width:0}.fox-url-row .button{border:0;white-space:nowrap}.fox-analyzer-form small{display:block;color:#777;margin-top:10px;font-size:12px}.fox-analyzer-error{margin-top:18px;background:#fff1eb;color:#b33b08;border-radius:12px;padding:12px 14px;font-size:14px}.fox-result{margin-top:24px;border-top:1px solid #eee;padding-top:22px}.fox-score{display:flex;align-items:center;justify-content:space-between;background:#fff7f2;border-radius:16px;padding:14px 18px;margin-bottom:14px}.fox-score>div{display:flex;align-items:baseline;gap:14px}.fox-score span{font-size:11px;font-weight:900;letter-spacing:.12em;color:#777}.fox-score strong{font-size:34px;color:#f36a0a;line-height:1}.fox-score small{font-size:13px;color:#777}.fox-score>svg{color:#f36a0a}.fox-result-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.fox-result-item{display:flex;gap:9px;align-items:flex-start;border:1px solid #eee;border-radius:12px;padding:11px}.fox-result-item>svg{color:#f36a0a;flex:none}.fox-result-item strong,.fox-result-item span{display:block}.fox-result-item strong{font-size:13px}.fox-result-item span{font-size:11px;color:#777;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}.fox-recommendations{margin-top:14px;border-radius:14px;background:#f7f7f7;padding:14px;font-size:13px}.fox-recommendations ul{margin:8px 0 0;padding-left:18px;color:#555;line-height:1.6}.fox-spin{animation:fox-spin 1s linear infinite}@keyframes fox-spin{to{transform:rotate(360deg)}}@media(max-width:850px){.fox-analyzer-inner{grid-template-columns:1fr;padding:34px 24px;gap:28px}.fox-url-row{flex-direction:column}.fox-url-row .button{width:100%;justify-content:center}.fox-analyzer-points{grid-template-columns:1fr}}@media(max-width:520px){.fox-analyzer-card{padding:20px}.fox-analyzer-inner{border-radius:24px}.fox-result-grid{grid-template-columns:1fr}}`}</style>
      <div className="fox-analyzer-inner">
        <div className="fox-analyzer-copy">
          <p className="eyebrow"><Sparkles size={15} /> FOX WEB ANALYZER</p>
          <h2>Performuje tvoja webstránka<br /><em>tak, ako má?</em></h2>
          <p>Zadaj URL a získaj rýchly obsahový a konverzný prehľad. Vlastná FOX analýza bez registrácie.</p>
          <div className="fox-analyzer-points"><span><CheckCircle2 size={16} /> Štruktúra obsahu</span><span><CheckCircle2 size={16} /> Nadpisy a CTA</span><span><CheckCircle2 size={16} /> Odkazy a obrázky</span><span><CheckCircle2 size={16} /> FOX Score</span></div>
        </div>
        <div className="fox-analyzer-card">
          <form onSubmit={analyze} className="fox-analyzer-form">
            <label htmlFor="fox-url">URL webstránky</label>
            <div className="fox-url-row"><div className="fox-url-input"><Globe2 size={19} /><input id="fox-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://tvoja-stranka.sk" /></div><button className="button button-primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle size={18} className="fox-spin" /> Analyzujem…</> : <>Analyzovať <ArrowRight size={17} /></>}</button></div>
            <small>Analyzujeme verejne dostupný obsah zadanej stránky.</small>
          </form>
          {error && <div className="fox-analyzer-error" role="alert">{error}</div>}
          {result && <div className="fox-result"><div className="fox-score"><div><span>FOX SCORE</span><strong>{result.score}<small>/100</small></strong></div><ShieldCheck size={34} /></div><div className="fox-result-grid"><ResultItem label="HTTPS" ok={result.https} /><ResultItem label="Titulok" ok={!!result.title} detail={result.title || "Chýba"} /><ResultItem label="Nadpisy" ok={result.headings >= 2} detail={`${result.headings} nájdené`} /><ResultItem label="CTA / odkazy" ok={result.links >= 2} detail={`${result.links} nájdené`} /><ResultItem label="Obrázky" ok={result.images > 0} detail={`${result.images} nájdených`} /><ResultItem label="Obsah" ok={result.contentLength >= 500} detail={`${result.contentLength} znakov`} /></div>{result.recommendations.length > 0 && <div className="fox-recommendations"><strong>Najdôležitejšie odporúčania</strong><ul>{result.recommendations.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul></div>}</div>}
        </div>
      </div>
    </section>
  );
}

function ResultItem({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return <div className="fox-result-item"><CheckCircle2 size={17} /><div><strong>{label}</strong><span>{detail || (ok ? "V poriadku" : "Vyžaduje pozornosť")}</span></div></div>;
}
