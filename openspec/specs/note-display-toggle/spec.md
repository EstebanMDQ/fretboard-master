# note-display-toggle Specification

## Purpose
TBD - created by archiving change add-scale-visualization. Update Purpose after archive.
## Requirements
### Requirement: Shared display mode in app state
The system SHALL maintain a shared `displayMode` (`'names' | 'degrees'`) in app state, controlling whether fretboard markers show note names or scale/chord degree labels.

#### Scenario: Toggle display mode
- **WHEN** the user toggles the display mode control
- **THEN** all fretboard markers update their labels between note names and degree labels

#### Scenario: Shared across tools
- **WHEN** the user switches between study tools (e.g. scales and arpeggios)
- **THEN** the same `displayMode` value applies to whichever tool is active

