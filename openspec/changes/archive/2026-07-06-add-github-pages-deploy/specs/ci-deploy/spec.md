# Spec: ci-deploy

## ADDED Requirements

### Requirement: Every push and PR runs lint, test, and build
The CI workflow SHALL run `npm run lint`, `npm test`, and `npm run build` on every push and every pull request.

#### Scenario: PR triggers quality gate
- **WHEN** a pull request is opened or updated
- **THEN** the `build` job runs lint, test, and build, and the PR shows the result

### Requirement: Pushes to main deploy to GitHub Pages
The CI workflow SHALL deploy the built `dist/` artifact to GitHub Pages whenever the `build` job succeeds on a push to `main`.

#### Scenario: Push to main deploys
- **WHEN** a commit is pushed to `main` and the `build` job succeeds
- **THEN** the `deploy` job runs and publishes the artifact to GitHub Pages via the official Pages actions

#### Scenario: Non-main pushes and PRs do not deploy
- **WHEN** a push happens on a branch other than `main`, or a pull request is opened
- **THEN** the `build` job runs but the `deploy` job is skipped

### Requirement: Concurrent deploys are cancelled in favor of the latest
The workflow SHALL use a `concurrency` group so that a new push to `main` cancels any in-flight deploy for a prior commit.

#### Scenario: Rapid pushes
- **WHEN** two commits are pushed to `main` in quick succession
- **THEN** only the deploy for the latest commit completes; the earlier one is cancelled

### Requirement: Vite base path matches the Pages URL
The production build SHALL use `base: '/fretboard-master/'` so built asset URLs resolve correctly when served from GitHub Pages.

#### Scenario: Built assets resolve under the Pages path
- **WHEN** the site is deployed to GitHub Pages
- **THEN** all asset URLs load correctly under the `/fretboard-master/` path
