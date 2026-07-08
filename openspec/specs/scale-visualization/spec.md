# scale-visualization Specification

## Purpose
TBD - created by archiving change add-scale-visualization. Update Purpose after archive.
## Requirements
### Requirement: Select a root and scale
The system SHALL let the user pick a root (one of the 17 standard spellings) and a scale (a preset or a custom scale) via `ScalePanel`.

#### Scenario: Preset scale selected
- **WHEN** the user picks a root and a preset scale
- **THEN** every fretboard position matching the scale's pitch classes for that root is highlighted

### Requirement: Scale presets share a common shape
The system SHALL define every scale preset as `{ name, intervals, degreeLabels }`, where `intervals` are strictly increasing semitone offsets from the root, all less than 12.

#### Scenario: Preset catalog
- **WHEN** the user opens the scale picker
- **THEN** they can choose from major (ionian), natural minor (aeolian), harmonic minor, melodic minor, dorian, phrygian, lydian, mixolydian, locrian, major pentatonic, minor pentatonic, blues, miyako bushi, whole tone, chromatic, diminished (whole-half), and diminished (half-whole)

#### Scenario: Diminished scales are octatonic and correctly spelled
- **WHEN** the user selects a diminished scale
- **THEN** the whole-half scale highlights intervals 0, 2, 3, 5, 6, 8, 9, 11 and the half-whole scale highlights intervals 0, 1, 3, 4, 6, 7, 9, 10, each labeled by scale degree

### Requirement: Custom scale editor
The system SHALL let the user build a custom scale via a 12-toggle chromatic row, with the root always locked on.

#### Scenario: Toggle custom scale tones
- **WHEN** the user toggles chromatic degrees on or off in the custom scale editor
- **THEN** the fretboard highlighting updates to match the toggled pitch classes, and the root remains selected

### Requirement: Shared marker builder
The system SHALL provide `buildMarkers(config, root, intervals, displayMode)` as the single function used to turn a root and interval set into fretboard markers.

#### Scenario: Reused by future tools
- **WHEN** another study tool needs to highlight a root + interval set on the fretboard
- **THEN** it calls `buildMarkers` rather than duplicating marker-building logic

