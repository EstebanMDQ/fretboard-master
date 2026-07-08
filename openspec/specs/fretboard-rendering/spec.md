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
The `Fretboard` component SHALL have no knowledge of scales or chords; it renders exactly the `Marker[]` it is given, where each `Marker` has `string`, `fret`, `label`, and `emphasis`, plus optional `degree`, `pulsing`, and `extension` fields. It SHALL also accept an optional `mutedStrings` list of string indices to mark as not played.

#### Scenario: Markers control all highlighting
- **WHEN** a caller passes a set of markers
- **THEN** only the fretted positions named in those markers are highlighted, using the given label and emphasis

#### Scenario: Extension markers render distinctly
- **WHEN** a marker has `extension` set
- **THEN** it is rendered in a distinct (subdued) style from core markers

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

### Requirement: Muted-string indicators
The `Fretboard` component SHALL render a muted indicator (an "x" to the left of the nut) for each string listed in its `mutedStrings` input, so a projected chord voicing shows which strings are not played. Open strings that are part of a voicing SHALL be expressible as a marker at fret 0, rendered at the nut with its degree label.

#### Scenario: Muted strings are marked
- **WHEN** a voicing is projected with some strings muted
- **THEN** those strings show an "x" indicator at the nut and carry no marker

#### Scenario: Open string shows its degree
- **WHEN** a voicing includes an open string as a chord tone
- **THEN** that string carries a marker at fret 0 labeled with its scale degree

