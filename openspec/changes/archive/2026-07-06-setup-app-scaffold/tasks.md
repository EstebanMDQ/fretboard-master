# Tasks: setup-app-scaffold

## 1. Project initialization

- [x] 1.1 Initialize Vite + React + TypeScript project at repo root (package.json, vite.config.ts, tsconfig with strict mode, index.html, src/main.tsx)
- [x] 1.2 Add .gitignore for node_modules, dist, editor files
- [x] 1.3 Add ESLint flat config with typescript-eslint and react plugins; add `lint` script
- [x] 1.4 Add Vitest with a placeholder test in src/theory/; add `test` script

## 2. App shell

- [x] 2.1 Create directory structure: src/components/, src/theory/, src/state/
- [x] 2.2 Implement AppShell component: header with app title, control panel region, main visualization region with placeholder content
- [x] 2.3 Add minimal base styling (layout grid, dark-friendly colors) in a plain CSS file

## 3. Verification

- [x] 3.1 Verify `npm run dev` serves the shell and `npm run build` produces dist/ with no type errors
- [x] 3.2 Verify `npm test` and `npm run lint` pass
