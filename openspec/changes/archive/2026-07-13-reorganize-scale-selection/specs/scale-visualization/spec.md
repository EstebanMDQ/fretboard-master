## MODIFIED Requirements

### Requirement: Select a root and scale
The system SHALL let the user pick a root (one of the 17 standard spellings), a scale family, and a mode within that family via `ScalePanel`.

#### Scenario: Preset scale selected
- **WHEN** the user picks a root, a scale family, and a mode
- **THEN** every fretboard position matching the mode's pitch classes for that root is highlighted

#### Scenario: Family and mode selected
- **WHEN** the user picks a root, a scale family, and a mode
- **THEN** every fretboard position matching the mode's pitch classes for that root is highlighted

#### Scenario: Family change resets to first mode
- **WHEN** the user changes the scale family
- **THEN** the mode resets to the first mode of the new family and the fretboard updates accordingly

### Requirement: Scale presets share a common shape
The system SHALL define every scale mode as `{ name, intervals, degreeLabels }`, where `intervals` are strictly increasing semitone offsets from the root, all less than 12.

#### Scenario: Preset catalog
- **WHEN** the user opens the family and mode pickers
- **THEN** they can choose from all modes of Major (7), Harmonic Minor (7), Melodic Minor (7), Pentatonic (3), Diminished (2), Augmented (2), Symmetrical (2), and Other (1) families

#### Scenario: Family/mode catalog
- **WHEN** the user opens the family and mode pickers
- **THEN** they can choose from all modes of Major (7), Harmonic Minor (7), Melodic Minor (7), Pentatonic (3), Diminished (2), Augmented (2), Symmetrical (2), and Other (1) families

#### Scenario: Diminished scales are octatonic and correctly spelled
- **WHEN** the user selects Diminished / Whole-Half
- **THEN** the scale highlights intervals 0, 2, 3, 5, 6, 8, 9, 11 labeled by scale degree
- **WHEN** the user selects Diminished / Half-Whole
- **THEN** the scale highlights intervals 0, 1, 3, 4, 6, 7, 9, 10 labeled by scale degree

