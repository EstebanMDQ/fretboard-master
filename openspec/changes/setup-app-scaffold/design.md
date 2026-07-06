# Design: setup-app-scaffold

## Context

Empty repository (only `openspec/` and `.claude/`). We are building a purely client-side study tool for fretted instruments, deployed as a static site to GitHub Pages. This change lays the technical foundation.

## Goals / Non-Goals

**Goals:**
- A buildable, testable, lintable Vite + React + TypeScript project
- An app shell layout that later changes can slot tools into
- Directory conventions that separate music-theory logic from UI

**Non-Goals:**
- Fretboard rendering, scales, arpeggios (own changes)
- CI/deployment (own change: `add-github-pages-deploy`)
- Styling polish; only a minimal usable layout

## Decisions

- **Vite + React + TypeScript strict**: Vite gives a fast dev loop and a static build that GitHub Pages can serve. React is the most familiar option and fits an interactive control-panel UI. Alternatives considered: Svelte (less familiarity), plain TS + canvas (more work for UI controls).
- **SVG for the fretboard (decided now, used later)**: SVG scales cleanly, is easy to make responsive, and note markers map naturally to SVG elements with React. Alternative: canvas - faster for thousands of elements but harder to hit-test and style; a fretboard has at most a few hundred elements.
- **State via React context + `useReducer`, no external state library**: the app state (tuning, selected scale/chord, display mode) is small. Alternatives: Zustand/Redux - unnecessary at this size; can be revisited if state grows.
- **`src/theory/` is pure TypeScript with no React imports**: note math, scales, and chords must be unit-testable without DOM. This is the main testing surface (Vitest).
- **ESLint flat config with typescript-eslint**: current default for new projects.

## Directory layout

```
src/
  components/   # React components (AppShell, later Fretboard, panels)
  theory/       # pure music-theory logic (notes, intervals, scales, chords)
  state/        # app state context + reducer
  App.tsx
  main.tsx
```

## Risks / Trade-offs

- [Vite default template drifts over time] → pin versions in package.json; the scaffold task lists explicit packages rather than "whatever create-vite installs"
- [No state library may get cramped if tools multiply] → theory logic stays pure, so swapping state management later touches only `src/state/` and component wiring
