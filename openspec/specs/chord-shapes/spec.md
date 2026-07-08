# chord-shapes Specification

## Purpose
TBD - created by archiving change add-chords-caged. Update Purpose after archive.
## Requirements
### Requirement: Compute CAGED shapes for a triad on standard guitar tuning
The system SHALL compute the CAGED shapes (C, A, G, E, D) for a chord's underlying major, minor, diminished, or augmented triad. It SHALL enumerate every placement of each shape whose entire grip falls within the instrument's fret range (`0` to `fretCount`), including octave repeats, and SHALL order the resulting positions by ascending fret. Placements where any note would fall outside the fret range SHALL be excluded.

#### Scenario: Major chord yields multiple positions across the neck
- **WHEN** the user enters a major chord (e.g. "C") on standard 6-string guitar tuning with a full-length neck
- **THEN** the tool exposes the CAGED shape placements that fit on the neck, each a fingerable triad grip, ordered by ascending fret position

#### Scenario: Same chord shown in octave-repeated positions
- **WHEN** a shape for the entered chord fits at more than one octave within the fret range (e.g. the A-shape for A major at fret 0 and again at fret 12)
- **THEN** each fitting placement appears as its own selectable position

#### Scenario: Non-major triads derived by altering degrees
- **WHEN** the user enters a minor, diminished, or augmented chord
- **THEN** each shape is the corresponding major shape with the third lowered (minor), the third and fifth lowered (diminished), or the fifth raised (augmented), each by one semitone

#### Scenario: Placement excluded when it overflows the fret range
- **WHEN** a candidate placement would put any note below fret 0 or above the instrument's `fretCount`
- **THEN** that placement is excluded and the remaining placements are still selectable

### Requirement: Step through chord positions
The system SHALL let the user step between the available CAGED positions for the current chord, one at a time, and SHALL show only the selected shape's markers on the fretboard. Each position SHALL be labeled with its shape name and fret.

#### Scenario: Move to the next position
- **WHEN** the user advances to the next position
- **THEN** the fretboard shows only that shape's fretted notes, with the root emphasized, and the position label updates to the shape name and fret

#### Scenario: Changing the chord resets the position
- **WHEN** the user changes the chord symbol
- **THEN** the selected position resets to the first available shape, and the position index is clamped to the number of shapes that fit

### Requirement: Mark extra chord tones within a shape
The system SHALL, for chords richer than a triad (e.g. 7, maj7, m7, 9, 11, 13, 6), mark the extra chord tones that fall within the selected shape's fret window as optional extensions, visually distinct from the core triad tones, using root-relative degree labels.

#### Scenario: Seventh marked as an extension
- **WHEN** the user enters a seventh chord (e.g. "G7") and views a shape
- **THEN** the b7 tones that fall within the shape's fret window are marked as extensions, styled distinctly from the triad tones, and labeled "b7"

#### Scenario: Extended-tone labels stay honest
- **WHEN** displaying an extension for a 9th, 11th, or 13th chord
- **THEN** the tone is labeled "9", "11", or "13" respectively, not folded to "2", "4", or "6"

### Requirement: CAGED is gated to standard guitar tuning
The system SHALL enable CAGED chord shapes only when the active instrument is standard 6-string guitar tuning (open pitch classes E B G D A E). On any other tuning it SHALL render no shapes and SHALL show a message that CAGED requires standard guitar tuning.

#### Scenario: Non-guitar tuning shows a message
- **WHEN** the active instrument is a ukulele, bass, 7-string, or custom tuning
- **THEN** the Chords tool renders no shapes and displays a message stating CAGED positions require standard guitar tuning

#### Scenario: Standard guitar tuning enables shapes
- **WHEN** the active instrument's six open strings match the pitch classes E B G D A E
- **THEN** the Chords tool computes and displays CAGED shapes

### Requirement: Major, minor, diminished, and augmented triad chords are supported
The system SHALL support chords whose underlying triad is major, minor, diminished, or augmented. Diminished and augmented use basic shapes derived from the major templates. For chords with no third (sus2, sus4, power), it SHALL render no shapes and SHALL indicate that CAGED shapes cover major, minor, diminished, and augmented triads.

#### Scenario: Diminished and augmented chords are supported
- **WHEN** the user enters a chord built on a diminished or augmented triad (e.g. "Bdim", "Cm7b5", "Ddim7", "Faug")
- **THEN** the tool computes basic CAGED shapes for that triad and, for the four-note variants, marks the extra tones as extensions

#### Scenario: Thirdless chord is unsupported
- **WHEN** the user enters a chord with no third (e.g. "Dsus4", "Csus2", "A5")
- **THEN** the tool renders no shapes and shows that only major, minor, diminished, and augmented triads are supported

#### Scenario: Extended major/minor chords are supported
- **WHEN** the user enters an extended chord built on a major or minor triad (e.g. "Cmaj7", "Dm9", "G13")
- **THEN** the tool computes shapes for the underlying triad and marks the extra tones as extensions

