# Astro + Sanity migračné poznámky

## Overené zdroje

Astro poskytuje oficiálny i18n routing pre tvorbu, používanie a overovanie viacjazyčných URL: https://docs.astro.build/en/guides/internationalization/

Astro má aj recept na vlastnú lokalizáciu cez file-based routing a content collections: https://docs.astro.build/en/recipes/i18n/

Oficiálna dokumentácia pre Sanity + Astro je dostupná na: https://docs.astro.build/en/guides/cms/sanity/

Oficiálny Sanity JavaScript klient a jeho konfigurácia: https://www.sanity.io/docs/apis-and-sdks/js-client-getting-started

Oficiálny Astro plugin pre Sanity: https://www.sanity.io/plugins/sanity-astro

## Rozhodnutia pre projekt

Použijeme Astro file-based routing s deviatimi statickými jazykovými cestami: `/de/`, `/en/`, `/sk/`, `/fr/`, `/hr/`, `/pl/`, `/it/`, `/es/` a `/sv/`. Root `/` bude presmerovaný na `/de/` ako predvolený jazyk.

Obsah bude mať spoločné Sanity schema `landingPage`, pričom každý dokument bude mať pole `language` a lokalizované objekty pre navigáciu, hero, služby, portfólio, proces a kontakt. Frontend bude používať iba verejný read-only dataset cez `@sanity/client`; zapisovací token sa do prehliadača ani repozitára nepridáva.

Aby web fungoval okamžite aj bez vytvoreného Sanity projektu, Astro build použije lokálny fallback obsah. Po nastavení `PUBLIC_SANITY_PROJECT_ID` a `PUBLIC_SANITY_DATASET` sa pri builde načíta obsah zo Sanity; pri nedostupnosti CMS alebo chýbajúcom dokumente zostane stránka funkčná cez fallback.

## Jazyky

| Kód | Jazyk | Predvolený |
|---|---|---|
| DE | nemčina | áno |
| EN | angličtina | nie |
| SK | slovenčina | nie |
| FR | francúzština | nie |
| HR | chorvátčina | nie |
| PL | poľština | nie |
| IT | taliančina | nie |
| ES | španielčina | nie |
| SV | švédčina | nie |
