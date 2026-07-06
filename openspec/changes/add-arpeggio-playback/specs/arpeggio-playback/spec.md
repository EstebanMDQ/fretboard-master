# Spec: arpeggio-playback

## ADDED Requirements

### Requirement: Play the current chord's tones at the shared tempo
The system SHALL provide a play control on `ArpeggioPanel` that plays the current chord's tones in sequence, one note per beat, at `tempoBpm`, reusing the note voice and scheduler from scale playback.

#### Scenario: Play a triad
- **WHEN** the user presses play with a valid triad selected
- **THEN** its tones sound in order, one per beat, at the current `tempoBpm`

### Requirement: Simple chords are capped at one octave
For chords whose largest interval is less than 12 semitones, the system SHALL append the octave root to cap the played sequence.

#### Scenario: Triad caps at the octave
- **WHEN** the user plays a C major triad
- **THEN** the sequence is C E G C (root repeated an octave up)

### Requirement: Extended chords play true intervals without folding
For chords whose true intervals exceed an octave (9th, 11th, 13th chords), the system SHALL play the true, unfolded intervals rather than capping at one octave.

#### Scenario: Ninth chord plays its true 9th
- **WHEN** the user plays a C9 chord
- **THEN** the sequence is C3, E3, G3, Bb3, D4 - the 9th sounds a ninth above the root, not folded down to a 2nd

### Requirement: Play is disabled without a valid chord
The system SHALL disable the play control unless a valid chord exists: either successfully parsed, or a root plus at least one additional interval selected in the note-by-note builder.

#### Scenario: Play disabled on empty state
- **WHEN** no chord symbol has been parsed and the note-by-note builder has no root selected
- **THEN** the play control is disabled and pressing it (if attempted) is a no-op

### Requirement: Fretboard sync and interruption rules are shared with scale playback
The system SHALL reuse degree-based fretboard pulsing and the same interruption rules (stop on chord/root/tuning/tool change; restart-from-top on re-press; concurrent metronome playback) from scale playback.

#### Scenario: Changing chord stops playback
- **WHEN** arpeggio playback is active and the user changes the chord symbol or note-by-note selection
- **THEN** playback stops immediately, matching scale playback's interruption behavior
