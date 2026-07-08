# metronome Specification

## Purpose
TBD - created by archiving change add-metronome. Update Purpose after archive.
## Requirements
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
The system SHALL persist tempo, meter, accent pattern, and subdivision across reloads, but SHALL always restore the metronome in a stopped state.

#### Scenario: Reload does not auto-start
- **WHEN** the user reloads the app after using the metronome
- **THEN** their tempo, meter, pattern, and subdivision are restored, but playback does not automatically start

### Requirement: Expanded metronome is a non-reflowing overlay
The system SHALL present the expanded metronome panel as a floating overlay layered above the page content, such that expanding or collapsing it does not reflow or displace the header, tool navigation, control panel, or fretboard. The collapsed state SHALL remain a compact inline trigger. The overlay SHALL be dismissable by pressing Escape or clicking outside it, each having the same effect as toggling the trigger.

#### Scenario: Expanding does not push content down
- **WHEN** the user expands the metronome
- **THEN** its controls appear as a floating overlay above the page and the position of the tabs, control panel, and fretboard does not change

#### Scenario: Dismiss by Escape or outside click
- **WHEN** the overlay is open and the user presses Escape or clicks outside it
- **THEN** the overlay closes, equivalent to toggling it collapsed

#### Scenario: Collapsed trigger stays inline
- **WHEN** the metronome is collapsed
- **THEN** only the compact trigger button is shown inline, with no floating overlay

### Requirement: Selectable subdivision feel
The system SHALL let the user select a subdivision feel applied within each counted beat, one of: quarter (none), straight 8ths, triplets, or swing 8ths.

#### Scenario: Select a subdivision
- **WHEN** the user selects a subdivision feel
- **THEN** subsequent playback layers the corresponding extra clicks inside each beat

### Requirement: Subdivision click placement and voice
The system SHALL place subdivision clicks at feel-specific fractions of each counted beat: none for quarter; the 1/2 point for straight 8ths; the 1/3 and 2/3 points for triplets; and a single offbeat at the 2/3 point of the beat (a 2:1 triplet ratio) for swing 8ths. Subdivision clicks SHALL use a lower gain than the main-beat click, and MAY use a different click frequency to remain audibly separable.

#### Scenario: Straight 8ths add a midpoint click
- **WHEN** the subdivision is straight 8ths
- **THEN** each beat plays the main click plus one quieter click halfway to the next beat

#### Scenario: Triplets add two clicks
- **WHEN** the subdivision is triplets
- **THEN** each beat plays the main click plus quieter clicks at the 1/3 and 2/3 points of the beat

#### Scenario: Swing delays the offbeat
- **WHEN** the subdivision is swing 8ths
- **THEN** each beat plays the main click plus one quieter offbeat click at the 2/3 point of the beat (a 2:1 triplet ratio), giving a long-short feel

#### Scenario: Offsets follow the beat interval when the meter changes
- **WHEN** the denominator changes so the beat interval changes
- **THEN** subdivision clicks are placed at the same fractional offsets of the new beat interval

### Requirement: Subdivisions respect beat muting and stay audio-only
The system SHALL suppress a beat's subdivision clicks whenever that beat is muted (per-beat `mute` or gap training). Subdivision clicks SHALL NOT advance or alter the visual beat indicator, which continues to track main beats only.

#### Scenario: Muted beat plays no subdivisions
- **WHEN** a beat is muted by its accent state or by gap training
- **THEN** neither its main click nor its subdivision clicks sound

#### Scenario: Visual indicator ignores subdivisions
- **WHEN** subdivisions are active
- **THEN** the visual beat indicator still advances once per counted beat, not per subdivision

### Requirement: One-tap beat-pattern presets
The system SHALL provide beat-pattern presets that replace the entire per-beat accent pattern for the current meter in a single action: "all beats" (every beat sounds, using the meter's default accents), "backbeat" (only even-numbered beats sound, the rest muted), and "downbeat only" (beat 1 accented, all other beats muted). Applying a preset SHALL persist like any other pattern change.

#### Scenario: Apply all beats
- **WHEN** the user applies the all-beats preset
- **THEN** every beat sounds using the meter's default accents

#### Scenario: Apply backbeat in 4/4
- **WHEN** the meter is 4/4 and the user applies the backbeat preset
- **THEN** beats 1 and 3 are muted and beats 2 and 4 sound

#### Scenario: Backbeat in an odd meter
- **WHEN** the meter is 3/4 and the user applies the backbeat preset
- **THEN** beat 2 sounds and beats 1 and 3 are muted

#### Scenario: Backbeat falls back when no even beat exists
- **WHEN** the numerator is less than 2 and the user applies the backbeat preset
- **THEN** the pattern falls back to the default (beat 1 accented), since no backbeat is possible

#### Scenario: Apply downbeat only
- **WHEN** the user applies the downbeat-only preset
- **THEN** beat 1 is accented and every other beat is muted

#### Scenario: Preset adapts to the current meter
- **WHEN** the numerator changes and the user applies a preset
- **THEN** the preset is rebuilt for the current number of beats

### Requirement: Muting is discoverable
The system SHALL make per-beat muting discoverable by labeling the beats row with a hint that tapping a beat cycles it through accent, normal, and mute, and SHALL style muted beats so they are visually distinct as silent.

#### Scenario: Tap hint is shown
- **WHEN** the user views the expanded metronome
- **THEN** a hint indicates that tapping a beat cycles accent, normal, and mute

#### Scenario: Muted beats look off
- **WHEN** a beat is muted
- **THEN** it is rendered visually distinct from sounding beats

