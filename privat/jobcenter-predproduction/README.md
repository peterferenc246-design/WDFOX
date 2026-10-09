# Jobcenter predproduction

Táto zložka je zdrojom predprodukčných úprav stránky Jobcenter.

- Produkcia: `/jobcenter/`
- Náhľad: `/privat/jobcenter-predproduction/`
- Predprodukčný patch: `preview-patch.js`

Workflow:
1. Nová úprava sa najprv zapíše iba do `preview-patch.js`.
2. Náhľad sa skontroluje v browseri.
3. Až po výslovnom odsúhlasení sa schválená zmena prenesie do produkčného `public/jobcenter-poster-fix.js`.
4. Staršie produkčné položky sa pri tomto postupe nemenia.
