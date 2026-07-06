# Spec: audio-engine

## ADDED Requirements

### Requirement: AudioContext lifecycle is lazy and user-initiated
The system SHALL create the `AudioContext` lazily and resume it only on the first user transport-control interaction, never attempting autoplay.

#### Scenario: First interaction unlocks audio
- **WHEN** the user presses a transport control (e.g. metronome start) for the first time
- **THEN** the `AudioContext` is created/resumed at that point, not before

### Requirement: Lookahead scheduling
The system SHALL provide a generic `schedule(events)` API using a lookahead scheduler: a timer wakes at a short fixed interval (~25ms) and schedules any events falling within a short lookahead window (~100ms) using the `AudioContext` clock.

#### Scenario: Sample-accurate timing
- **WHEN** events are scheduled via `schedule(events)`
- **THEN** their actual playback timing is keyed to `audioContext.currentTime`, not to `setInterval`/`setTimeout` firing time

#### Scenario: Reused by note playback
- **WHEN** a future feature needs to play a sequence of notes in time
- **THEN** it can call the same `schedule(events)` API rather than implementing its own scheduler

### Requirement: Reusable tone voice synthesis
The system SHALL provide reusable voice-synthesis primitives for short percussive/tonal sounds with configurable frequency and decay.

#### Scenario: Click voice
- **WHEN** the metronome schedules a click
- **THEN** a short sine/square blip with fast exponential decay is produced at the requested frequency
