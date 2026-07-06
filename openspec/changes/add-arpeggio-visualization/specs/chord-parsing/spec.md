# Spec: chord-parsing

## ADDED Requirements

### Requirement: Parse chord symbols into root and intervals
The system SHALL parse a chord symbol string into a root spelling and an interval set, matching the root (letter + accidental) then the longest known quality suffix.

#### Scenario: Common chord symbol
- **WHEN** the user types a supported chord symbol (e.g. "Cmaj7", "F#m7b5", "Bb9")
- **THEN** the parser returns the correct root and interval set, including true (unfolded) intervals for extended chords

#### Scenario: Suffix synonyms
- **WHEN** the user types a common synonym (e.g. "CM7" for "Cmaj7", "Cmin" or "C-" for "Cm")
- **THEN** the parser resolves it to the same chord as its canonical form

#### Scenario: Longest-match suffix resolution
- **WHEN** a chord symbol could match multiple suffixes of different lengths (e.g. "m7b5" vs "m7" vs "m")
- **THEN** the parser matches the longest valid suffix

### Requirement: Unparseable input never renders a guess
The system SHALL return a typed error result for chord symbols it cannot parse, and SHALL NOT render a guessed chord for such input.

#### Scenario: Unrecognized suffix
- **WHEN** the user types a chord symbol with an unrecognized suffix
- **THEN** the parser returns a typed error, and the UI falls back to the note-by-note builder pre-seeded with any root it did extract

### Requirement: Slash-chord bass notes are ignored for tone sets
The system SHALL tolerate a slash-chord bass note in the input without failing to parse, but SHALL NOT include the bass note in the resulting tone set unless it is already part of the chord.

#### Scenario: Slash chord parses
- **WHEN** the user types a slash chord (e.g. "C/G")
- **THEN** the parser succeeds using the chord before the slash, ignoring the bass note for tone-set purposes
