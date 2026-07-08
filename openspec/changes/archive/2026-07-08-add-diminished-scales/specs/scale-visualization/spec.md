## MODIFIED Requirements

### Requirement: Scale presets share a common shape
The system SHALL define every scale preset as `{ name, intervals, degreeLabels }`, where `intervals` are strictly increasing semitone offsets from the root, all less than 12.

#### Scenario: Preset catalog
- **WHEN** the user opens the scale picker
- **THEN** they can choose from major (ionian), natural minor (aeolian), harmonic minor, melodic minor, dorian, phrygian, lydian, mixolydian, locrian, major pentatonic, minor pentatonic, blues, miyako bushi, whole tone, chromatic, diminished (whole-half), and diminished (half-whole)

#### Scenario: Diminished scales are octatonic and correctly spelled
- **WHEN** the user selects a diminished scale
- **THEN** the whole-half scale highlights intervals 0, 2, 3, 5, 6, 8, 9, 11 and the half-whole scale highlights intervals 0, 1, 3, 4, 6, 7, 9, 10, each labeled by scale degree
