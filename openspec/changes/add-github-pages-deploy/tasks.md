# Tasks: add-github-pages-deploy

## 1. Build configuration

- [ ] 1.1 Set `base: '/fretboard-master/'` unconditionally in `vite.config.ts`
- [ ] 1.2 Verify `npm run build` and `npm run dev` both still work with the new base path

## 2. Workflow

- [ ] 2.1 Add `.github/workflows/deploy.yml` with a `build` job (Node 22, npm cache, `npm ci`, lint, test, build, `upload-pages-artifact`) running on push and pull_request
- [ ] 2.2 Add a `deploy` job (`needs: build`, `if:` push to main) using `configure-pages` and `deploy-pages`
- [ ] 2.3 Add `pages`/`id-token` permissions and a `concurrency` group to the workflow

## 3. Repo setup / verification

- [ ] 3.1 Enable GitHub Pages in repo settings with source "GitHub Actions" (manual, one-time)
- [ ] 3.2 Verify a push to `main` produces a successful deploy and the site loads at the Pages URL
