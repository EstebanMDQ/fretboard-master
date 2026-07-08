## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Metronome always restores stopped
The system SHALL persist tempo, meter, accent pattern, and subdivision across reloads, but SHALL always restore the metronome in a stopped state.

#### Scenario: Reload does not auto-start
- **WHEN** the user reloads the app after using the metronome
- **THEN** their tempo, meter, pattern, and subdivision are restored, but playback does not automatically start
