# WDFOX – WhatsApp + n8n: bezpečný testovací workflow (DRY-RUN)

**Stav k 15. 11. 2026:** pripravený a staticky validovaný importovateľný workflow. Jeho päť JavaScript uzlov bolo vykonaných na štyroch simulovaných správach: slovenčina, nemčina, angličtina a jedna duplicita. **Živý n8n workflow nebol vytvorený ani spustený.** Pri kontrole cez dostupné konektory n8n vrátil chyby 429/404.

- Importovateľný súbor: [`ops/n8n/wdfox-whatsapp-sandbox-dry-run.json`](../ops/n8n/wdfox-whatsapp-sandbox-dry-run.json)
- Technická kapitola: [`src/pages/system-design/whatsapp-n8n-ai-agent-multichannel-terminal.astro`](../src/pages/system-design/whatsapp-n8n-ai-agent-multichannel-terminal.astro)
- **Vetva:** `preview`; bez produkčných poverení alebo živého odosielania.

## Čo už máme

| Uzol n8n | Úloha |
|---|---|
| 1 – Manual test | Spustenie iba po kliknutí na Execute Workflow |
| 2 – Mock WhatsApp events | 4 fiktívne správy vo formáte podobnom Meta webhooku |
| 3 – Normalize inbound text | Výber ID a obsahu textovej správy, odmietnutie prázdnych/nepodporovaných správ |
| 4 – Deduplicate demo IDs | Detekcia duplicitného ID **v rámci jedného spustenia** |
| 5 – Draft only / no send | Orientačné rozpoznanie SK/DE/EN, kategória dopytu a návrh odpovede pre schválenie |

Každý výsledok explicitne uvádza `outbound_enabled: false`, `crm_write_enabled: false` (okrem ignorovanej duplicity, ktorá má tieto polia tiež vypnuté) a žiadny uzol neposiela požiadavky na externé systémy. Jazykové rozpoznávanie je len **testovacia heuristika**; produkčné riešenie musí zvládnuť viac jazykov a nejednoznačné vety.

## Ako vyskúšať workflow v n8n na počítači

1. Otvoriť pripojenú n8n inštanciu po obnovení jej dostupnosti; nezakladať zbytočne ďalší server.
2. V GitHube stiahnuť súbor `ops/n8n/wdfox-whatsapp-sandbox-dry-run.json` z vetvy `preview`.
3. V n8n vytvoriť workflow a použiť **Import from File** (poloha voľby závisí od verzie n8n).
4. Skontrolovať päť uzlov. Nikam nezadávať Meta token ani telefónne číslo.
5. Kliknúť **Execute Workflow** a pozrieť výstup posledného uzla.
6. Očakávať **štyri položky**: tri so stavom `needs_human_approval` a jazykom `sk`, `de`, `en`, plus jednu `ignored_duplicate`. Žiadna nemá odoslať správu.
7. Workflow ponechať neaktívny, dokiaľ neschválime ďalšiu fázu.

## Bezpečný prechod na skutočný WhatsApp

1. Overiť vlastníctvo Meta Business účtu, WABA a čísla WhatsApp Business.
2. Pripraviť oddelené testovacie poverenia, Phone Number ID a požadované Meta oprávnenia.
3. Nastaviť overený HTTPS webhook / n8n WhatsApp Trigger; pri vlastnom prijímači overovať podpis doručenej udalosti.
4. Namiesto mock uzla prijímať iba autorizované udalosti; filtrovať typy, limity a veľkosť správ, oddeliť tenantov.
5. Zaviesť **trvalú idempotenciu** do PostgreSQL alebo iného vhodného úložiska. Demonštračný `Set` funguje len v jednej exekúcii a nezabráni opakovaniu po novom webhooku.
6. Rozhodnúť, aké osobné údaje sa smú zapisovať a posielať AI modelu. V produkcii nelogovať úplný text správy bez primeraných pravidiel uchovávania.
7. Spojiť so schvaľovaním človekom a s CRM až po testoch bezpečnosti.
8. Povoliť odosielanie cez oficiálny WhatsApp Business Cloud uzol/API **až po** overení 24-hodinového servisného okna, oprávnených šablón a súhlasu príjemcu.
9. Overiť ceny Meta správ, hosting n8n, náklady na AI model, GDPR a proces odstránenia údajov.

**Nie je to hotová integrácia Meta účtu:** samotné uloženie workflow JSON do GitHubu neimportuje workflow do n8n, nepridáva tokeny ani nepublikuje produkčnú službu.

## Reprodukcia nášho testu

Pri overení sme spustili JavaScript zo štyroch `Code` uzlov postupne nad vzorovými vstupmi mimo n8n. Výsledok: 4 položky; 3 návrhy odpovedí (SK/DE/EN), 1 duplikát; všetky so zakázaným odosielaním. Tým sa testuje logika, **nie kompatibilita so živou verziou n8n ani produkčná integrácia**.
