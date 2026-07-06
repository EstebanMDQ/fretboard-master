# Spec: app-shell

## MODIFIED Requirements

### Requirement: Base layout with tool area and control panel
The app shell SHALL render a header with the application name, a shared global controls region (for state that spans tools, such as `displayMode`), a control panel region for the active tool, and a main visualization region where study tools are mounted.

#### Scenario: Shell renders with global controls
- **WHEN** the app loads
- **THEN** the header, global controls region, tool control panel region, and main visualization region are all visible
