# note-model Specification

## Purpose
TBD - created by archiving change add-fretboard-rendering. Update Purpose after archive.
## Requirements
### Requirement: Pitch is represented independently of spelling
The system SHALL represent a note's pitch as a pitch class (0-11) plus an octave number, separate from any letter/accidental spelling.

#### Scenario: Enharmonic pitches share pitch class
- **WHEN** two notes are enharmonically equivalent (e.g. D# and Eb)
- **THEN** they share the same pitch class and octave, but may have different spellings

### Requirement: Spellings support double accidentals
The system SHALL represent a note spelling as a letter (A-G) plus an accidental that may be double-sharp, sharp, natural, flat, or double-flat.

#### Scenario: Double accidental spelling
- **WHEN** a degree requires a double sharp or double flat to spell correctly (e.g. the 7th degree of a harmonic scale built on a sharp root)
- **THEN** the system produces a double-sharp or double-flat spelling rather than falling back to an enharmonic single accidental

### Requirement: Spelling is derived from root and degree, not a global preference
The system SHALL provide a `spellDegree(rootSpelling, degreeLabel)` function that derives a note's spelling from the root's spelling and the interval's degree label.

#### Scenario: Same pitch class spelled differently by context
- **WHEN** the same pitch class occurs as a different scale/chord degree depending on the selected root
- **THEN** `spellDegree` returns the spelling appropriate to that root and degree, without consulting any global sharp/flat setting

### Requirement: Root selection offers the 17 standard spellings
Any root or rootless-note picker in the UI SHALL offer exactly the 17 standard spellings (7 naturals, 5 sharps, 5 flats) as discrete choices.

#### Scenario: Root picker choices
- **WHEN** a user opens a root picker
- **THEN** they see the 17 standard spellings and cannot enter arbitrary free text

