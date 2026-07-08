## MODIFIED Requirements

### Requirement: Multi-tab tool navigation with independent state
The app shell SHALL provide Scales, Arpeggios, and Chords tabs; each tool's selections SHALL persist independently across tab switches.

#### Scenario: Switch tabs and back
- **WHEN** the user configures a scale, switches to Arpeggios, configures a chord, and switches back to Scales
- **THEN** the original scale selection is still shown, and switching to Arpeggios again still shows the chord that was configured

#### Scenario: Chords tab state persists
- **WHEN** the user configures a chord and position in the Chords tab, switches to another tool, and returns
- **THEN** the Chords tab still shows the configured chord and selected position
