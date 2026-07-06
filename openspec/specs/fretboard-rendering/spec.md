# fretboard-rendering Specification

## Purpose
TBD - created by archiving change add-fretboard-rendering. Update Purpose after archive.
## Requirements
### Requirement: Fretboard renders any instrument configuration
The system SHALL provide a `Fretboard` component, `<Fretboard config={instrument} markers={Marker[]} />`, that renders a horizontal fretboard (nut on the left) for any valid instrument configuration, with strings drawn in physical config order rather than sorted by pitch.

#### Scenario: Reentrant tuning renders correctly
- **WHEN** the instrument config is a reentrant tuning (e.g. ukulele with high-G)
- **THEN** strings are drawn in their configured physical order, not resorted by pitch

#### Scenario: Fret spacing follows equal temperament
- **WHEN** the fretboard renders frets 0 through the configured fret count
- **THEN** fret positions follow the equal-temperament formula `position ∝ 1 - 2^(-fret/12)`

### Requirement: Fretboard is a pure rendering surface
The `Fretboard` component SHALL have no knowledge of scales or chords; it renders exactly the `Marker[]` it is given, where `Marker = { string, fret, label, emphasis }`.

#### Scenario: Markers control all highlighting
- **WHEN** a caller passes a set of markers
- **THEN** only the fretted positions named in those markers are highlighted, using the given label and emphasis

### Requirement: Shared position lookup helper
The system SHALL provide `positionsForPitchClasses(config, pitchClasses)` in the theory layer, returning every fretboard position matching the given pitch classes for the given instrument config.

#### Scenario: Reused by higher-level tools
- **WHEN** a future feature (scale or arpeggio visualization) needs to highlight a set of pitch classes
- **THEN** it can call `positionsForPitchClasses` rather than reimplementing fretboard position math

### Requirement: Fretboard is responsive
The `Fretboard` component SHALL scale to fit its container across common viewport sizes.

#### Scenario: Resize
- **WHEN** the browser window is resized
- **THEN** the fretboard scales without breaking layout or losing marker alignment

