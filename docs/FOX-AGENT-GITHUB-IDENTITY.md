# FOX Agent – GitHub identity and operating policy

Status: TEST branch only

## Goal

Create a dedicated GitHub App identity named `fox-agent` for the FOX AI Agent. The AI brain runs outside GitHub (OpenAI backend). GitHub is the agent's controlled workspace for repository reads, TEST-branch changes, commits and pull requests.

## Required GitHub App permissions

Repository permissions:
- Metadata: Read-only
- Contents: Read and write
- Pull requests: Read and write
- Actions: Read-only
- Checks: Read-only

Do not grant administration, secrets, environments, deployments, members or repository deletion permissions.

## Installation scope

Install only on repository:
- `peterferenc246-design/WDFOX`

## Branch policy

The agent may:
- read `main`
- write only to `TEST`
- create commits on `TEST`
- create pull requests from `TEST` to `main`
- read build/test results

The agent must not:
- push directly to `main`
- merge its own pull request
- modify repository secrets
- change branch protection or repository administration

## Approval rule

Every production change follows:

`OpenAI FOX Agent -> TEST -> build/test -> Pull Request -> Peter approval -> main`

Any real client notification or other external side effect must also stop for explicit human confirmation before execution.

## Runtime secrets

Never commit credentials to this repository.

Store these only in the runtime environment (for example Vercel):
- `OPENAI_API_KEY`
- `FOX_GITHUB_APP_ID`
- `FOX_GITHUB_PRIVATE_KEY`
- `FOX_GITHUB_INSTALLATION_ID`

## Commit and PR convention

Recommended commit prefix:
- `fox-agent: ...`

Recommended PR title prefix:
- `[FOX Agent] ...`

The GitHub App will appear as the author/bot identity when it creates commits or PRs using its installation token.
