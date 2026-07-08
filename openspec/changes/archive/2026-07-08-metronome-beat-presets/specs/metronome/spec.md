## ADDED Requirements

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
