# FOX Agent – GitHub identity and operating policy

Status: TEST branch only

## Product principle

FOX Agent is designed from the beginning to be controllable from ChatGPT and from the WebDizainFOX website. ChatGPT is a primary control surface, not an afterthought.

The agent itself is a standalone OpenAI-powered service with its own backend, tools, approvals and audit trail. It must not depend on a single ChatGPT conversation or on a browser tab being open.

Target architecture:

`ChatGPT -> FOX Agent app/plugin -> FOX Agent backend -> OpenAI agent -> tools`

and in parallel:

`foxprof.club -> FOX Agent UI -> same FOX Agent backend -> same tools`

Both control surfaces must reach the same agent, client data, approval rules and audit log.

## Goal

Use the dedicated GitHub App identity `TEST-fox-agent` as the GitHub identity of the FOX AI Agent. The AI brain runs outside GitHub on the OpenAI-backed FOX Agent backend. GitHub is one controlled tool/workspace used for repository reads, branch changes, commits and pull requests.

GitHub is not the agent brain and is not the only capability of FOX Agent.

## ChatGPT integration requirement

FOX Agent must expose a secure API/tool layer that can be connected to ChatGPT as a custom app/plugin when the backend is ready.

Planned ChatGPT-capable tools include:
- `list_clients`
- `get_client`
- `prepare_notification`
- `prepare_translation`
- `create_web_notification`
- `prepare_email`
- `get_project_status`
- `read_repository_state`
- `propose_repository_change`
- `create_test_commit`
- `create_pull_request`
- `get_build_status`
- `get_audit_log`

High-impact tools such as sending a real client message, publishing a production change, merging to `main`, sending email/push or changing client data must require explicit human approval.

## Current GitHub App permissions

The installed app currently has repository access to all current and future repositories owned by `peterferenc246-design`.

Current visible permissions after installation:
- Metadata: Read-only
- Repository code / Contents: Read and write
- Pull requests: Read and write

Recommended additional read-only permissions when we enable CI inspection:
- Actions: Read-only
- Checks: Read-only

Do not grant administration, secrets, environments, deployments, members or repository deletion permissions at the initial stage.

Additional permissions may be added later only when a concrete tool requires them.

## Installation scope

Installed for:
- all current repositories owned by `peterferenc246-design`
- all future repositories owned by `peterferenc246-design`

Repository-specific operating policies still apply. Broad installation access does not mean unrestricted production writes.

## Branch policy

For WDFOX development, the agent may:
- read `main`
- write development changes only to `TEST` or another explicitly approved feature/test branch
- create commits on approved non-production branches
- create pull requests to `main`
- read build/test results after the corresponding read permissions are enabled

The agent must not:
- push directly to `main` unless Peter explicitly changes this policy later
- merge its own pull request
- modify repository secrets
- change branch protection or repository administration

For other repositories, use the same default policy: work on a non-production branch and require human approval before production merge/publish.

## Approval rule

Every production code change follows:

`ChatGPT or WDFOX -> OpenAI FOX Agent -> test/feature branch -> build/test -> Pull Request -> Peter approval -> production branch`

Every real client-facing or otherwise external side effect follows:

`ChatGPT or WDFOX -> OpenAI FOX Agent -> prepare plan -> show exact recipients/actions -> Peter approval -> execute -> audit log`

## Runtime secrets

Never commit credentials to any repository.

Store these only in the runtime environment (for example Vercel):
- `OPENAI_API_KEY`
- `FOX_GITHUB_APP_ID`
- `FOX_GITHUB_PRIVATE_KEY`
- `FOX_GITHUB_INSTALLATION_ID`
- future credentials for notification, email, database and other connected services

Known non-secret identifiers:
- `FOX_GITHUB_APP_ID=5038390`
- `FOX_GITHUB_INSTALLATION_ID=163889413`

## Agent identity versus control surface

`TEST-fox-agent` on GitHub is the bot identity used when FOX Agent works with GitHub.

ChatGPT is a control surface used by Peter to instruct the same FOX Agent conversationally.

The WDFOX website is another control surface for the same agent.

There must be one FOX Agent backend and one source of truth for permissions, tools, approvals and audit records.

## Commit and PR convention

Recommended commit prefix:
- `fox-agent: ...`

Recommended PR title prefix:
- `[FOX Agent] ...`

The GitHub App will appear as the author/bot identity when it creates commits or PRs using its installation token.
