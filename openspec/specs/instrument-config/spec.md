# instrument-config Specification

## Purpose
TBD - created by archiving change add-fretboard-rendering. Update Purpose after archive.
## Requirements
### Requirement: Instrument configuration is adjustable
The system SHALL allow the user to configure string count, fret count, and per-string tuning via an `InstrumentPanel`.

#### Scenario: Change tuning
- **WHEN** the user edits a string's tuning in the `InstrumentPanel`
- **THEN** the fretboard reflects the new tuning immediately

#### Scenario: Change string or fret count
- **WHEN** the user changes the string count or fret count
- **THEN** the fretboard re-renders with the new dimensions, preserving compatible per-string tunings where possible

### Requirement: Instrument configuration persists across reloads
The system SHALL persist the current instrument configuration to `localStorage` under the versioned key `fretboard-master:config:v1`.

#### Scenario: Reload restores configuration
- **WHEN** the user reloads the app after customizing their instrument configuration
- **THEN** the same configuration is restored

#### Scenario: Invalid stored configuration falls back safely
- **WHEN** the stored configuration is missing or fails validation
- **THEN** the system falls back to standard guitar tuning without throwing an error

