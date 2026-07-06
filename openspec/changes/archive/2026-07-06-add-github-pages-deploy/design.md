# Design: add-github-pages-deploy

## Context

The app is a pure static site (per `setup-app-scaffold`'s decisions) with working `dev`/`build`/`test`/`lint` scripts. This change wires up automated CI and deployment.

## Goals / Non-Goals

**Goals:**
- Every push and PR is linted, tested, and built in CI
- Every push to `main` deploys automatically to GitHub Pages
- No deploy branch, no personal access token, deployment visible in the repo's environment UI

**Non-Goals:**
- Any feature/application logic - this change is CI/deploy only
- Preview deployments for PRs (out of scope for this change)

## Decisions

- **Official GitHub Pages actions** (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`), explicitly rejecting the `gh-pages` branch approach: no deploy branch to manage, no personal token needed, and the deployment shows up in the repo's environments UI.
- **Vite `base: '/fretboard-master/'` set unconditionally** in `vite.config.ts`, not env-conditional. The dev server tolerates an absolute base path, so there's no need to branch behavior between dev and CI.
- **Single workflow file, two jobs**:
  - `build`: checkout, `actions/setup-node` with npm cache, `npm ci`, `npm run lint`, `npm test`, `npm run build`, `actions/upload-pages-artifact` - runs on both `push` and `pull_request` so PRs get the same quality gate.
  - `deploy`: `needs: build`, gated with `if:` push to `main` only - runs `actions/deploy-pages`.
- **Node version pinned to 22** in the workflow for CI reproducibility.
- **`concurrency` group** on the workflow so that rapid successive pushes cancel superseded in-flight deploys rather than racing.
- **Permissions**: the workflow requests `pages` and `id-token` permissions, required by the official Pages deploy action.
- **Manual one-time step required**: GitHub Pages must be enabled in repo settings with source "GitHub Actions" before the workflow can succeed. This cannot be automated from within the repository and must be done once by a repo admin.

## Directory layout

```
.github/workflows/deploy.yml
```

## Risks / Trade-offs

- [Workflow fails until Pages is manually enabled] → the failure mode is a clear, actionable error in the Actions log, not a silent no-op
- [PR builds don't get a preview deploy] → acceptable for this project's scope; the `build` job still gates PRs on lint/test/build success
