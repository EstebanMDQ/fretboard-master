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
The app shell SHALL render a header with the application name, a shared global controls region (for state that spans tools, such as `displayMode`), a control panel region for the active tool, and a main visualization region where study tools are mounted.

#### Scenario: Shell renders with global controls
- **WHEN** the app loads
- **THEN** the header, global controls region, tool control panel region, and main visualization region are all visible

### Requirement: Quality tooling is runnable
The project SHALL provide working `dev`, `build`, `test`, and `lint` npm scripts.

#### Scenario: Test runner
- **WHEN** `npm test` is executed
- **THEN** Vitest runs and reports results (passing with at least one placeholder test)

#### Scenario: Linting
- **WHEN** `npm run lint` is executed
- **THEN** ESLint checks `src/` and exits with code 0 on a clean tree

