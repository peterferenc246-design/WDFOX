function blocked(host: string) {
  const h = host.toLowerCase();
  return h === "localhost" || h.endsWith(".localhost") || h === "127.0.0.1" || h === "::1" || h === "0.0.0.0" || h === "169.254.169.254" || h.startsWith("10.") || h.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[0-1])\./.test(h) || h.endsWith(".local") || h.endsWith(".internal");
}

const pick = (html: string, re: RegExp) => html.match(re)?.[1]?.replace(/\s+/g, " ").trim() || "";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Metóda nie je podporovaná." });
  try {
    const raw = typeof req.body?.url === "string" ? req.body.url.trim() : "";
    if (!raw) return res.status(400).json({ error: "Zadaj URL webstránky." });
    const target = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/^https?:$/.test(target.protocol) || blocked(target.hostname)) return res.status(400).json({ error: "Táto URL nie je povolená na analýzu." });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(target, { signal: controller.signal, redirect: "follow", headers: { "User-Agent": "FOX-Web-Analyzer/1.0" } });
    clearTimeout(timer);
    if (!response.ok) return res.status(502).json({ error: `Stránka odpovedala stavom ${response.status}.` });
    const html = (await response.text()).slice(0, 2000000);
    const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1]?.trim() || "";
    const h1 = (html.match(/<h1\b/gi) || []).length;
    const headings = (html.match(/<h[1-3]\b/gi) || []).length;
    const images = html.match(/<img\b[^>]*>/gi) || [];
    const missingAlt = images.filter((tag: string) => !/\balt\s*=/.test(tag)).length;
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const https = target.protocol === "https:";
    let score = (https ? 20 : 0) + (title.length >= 10 && title.length <= 70 ? 20 : 0) + (description.length >= 50 && description.length <= 170 ? 15 : 0) + (viewport ? 15 : 0) + (h1 === 1 ? 15 : 0) + (missingAlt === 0 ? 10 : 0) + ((html.match(/<a\b/gi) || []).length > 0 ? 5 : 0);
    const recommendations: string[] = [];
    if (!https) recommendations.push("Zapni HTTPS a presmeruj HTTP na bezpečnú verziu.");
    if (!title) recommendations.push("Doplň jedinečný HTML title."); else if (title.length < 10 || title.length > 70) recommendations.push("Uprav dĺžku title približne na 10–70 znakov.");
    if (!description) recommendations.push("Doplň meta description s jasným dôvodom na návštevu.");
    if (!viewport) recommendations.push("Pridaj viewport meta tag pre mobilné zariadenia.");
    if (h1 !== 1) recommendations.push(`Skontroluj H1: nájdených je ${h1}; odporúčaný je jeden hlavný nadpis.`);
    if (missingAlt > 0) recommendations.push(`Doplň alt text pri ${missingAlt} obrázkoch.`);
    return res.status(200).json({ score, title: { value: title, ok: title.length >= 10 && title.length <= 70 }, description: { value: description, ok: description.length >= 50 && description.length <= 170 }, headings: { count: headings, ok: h1 === 1 }, images: { total: images.length, missingAlt, ok: missingAlt === 0 }, https: { ok: https }, viewport: { ok: viewport }, recommendations });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error && error.name === "AbortError" ? "Stránka neodpovedala do 10 sekúnd." : "URL sa nepodarilo načítať. Skontroluj adresu a skús to znova." });
  }
}
