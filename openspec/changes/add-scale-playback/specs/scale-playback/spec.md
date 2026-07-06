# Spec: scale-playback

## ADDED Requirements

### Requirement: Play the selected scale at the shared tempo
The system SHALL provide a play control on `ScalePanel` that plays the selected scale, one octave, one note per beat, at `tempoBpm`.

#### Scenario: Play ascending scale
- **WHEN** the user presses play with a scale and root selected
- **THEN** each scale degree sounds in order, one per beat, at the current `tempoBpm`

### Requirement: Direction options
The system SHALL let the user choose ascending, descending, or ascending-then-descending playback direction.

#### Scenario: Descending playback
- **WHEN** the user selects descending direction and presses play
- **THEN** the scale plays from the top degree down to the root

### Requirement: Fretboard sync by degree
While scale playback is active, the system SHALL pulse every fretboard marker sharing the currently-sounding degree, without selecting a single fingering.

#### Scenario: Degree pulses across positions
- **WHEN** a given degree sounds during playback
- **THEN** every marker on the fretboard for that degree (across all strings/positions) pulses together

### Requirement: Interruption rules
The system SHALL stop playback when the user changes the selected scale, root, or tuning, or switches study tools. Pressing play while already playing SHALL restart playback from the top.

#### Scenario: Changing root stops playback
- **WHEN** scale playback is active and the user changes the root
- **THEN** playback stops immediately

#### Scenario: Restart from top
- **WHEN** the user presses play again while playback is already in progress
- **THEN** playback restarts from the first note of the sequence

### Requirement: Concurrent metronome and scale playback
The system SHALL allow the metronome and scale playback to run simultaneously, as independent scheduler clients sharing a master output gain.

#### Scenario: Both running at once
- **WHEN** the metronome is running and the user starts scale playback
- **THEN** both play in sync at the shared `tempoBpm` without one stopping the other
