# Sanity env konfigurácia

Astro build-time nastavenie:

```text
PUBLIC_SANITY_PROJECT_ID=
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-01-01
```

Sanity Studio nastavenie:

```text
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
```

Tieto hodnoty sa nastavujú v projektovom secrets/environment rozhraní. Do repozitára sa nepridáva zapisovací Sanity token ani `.env` súbor.
