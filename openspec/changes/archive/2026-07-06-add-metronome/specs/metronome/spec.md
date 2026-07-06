# Spec: metronome

## ADDED Requirements

### Requirement: Tempo and meter are adjustable
The system SHALL let the user set tempo (30-300 BPM, shared as `tempoBpm` in app state) and meter (numerator 1-16 over denominator 2/4/8/16).

#### Scenario: Change tempo
- **WHEN** the user adjusts the tempo control
- **THEN** subsequent clicks play at the new `tempoBpm`

#### Scenario: Change meter regenerates default accents
- **WHEN** the user changes the meter
- **THEN** the per-beat accent pattern resets to the meter's default (beat 1 accented; 6/8 and 12/8 accent each dotted-quarter group)

### Requirement: Per-beat accents are editable
The system SHALL represent each beat's accent as `'accent' | 'normal' | 'mute'`, and SHALL let the user tap a beat to cycle its state.

#### Scenario: Tap to cycle accent
- **WHEN** the user taps a beat indicator
- **THEN** that beat's accent cycles through accent, normal, and mute, and the pattern is marked custom

### Requirement: Click synthesis reflects accent state
The system SHALL play an accented click (~1800Hz) for accented beats, a normal click (~1000Hz) for normal beats, and no sound for muted beats, while still advancing the visual indicator for muted beats.

#### Scenario: Muted beat is silent but visible
- **WHEN** a beat's accent is `mute`
- **THEN** no audio plays for that beat, but the visual beat indicator still advances

### Requirement: Gap training mutes audio on a measure cycle
The system SHALL support gap training, muting audio output (but not the visual indicator or the underlying pattern/meter) whenever `beatIndex mod (N + M) >= N`, for configurable N (sounding measures) and M (silent measures).

#### Scenario: Gap training silences some measures
- **WHEN** gap training is configured with N sounding measures and M silent measures
- **THEN** every Nth group of M measures plays with no audio, while the visual beat indicator and underlying pattern continue unaffected

### Requirement: Visual beat indicator stays in sync with audio
The system SHALL drive the visual beat indicator from a `requestAnimationFrame` loop that compares `audioContext.currentTime` to the schedule queue.

#### Scenario: No drift over time
- **WHEN** the metronome runs for an extended period
- **THEN** the visual indicator remains in sync with the audible click, without drifting

### Requirement: Metronome always restores stopped
The system SHALL persist tempo, meter, and accent pattern across reloads, but SHALL always restore the metronome in a stopped state.

#### Scenario: Reload does not auto-start
- **WHEN** the user reloads the app after using the metronome
- **THEN** their tempo/meter/pattern are restored, but playback does not automatically start
