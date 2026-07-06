# Spec: app-shell

## MODIFIED Requirements

### Requirement: Base layout with tool area and control panel
The app shell SHALL render a header with the application name, a shared global controls region, a Scales | Arpeggios tool navigation, a control panel region for the active tool, and a main visualization region where the active tool is mounted.

#### Scenario: Shell renders with tool navigation
- **WHEN** the app loads
- **THEN** the header, global controls region, Scales | Arpeggios tab navigation, active tool's control panel, and main visualization region are all visible
