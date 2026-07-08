## ADDED Requirements

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
