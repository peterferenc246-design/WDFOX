import { useState } from "react";
import { ArrowRight, CheckCircle2, Globe2, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";

type Result = {
  score: number;
  title: { value: string; ok: boolean };
  description: { value: string; ok: boolean };
  headings: { count: number; ok: boolean };
  images: { total: number; missingAlt: number; ok: boolean };
  https: { ok: boolean };
  viewport: { ok: boolean };
  recommendations: string[];
};

export default function FoxWebAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analýzu sa nepodarilo dokončiť.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analýzu sa nepodarilo dokončiť.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fox-analyzer section-wrap" id="analyza">
      <div className="fox-analyzer-inner">
        <div className="fox-analyzer-copy">
          <p className="eyebrow"><Sparkles size={15} /> FOX WEB ANALYZER</p>
          <h2>Performuje tvoja webstránka<br /><em>tak, ako má?</em></h2>
          <p>Zadaj URL a získaj rýchly technický a konverzný prehľad. Bez registrácie a bez Leadscape.</p>
          <div className="fox-analyzer-points">
            <span><CheckCircle2 size={16} /> SEO základ</span>
            <span><CheckCircle2 size={16} /> Mobilná pripravenosť</span>
            <span><CheckCircle2 size={16} /> Technické chyby</span>
            <span><CheckCircle2 size={16} /> Konverzné odporúčania</span>
          </div>
        </div>
        <div className="fox-analyzer-card">
          <form onSubmit={analyze} className="fox-analyzer-form">
            <label htmlFor="fox-url">URL webstránky</label>
            <div className="fox-url-row">
              <div className="fox-url-input"><Globe2 size={19} /><input id="fox-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://tvoja-stranka.sk" /></div>
              <button className="button button-primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle size={18} className="fox-spin" /> Analyzujem…</> : <>Analyzovať <ArrowRight size={17} /></>}</button>
            </div>
            <small>Analýza pracuje s verejne dostupným obsahom zadanej stránky.</small>
          </form>
          {error && <div className="fox-analyzer-error" role="alert">{error}</div>}
          {result && (
            <div className="fox-result">
              <div className="fox-score"><div><span>FOX SCORE</span><strong>{result.score}<small>/100</small></strong></div><ShieldCheck size={34} /></div>
              <div className="fox-result-grid">
                <ResultItem label="HTTPS" ok={result.https.ok} />
                <ResultItem label="Title" ok={result.title.ok} detail={result.title.value || "Chýba"} />
                <ResultItem label="Meta description" ok={result.description.ok} />
                <ResultItem label="Viewport" ok={result.viewport.ok} />
                <ResultItem label="Obrázky / alt" ok={result.images.ok} detail={`${result.images.total} / ${result.images.missingAlt} bez alt`} />
                <ResultItem label="Nadpisy H1–H3" ok={result.headings.ok} detail={`${result.headings.count} nájdených`} />
              </div>
              {result.recommendations.length > 0 && <div className="fox-recommendations"><strong>Najdôležitejšie odporúčania</strong><ul>{result.recommendations.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul></div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ResultItem({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return <div className="fox-result-item"><CheckCircle2 size={17} /><div><strong>{label}</strong><span>{detail || (ok ? "V poriadku" : "Vyžaduje pozornosť")}</span></div></div>;
}
