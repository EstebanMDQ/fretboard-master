## MODIFIED Requirements

### Requirement: Fretboard is a pure rendering surface
The `Fretboard` component SHALL have no knowledge of scales or chords; it renders exactly the `Marker[]` it is given, where each `Marker` has `string`, `fret`, `label`, and `emphasis`, plus optional `degree`, `pulsing`, and `extension` fields. It SHALL also accept an optional `mutedStrings` list of string indices to mark as not played.

#### Scenario: Markers control all highlighting
- **WHEN** a caller passes a set of markers
- **THEN** only the fretted positions named in those markers are highlighted, using the given label and emphasis

#### Scenario: Extension markers render distinctly
- **WHEN** a marker has `extension` set
- **THEN** it is rendered in a distinct (subdued) style from core markers

## ADDED Requirements

### Requirement: Muted-string indicators
The `Fretboard` component SHALL render a muted indicator (an "x" to the left of the nut) for each string listed in its `mutedStrings` input, so a projected chord voicing shows which strings are not played. Open strings that are part of a voicing SHALL be expressible as a marker at fret 0, rendered at the nut with its degree label.

#### Scenario: Muted strings are marked
- **WHEN** a voicing is projected with some strings muted
- **THEN** those strings show an "x" indicator at the nut and carry no marker

#### Scenario: Open string shows its degree
- **WHEN** a voicing includes an open string as a chord tone
- **THEN** that string carries a marker at fret 0 labeled with its scale degree
