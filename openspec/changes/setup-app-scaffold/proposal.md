# Proposal: setup-app-scaffold

## Why

fretboard-master needs a working project skeleton before any feature can be built. This change creates the Vite + React + TypeScript scaffold, tooling, and app shell that every other change builds on.

## What Changes

- Initialize a Vite + React + TypeScript (strict mode) project at the repo root
- Add Vitest for unit testing and ESLint for linting
- Create the app shell: header with app title, a main content area where tools render, and a sidebar/panel area for controls
- Add basic project structure: `src/components/`, `src/theory/` (music logic), `src/state/`
- Add npm scripts: `dev`, `build`, `test`, `lint`
- No feature logic yet: the shell renders placeholder content

## Capabilities

### New Capabilities

- `app-shell`: The application loads as a static SPA and presents the base layout (header, control panel, main visualization area) into which study tools are mounted.

### Modified Capabilities

None (first change in the project).

## Impact

- New files across the whole repo: `package.json`, `vite.config.ts`, `tsconfig.json`, `src/**`
- New dev dependencies: react, react-dom, vite, typescript, vitest, eslint
- All subsequent changes (`add-fretboard-rendering`, `add-scale-visualization`, `add-arpeggio-visualization`, `add-github-pages-deploy`) depend on this scaffold
