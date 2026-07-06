# Proposal: add-github-pages-deploy

## Why

Once the app exists, it needs a reliable, automated path to a public URL. This change adds a GitHub Actions workflow that lints, tests, and builds on every push/PR, and deploys `dist/` to GitHub Pages on push to `main`.

## What Changes

- Set `base: '/fretboard-master/'` unconditionally in `vite.config.ts` (not env-conditional; the dev server tolerates it)
- Add a single workflow file, `.github/workflows/deploy.yml`, with two jobs:
  - `build`: checkout, `actions/setup-node` with npm cache (Node 22), `npm ci`, `npm run lint`, `npm test`, `npm run build`, then `actions/upload-pages-artifact`; runs on push and pull_request
  - `deploy`: `needs: build`, runs only `if:` push to `main`; uses `actions/configure-pages` and `actions/deploy-pages`
- Add `pages`/`id-token` permissions and a `concurrency` group so rapid pushes cancel superseded deploys
- Use the official GitHub Pages actions (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`) rather than the `gh-pages` branch approach

## Capabilities

### New Capabilities

- `ci-deploy`: automated lint/test/build on every push/PR, automated deploy to GitHub Pages on push to `main`

### Modified Capabilities

None.

## Impact

- New file: `.github/workflows/deploy.yml`
- Modified file: `vite.config.ts` (unconditional `base` path)
- Depends on: `setup-app-scaffold` (`build`/`test`/`lint` npm scripts)
- Independent of all other feature changes - can run any time after the scaffold exists, though it naturally comes last since it deploys the finished app
- Requires a manual, one-time step: enabling GitHub Pages in repo settings with source "GitHub Actions" - the workflow fails with a clear error until this is done manually; this step cannot be automated from within the repo
