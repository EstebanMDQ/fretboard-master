# Spec: app-shell

## MODIFIED Requirements

### Requirement: Base layout with tool area and control panel
The app shell SHALL render a header with the application name, a shared global controls region including a collapsible `MetronomePanel`, a Scales | Arpeggios tool navigation, a control panel region for the active tool, and a main visualization region where the active tool is mounted.

#### Scenario: Shell renders with metronome control
- **WHEN** the app loads
- **THEN** the header, global controls region (including the collapsible metronome control), tool navigation, active tool's control panel, and main visualization region are all visible

#### Scenario: Metronome panel collapses and expands
- **WHEN** the user toggles the metronome panel's collapsed state
- **THEN** the panel expands to show tempo/meter/accent controls, or collapses to a compact control, without affecting the currently selected study tool
