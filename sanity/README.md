# WebDizainFOX Sanity CMS

Projekt obsahuje schema `landingPage` pre deväť jazykov: `de`, `en`, `sk`, `fr`, `hr`, `pl`, `it`, `es` a `sv`. V Sanity vytvorte jeden dokument typu `landingPage` pre každý jazyk a vyplňte pole `language` príslušným kódom.

Astro načítava publikovaný obsah cez `@sanity/client` pri statickom builde. Nastavte:

```bash
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-01-01
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

Frontend nepotrebuje zapisovací token. Ak env premenné nie sú nastavené, ak je Sanity projekt nedostupný alebo chýba preklad, stránka použije lokálny fallback obsah a build zostane funkčný.

## Odporúčané nasadenie Studio

Sanity Studio sa nasadzuje samostatne cez Sanity CLI z koreňa projektu. Po pridaní vlastného `sanity.cli.ts` a prihlásení do Sanity je možné Studio hostovať na samostatnej URL, zatiaľ čo Astro web zostáva staticky hostovaný na Manus alebo inom kompatibilnom hostingu.

## Obsahový model

Každý jazyk je samostatný `landingPage` dokument. To umožňuje editorom meniť headline, CTA, služby, proces, kontaktné texty aj SEO title bez zásahu do Astro komponentov. Pri zverejnení dokumentu sa zmena prejaví pri ďalšom Astro builde.
