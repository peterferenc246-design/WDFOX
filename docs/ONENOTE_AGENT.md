# WDFOX OneNote Documentation Agent — prototype

Status: **prototype, NOT activated**. Work branch: `feature/onenote-documentation-agent`.
Main source `tools/onenote_agent.py` analyzes a GitHub push diff and adds a OneNote page.
It does not alter application source or deploy anything.

## OneNote
Notebook: WDFOX – Technická dokumentácia
GitHub changes section ID:
`1-4a0123b6-7a54-4bcf-b2ed-3ea9042cbd3f`

## Authentication needed before activation
Microsoft Graph OneNote requires **delegated** user auth (not app-only).
Create an Entra app with public client/device-code delegated permission `Notes.Create` and grant consent.
Securely acquire and serialize an MSAL cache for the signed-in user; save base64 of that cache as repository Actions secret `MSAL_CACHE_B64`. Also save `MS_CLIENT_ID`, `MS_TENANT_ID`, `ONENOTE_CHANGE_SECTION_ID`.
Never commit tokens, cache, .env, passwords, or application secrets to Git.
This prototype does not implement login/bootstrap. A refresh failure stops without modifying the notebook.

## Before enabling
1. Implement token-cache renewal suitable for unattended runs (GitHub secrets do not auto-update when MSAL rotates credentials). Consider a secured n8n/long-running orchestrator with encrypted persistent token storage.
2. Add idempotency, concurrency control, and robust pagination for large diffs.
3. Track deployed Vercel preview/production SHA and compare to GitHub separately.
4. Test manually with fixture events and a non-production Microsoft identity.
5. Only afterwards enable GitHub push/webhook triggers on approved branches.

Workflow is intentionally manual-only and not yet wired to deployment events.
