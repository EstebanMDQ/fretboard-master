# Spec: audio-engine

## MODIFIED Requirements

### Requirement: Reusable tone voice synthesis
The system SHALL provide reusable voice-synthesis primitives for short percussive/tonal sounds with configurable frequency and decay, including a melodic note voice built from two detuned triangle oscillators through an exponential-decay envelope (fast attack ~5ms, decay over ~90% of the beat).

#### Scenario: Note voice
- **WHEN** a melodic note is scheduled for playback
- **THEN** it uses the shared note voice (two detuned triangle oscillators, exponential decay envelope) at the requested frequency

### Requirement: Lookahead scheduling
The system SHALL provide a generic `schedule(events)` API using a lookahead scheduler, reused by both the metronome and note-sequence playback features.

#### Scenario: Note sequence reuses the scheduler
- **WHEN** a feature needs to play an ordered sequence of notes in time
- **THEN** it schedules each note via the same `schedule(events)` API used by the metronome, rather than a separate timing mechanism
