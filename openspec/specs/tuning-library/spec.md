# tuning-library Specification

## Purpose
TBD - created by archiving change add-tuning-library. Update Purpose after archive.
## Requirements
### Requirement: Built-in tuning presets
The system SHALL provide selectable built-in tuning presets. The set SHALL include guitar (standard), ukulele (standard), 4-string bass (E A D G), 5-string bass (4-string bass with a low B added below the E), and 7-string guitar (standard guitar tuning with a low B added below the low E). Selecting a preset SHALL replace the current instrument configuration with that preset.

#### Scenario: Select a bass preset
- **WHEN** the user selects the 4-string bass preset
- **THEN** the instrument configuration becomes the 4-string bass tuning (E A D G) and the fretboard re-renders to reflect it

#### Scenario: Select the 5-string bass preset
- **WHEN** the user selects the 5-string bass preset
- **THEN** the instrument configuration becomes the 4-string bass tuning with a low B added below the E, and the fretboard re-renders to reflect it

#### Scenario: Select the 7-string guitar preset
- **WHEN** the user selects the 7-string guitar preset
- **THEN** the instrument configuration has seven strings with a low B below the low E and the fretboard re-renders to reflect it

### Requirement: Save the current tuning to the library
The system SHALL allow the user to save the current instrument configuration to a named entry in a browser-persisted tuning library. Saving under a name that already exists SHALL overwrite that entry. Saving SHALL be prevented when the name is empty or only whitespace.

#### Scenario: Save a new custom tuning
- **WHEN** the user enters a name (for example "tebi tuning") and saves the current configuration
- **THEN** a library entry with that name and the current configuration is created

#### Scenario: Overwrite an existing name
- **WHEN** the user saves under a name that already exists in the library
- **THEN** the existing entry's configuration is replaced with the current one, without creating a duplicate

#### Scenario: Empty name is rejected
- **WHEN** the name field is empty or only whitespace
- **THEN** the save action is disabled and no entry is created

### Requirement: Load and delete saved tunings
The system SHALL list the user's saved tunings and allow loading any of them into the fretboard and deleting any of them.

#### Scenario: Load a saved tuning
- **WHEN** the user loads a saved tuning from the library
- **THEN** the instrument configuration becomes that saved tuning's configuration and the fretboard re-renders to reflect it

#### Scenario: Delete a saved tuning
- **WHEN** the user deletes a saved tuning from the library
- **THEN** the entry is removed from the library and no longer listed

### Requirement: Tuning library persists across reloads
The system SHALL persist the tuning library to `localStorage` under the versioned key `fretboard-master:tunings:v1`, separate from the current-configuration key.

#### Scenario: Saved tunings survive a reload
- **WHEN** the user reloads the app after saving one or more tunings
- **THEN** the same saved tunings are listed and can be loaded

#### Scenario: Invalid or missing library falls back safely
- **WHEN** the stored library is missing, unparseable, or fails validation
- **THEN** the system falls back to an empty library without throwing, and individual entries that fail validation are skipped

