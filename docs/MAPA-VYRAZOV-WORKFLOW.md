# Mapa výrazov WDFOX – pravidlá dopĺňania

Hlavný HTML súbor: `public/docs/slovnik-pojmov.html`. Druhý, zapamätateľný odkaz: `/docs/mapa-vyrazov.html` (presmerovanie na hlavný súbor).

## Pri každej technickej diskusii o WDFOX

1. Rozpoznať nové technické pojmy, skratky a technológie relevantné pre WDFOX.
2. Pred zápisom overiť, či už pojem v HTML neexistuje; nevytvárať duplicitné položky. Ak existuje, spresniť jeho existujúce vysvetlenie iba pri nových relevantných informáciách.
3. Doplniť do tabuľky `<tbody>` nový riadok `<tr class="r">` so štyrmi stĺpcami: poradie, oblasť, pojem, stručné vysvetlenie + podrobné vysvetlenie v `<div class="det">`.
4. Podrobné vysvetlenie napísať jednoduchou slovenčinou, pridať konkrétny príklad z WDFOX a upozorniť na dôležité obmedzenia. Overiť technickú správnosť; reklamné tvrdenia nepovažovať za fakty.
5. Pri pridávaní zachovať existujúce funkcie: vyhľadávanie, filtrovanie, triedenie a rozbaľovanie. Zaktualizovať počet pojmov v hlavnom nadpise a dátum zmeny, skontrolovať počet riadkov.
6. Zmenu uložiť **iba do vetvy `preview`**, nikdy nie do `main` bez výslovnej požiadavky; overiť výsledok v GitHube a uviesť odkaz. Ak je možné, overiť aj nasadenie Vercel bez neoverených tvrdení.
7. Pri ďalšej diskusii aktualizovať mapu **hneď v rámci práce na danej požiadavke** pri dostupnom prístupe do repozitára. Tento dokument sám osebe nespúšťa automatický monitoring iných chatov ani aktualizácie na pozadí.

## HTML odkaz

- Web: `/docs/mapa-vyrazov.html`
- Pôvodná trvalá adresa: `/docs/slovnik-pojmov.html`
- Súvisiaca architektonická mapa: `/system-design`
