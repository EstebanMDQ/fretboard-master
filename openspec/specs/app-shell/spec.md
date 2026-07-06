# app-shell Specification

## Purpose
TBD - created by archiving change setup-app-scaffold. Update Purpose after archive.
## Requirements
### Requirement: Application loads as a static SPA
The application SHALL build to static assets (HTML, JS, CSS) and load in a modern browser without any server-side runtime.

#### Scenario: Production build
- **WHEN** `npm run build` is executed
- **THEN** a `dist/` directory is produced containing only static assets that can be served from any static host

#### Scenario: App boots
- **WHEN** the built site is opened in a browser
- **THEN** the application renders without console errors

### Requirement: Base layout with tool area and control panel
The app shell SHALL render a header with the application name, a shared global controls region including a collapsible `MetronomePanel`, a Scales | Arpeggios tool navigation, a control panel region for the active tool, and a main visualization region where the active tool is mounted.

#### Scenario: Shell renders with metronome control
- **WHEN** the app loads
- **THEN** the header, global controls region (including the collapsible metronome control), tool navigation, active tool's control panel, and main visualization region are all visible

#### Scenario: Metronome panel collapses and expands
- **WHEN** the user toggles the metronome panel's collapsed state
- **THEN** the panel expands to show tempo/meter/accent controls, or collapses to a compact control, without affecting the currently selected study tool

### Requirement: Quality tooling is runnable
The project SHALL provide working `dev`, `build`, `test`, and `lint` npm scripts.

#### Scenario: Test runner
- **WHEN** `npm test` is executed
- **THEN** Vitest runs and reports results (passing with at least one placeholder test)

#### Scenario: Linting
- **WHEN** `npm run lint` is executed
- **THEN** ESLint checks `src/` and exits with code 0 on a clean tree

