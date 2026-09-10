# WDFOX – synchronizácia jazyka stránky a Tawk.to

## Cieľ

WDFOX musí pri prvej návšteve zvoliť podporovaný jazyk podľa prehliadača. Po ručnom výbere vlajky musia stránka aj Tawk.to chat používať rovnaký jazyk. Starý chat nesmie prenášať hlavičku, uvítanie ani históriu do nového jazykového widgetu.

## Podporované jazyky a widgety

Všetky widgety patria do Tawk.to property `6a951d52c3c46c344587662a`.

| Jazyk | Kód | Widget ID |
|---|---|---|
| Slovenčina | `sk` | `1k1b9121q` |
| Nemčina | `de` | `1k1bb2aln` |
| Angličtina | `en` | `1k1bb9ast` |
| Chorvátčina | `hr` | `1k1bjvbjq` |
| Francúzština | `fr` | `1k1blk6o4` |
| Taliančina | `it` | `1k1bovo5t` |
| Poľština | `pl` | `1k1bp5qda` |
| Španielčina | `es` | `1k1bp6lk5` |
| Švédčina | `sv` | `1k1bpdngj` |

## Zdrojové súbory

- `src/pages/index.astro` – prvotná detekcia a presmerovanie.
- `src/layouts/BaseLayout.astro` – vlajky, uloženie voľby a spustenie prepnutia.
- `public/tawk-language-loader.js` – mapa widgetov, načítanie a prepnutie Tawk.to.
- `.github/workflows/deploy.yml` – build a nasadenie na GitHub Pages.

## Rozhodovanie o jazyku

### Prvá návšteva `/`

1. Prečítať `wdfox-language` z `localStorage`.
2. Ak je uložená hodnota podporovaná, použiť ju.
3. Inak prejsť `navigator.languages`, normalizovať hodnoty ako `sk-SK` na `sk` a vybrať prvý podporovaný jazyk.
4. Pri nepodporovanom jazyku použiť `sk`.
5. Presmerovať cez `window.location.replace()` na `/{jazyk}/` a zachovať query aj hash.

Toto pravidlo znamená: prvá návšteva rešpektuje prehliadač; ďalšie návštevy koreňovej URL rešpektujú poslednú vedomú voľbu používateľa.

### Lokalizovaná URL

Na adresách `/sk/`, `/de/`, `/en/` atď. je jazyk v URL autoritatívny. `document.documentElement.lang` slúži len ako záloha. Loader uloží výsledný jazyk do `localStorage`, aby sa stránka a chat nerozišli.

## Prepnutie vlajkou

Každá vlajka používa relatívnu lokalizovanú URL a atribút `data-language`:

```astro
<a href={pathFor(code)} data-language={code}>…</a>
```

Kliknutie vykoná tento tok:

1. uloží nový kód do `localStorage`;
2. zastaví okamžitú navigáciu;
3. ukončí aktuálnu Tawk reláciu cez `Tawk_API.endChat()`;
4. prepne widget cez `Tawk_API.switchWidget({ propertyId, widgetId })`;
5. po callbacku otvorí cieľovú jazykovú URL;
6. bezpečnostný timeout vykoná navigáciu aj vtedy, keď Tawk callback nepríde.

Ukončenie relácie je dôležité. Samotný `switchWidget()` zámerne zachováva konverzáciu, čo môže preniesť napríklad slovenskú hlavičku a starú správu do nemeckého widgetu.

## Načítanie Tawk.to

Na každej lokalizovanej stránke sa musí načítať presne jeden embed skript:

```js
script.src = "https://embed.tawk.to/" + PROPERTY_ID + "/" + widgets[language];
```

Pri každej zmene loadera zvýšiť cache parameter v `BaseLayout.astro`, napríklad:

```astro
<script is:inline src="/tawk-language-loader.js?v=YYYYMMDDx"></script>
```

Bez zvýšenia verzie môže prehliadač alebo GitHub Pages naďalej poskytovať starý JavaScript.

## Tawk.to konfigurácia

Každý z deviatich widgetov musí mať vo svojom jazyku nastavené najmenej:

- názov hlavičky zákazníckej podpory;
- uvítaciu a spúšťaciu správu;
- rýchle odpovede/tlačidlá;
- placeholder vstupného poľa;
- online, away a offline texty;
- pre-chat a offline formulár, ak sa používajú.

Kód nedokáže opraviť nesprávne texty uložené priamo v administrácii konkrétneho Tawk widgetu.

## Nasadenie

Push do `main` spúšťa `.github/workflows/deploy.yml`:

1. checkout;
2. Node.js 22;
3. pnpm 10.4.1;
4. `pnpm install --frozen-lockfile`;
5. `pnpm run build`;
6. upload priečinka `dist`;
7. deploy na GitHub Pages.

Nasadenie sa nepovažuje za hotové len preto, že commit existuje. Workflow musí skončiť zeleným stavom a živá stránka musí načítavať aktuálny cache parameter loadera.

## Povinný test po zmene

Použiť nové inkognito okno, aby test nezačínal starou reláciou.

1. Otvoriť `https://www.foxprof.club/`.
2. Overiť jazyk podľa nastavenia prehliadača.
3. Otvoriť chat a skontrolovať hlavičku, uvítanie, tlačidlá a placeholder.
4. Prepnúť vlajkou na iný jazyk.
5. Znova otvoriť chat a overiť, že v ňom nezostala hlavička ani správa z predošlého jazyka.
6. Otestovať aspoň oba smery `SK → DE` a `DE → SK`.
7. Otestovať všetkých deväť jazykov podľa mapy.

## Diagnostika

| Prejav | Pravdepodobná príčina | Oprava |
|---|---|---|
| Stránka je nová, chat zostal v starom jazyku | Zachovaná Tawk relácia | Pred `switchWidget()` zavolať `endChat()` |
| Nové tlačidlá sú správne, ale hlavička je stará | Konverzácia sa preniesla medzi widgetmi | Ukončiť reláciu a až potom prepnúť widget |
| `/` vždy otvorí jeden natvrdo zadaný jazyk | Serverový redirect je natvrdo nastavený | Použiť klientsku detekciu `navigator.languages` |
| Vlajka zmení stránku, nie chat | Chýba spoločný click handler | Uložiť jazyk a zavolať Tawk prepnutie pred navigáciou |
| Produkcia používa staré správanie | Cache alebo neúspešný deployment | Zvýšiť `?v=`, skontrolovať Actions a živý HTML zdroj |
| GitHub Pages nič nenasadil | Build zlyhal | Otvoriť log kroku `Build Astro site`, opraviť chybu a zopakovať workflow |

## Kritériá úspechu

Riešenie je hotové iba vtedy, keď pre každý podporovaný jazyk súčasne platí:

- URL, obsah stránky a atribút `<html lang>` majú rovnaký jazyk;
- aktívna vlajka zodpovedá URL;
- Tawk používa správne widget ID;
- hlavička, správa, tlačidlá a vstupné pole chatu sú v rovnakom jazyku;
- po prepnutí nezostane viditeľný text z predchádzajúcej jazykovej relácie;
- GitHub Pages deployment skončil úspešne.
