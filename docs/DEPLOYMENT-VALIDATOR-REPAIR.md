# Deployment validator repair (draft)

This branch addresses four findings from the WDFOX Deployment Validator on commit `1b2163dc89ba90142dfc6d75c028c1235dc7a93b`.

1. **Live failure handling**: six failed retries now finish with `exit 1`.
2. **Astro build/Pages parity**: `pnpm run build` runs `.github/scripts/wdfox_package_tawk.py`, previously inlined in `deploy.yml`. The Pages workflow consumes this same packaged `dist` without a second injector. The Jobcenter predproduction wrapper remains excluded.
3. **SHA consistency**: the live validator checks exact `?v=${GITHUB_SHA}` references for loader and launcher on every localized route, and avatar if included.
4. **Coverage**: live verification checks `sk,de,en,hr,fr,it,pl,es,sv` and downloads loader and launcher; retains key behavior/static markers. It does not replace interactive browser tests.

## Local/offline testing

```bash
python -m unittest discover -s .github/scripts -p "test_wdfox_package_tawk.py" -v
pnpm install --frozen-lockfile
pnpm run build
```

The first test uses isolated fixtures and no network. A real Astro build requires the full repository and dependencies. Review the GitHub Actions workflow and complete a browser smoke test for all languages before merging.

## Operational caution

The live validator runs **after** GitHub Pages deploy: it can mark the workflow red but cannot roll the already published content back. The SHA-matched checks establish bundle/version presence, not correct Tawk chat UI, language or session behavior.
