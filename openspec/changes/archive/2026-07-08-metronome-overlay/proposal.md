# Proposal: metronome-overlay

## Why

The metronome panel lives inline in the global controls row, so expanding it pushes the tool navigation, control panel, and fretboard downward and reflows the page. It should float above the content like a transient control, not shove everything else out of the way.

## What Changes

- When expanded, the metronome renders as a floating overlay panel positioned above the page content, so opening or closing it does not reflow the header, tabs, control panel, or fretboard.
- The collapsed state stays a compact inline trigger button, unchanged.
- Add dismissal affordances: pressing Escape or clicking outside the overlay closes it (same effect as toggling the trigger).
- Presentation only - no change to tempo/meter/accent/gap behavior, audio, or the persisted collapsed state.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `metronome`: the expanded panel is presented as a non-reflowing floating overlay rather than inline content

## Impact

- `src/components/MetronomePanel/MetronomePanel.tsx`: wrap the expanded body in an overlay container; add Escape/click-outside close handlers that call the existing collapse toggle.
- `src/components/MetronomePanel/MetronomePanel.css`: position the expanded body as a floating card (fixed/absolute, elevated, with a shadow) taken out of document flow.
- Possibly minor `AppShell.css` adjustment so the trigger anchors the overlay. No state, audio, or persistence changes; no new dependencies.
