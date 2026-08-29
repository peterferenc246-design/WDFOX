# WebDizainFOX – vizuálna špecifikácia

## Referenčný vizuál ako ground truth

Tento projekt reprodukuje dodaný vizuál: čistá biela prezentačná stránka pre WebDizainFOX s výrazným oranžovým akcentom, tmavým textom, priateľským líščím maskotom, veľkým hero blokom a kartami služieb. Referencia určuje hierarchiu, náladu, hustotu obsahu, farebnosť a použitie líšky ako hlavného brandového prvku.

## Zvolený smer: Friendly Conversion Studio

### Design Movement
Súčasný friendly-corporate webdesign s prvkami editorial minimalizmu, mäkkých kariet a ilustratívneho maskota.

### Core Principles
- **Jasná konverzia:** každá sekcia vedie k ďalšiemu kroku, bez vizuálneho šumu.
- **Teplá odbornosť:** technické služby komunikujú kompetentne, ale nie chladne.
- **Biela plocha s rytmom:** veľa vzduchu, jemné tiene, oranžové mikroakcenty.
- **Maskot ako sprievodca:** líška dodáva značke charakter a pomáha viesť pozornosť.

### Color Philosophy
Biela a veľmi svetlá teplá sivá vytvárajú dôveryhodné plátno pre portfólio služieb. Oranžová symbolizuje energiu, rast a akciu; čiernomodrý text drží kontrast a serióznosť. Fialová z maskotovej čiapky je sekundárny brandový detail, ktorý odlišuje značku bez toho, aby prebil oranžovú CTA hierarchiu.

### Layout Paradigm
Asymetrický hero s textom vľavo a veľkou ilustráciou vpravo, následne horizontálny pás benefitov a šesťkartová službová polica. Ďalšie sekcie používajú široké „canvas“ panely so zakrivenými hranami, nie uniformné centrálne bloky.

### Signature Elements
- oranžová krátka deliaca čiara nad headline-mi;
- bodkovaný / konfety ornament v okrajoch sekcií;
- líščí maskot s výraznou siluetou a mäkkým tieňom.

### Interaction Philosophy
Interakcie sú rýchle a povzbudivé: CTA tlačidlá sa mierne zdvihnú, karty služieb získajú oranžový horný akcent a navigácia jasne ukazuje aktívnu sekciu. Mobilná navigácia sa otvorí ako jednoduchý panel s veľkými dotykovými cieľmi.

### Animation
Hero text a maskot sa objavia jemným posunom nahor s oneskorením. Ornamenty majú iba takmer nepostrehnuteľný drift, aby stránka nepôsobila staticky. Hover transformácie ostávajú do 250 ms a rešpektujú `prefers-reduced-motion`.

### Typography System
Display a UI titulky používajú **Plus Jakarta Sans** v 700–800, aby boli zaoblené a sebavedomé; bežný text používa **DM Sans** v 400–600 pre príjemnú čitateľnosť. Headline má krátke riadky, oranžová farba zvýrazňuje iba kľúčové slová.

### Brand Essence
Moderné weby a digitálna podpora pre malé firmy, ktoré chcú pôsobiť profesionálne a rásť online bez technického chaosu. **Priateľská, praktická, odvážna.**

### Brand Voice
Headline-y sú priame a výsledkovo orientované. CTA sú konkrétne, aktívne a bez korporátneho balastu.

> „Moderné webstránky, ktoré pomáhajú firmám rásť.“
>
> „Poďme z vášho nápadu spraviť web, ktorý pracuje za vás.“

### Wordmark & Logo
Logo tvorí kompaktná líščia hlava s oranžovou maskou, tmavými kontúrami a malým fialovým detailom. Wordmark je vlastná typografická kompozícia: „WebDizain“ v tmavom tóne a „FOX“ v oranžovej, s mierne zvýrazneným rezom.

### Signature Brand Color
**FOX Orange – #F36A0A**, oranžová farba akcie, rastu a rozpoznateľnosti.

## Implementačné mantinely

- Zachovať svetlý vizuál, tmavé texty a oranžové CTA podľa referencie.
- Nepoužívať generický fialový gradient, tmavý neon ani nadbytočné zaoblené kontajnery.
- Použiť dodaný vizuál ako referenciu pre kompozíciu a samostatný líščí asset v hero sekcii.
- Všetky interaktívne prvky musia mať klávesový focus a byť použiteľné na mobile.
