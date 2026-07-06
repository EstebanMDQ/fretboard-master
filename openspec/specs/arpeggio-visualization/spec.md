# arpeggio-visualization Specification

## Purpose
TBD - created by archiving change add-arpeggio-visualization. Update Purpose after archive.
## Requirements
### Requirement: Highlight a chord's tones via symbol entry
The system SHALL let the user type a chord symbol in `ArpeggioPanel` and highlight all matching chord tones on the fretboard.

#### Scenario: Chord symbol highlights tones
- **WHEN** the user enters a valid chord symbol
- **THEN** the fretboard highlights every position matching the chord's pitch classes, using the shared display mode for labels

### Requirement: Note-by-note fallback builder
The system SHALL let the user build a chord by picking individual notes from the 17 standard spellings when symbol entry fails or is not used, with the first picked note treated as the root.

#### Scenario: Build chord note by note
- **WHEN** the user picks notes one at a time in the fallback builder
- **THEN** the fretboard highlighting updates after each pick, treating the first pick as the root

### Requirement: Chord quality catalog
The system SHALL support at least the following chord qualities: maj, min, dim, aug, sus2, sus4, 7, maj7, m7, m7b5, dim7, 6, m6, 9, maj9, m9, add9, 11, 13, and power chord.

#### Scenario: Extended chord degree labels stay honest
- **WHEN** displaying degree labels for a 9th, 11th, or 13th chord
- **THEN** the extended tone is labeled "9", "11", or "13" respectively, not folded down to "2", "4", or "6"

### Requirement: Two-tab tool navigation with independent state
The app shell SHALL provide Scales and Arpeggios tabs; each tool's selections SHALL persist independently across tab switches.

#### Scenario: Switch tabs and back
- **WHEN** the user configures a scale, switches to Arpeggios, configures a chord, and switches back to Scales
- **THEN** the original scale selection is still shown, and switching to Arpeggios again still shows the chord that was configured

