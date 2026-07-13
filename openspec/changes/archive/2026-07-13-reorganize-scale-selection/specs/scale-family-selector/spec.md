## ADDED Requirements

### Requirement: Scale family data structure
The system SHALL define scales as a list of families, each with a name and an ordered list of modes. Each mode has a name, an intervals array, and a degreeLabels array. The first mode of each family is the default.

#### Scenario: Family structure is complete
- **WHEN** the app loads
- **THEN** `SCALE_FAMILIES` contains at least 8 families: Major, Harmonic Minor, Melodic Minor, Pentatonic, Diminished, Augmented, Symmetrical, and Other

#### Scenario: Major family has 7 modes
- **WHEN** the Major family is accessed
- **THEN** its modes are Ionian (intervals 0,2,4,5,7,9,11), Dorian, Phrygian, Lydian, Mixolydian, Natural Minor (Aeolian), and Locrian in that order

#### Scenario: Harmonic Minor family has 7 modes
- **WHEN** the Harmonic Minor family is accessed
- **THEN** its modes include Harmonic Minor (intervals 0,2,3,5,7,8,11) as mode 0, and 6 additional modes derived from the same parent scale

#### Scenario: Melodic Minor family has 7 modes
- **WHEN** the Melodic Minor family is accessed
- **THEN** its modes include Melodic Minor (intervals 0,2,3,5,7,9,11) as mode 0, and 6 additional modes including Lydian Augmented and Altered (Super Locrian)

#### Scenario: Augmented family has 2 modes
- **WHEN** the Augmented family is accessed
- **THEN** its modes are Augmented (intervals 0,3,4,7,8,11) and Inverted Augmented (intervals 0,1,4,5,8,9)

### Requirement: Family and mode selection state
The system SHALL track the active scale selection as a family index and a mode index within that family, both defaulting to 0.

#### Scenario: Initial state
- **WHEN** the app first loads
- **THEN** familyIndex is 0 and modeIndex is 0, resolving to Major/Ionian

#### Scenario: Family change resets mode
- **WHEN** the user selects a different family
- **THEN** modeIndex resets to 0 and the fretboard highlights the first mode of the new family

#### Scenario: Mode change within family
- **WHEN** the user selects a different mode within the current family
- **THEN** familyIndex is unchanged and the fretboard highlights the selected mode

### Requirement: Two linked dropdowns in ScalePanel
The system SHALL display a Family dropdown and a Mode dropdown. The Mode dropdown options SHALL update to reflect the modes of the currently selected family.

#### Scenario: Family dropdown lists all families
- **WHEN** the scale panel is visible
- **THEN** the Family dropdown contains one option per entry in SCALE_FAMILIES, labeled by family name

#### Scenario: Mode dropdown reflects selected family
- **WHEN** the user selects a family
- **THEN** the Mode dropdown updates immediately to list only the modes of that family

#### Scenario: Single-mode families
- **WHEN** the selected family has only one mode (e.g. Other/Miyako Bushi)
- **THEN** the Mode dropdown is still rendered with that single option visible
