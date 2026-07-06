# Proposal: add-scale-visualization

## Why

With the fretboard and note model in place, the app needs its first study tool: pick a root and a scale (preset or custom) and see every matching note highlighted on the fretboard.

## What Changes

- Add scale theory data: presets stored as `{ name, intervals, degreeLabels }` (semitones from root, strictly increasing, all less than 12), covering major/modes, harmonic and melodic minor, pentatonics, blues, miyako bushi, whole tone, and chromatic
- Add a `ScalePanel` with root picker, scale picker (presets + custom), and a custom scale editor (12-toggle chromatic row, root always locked on)
- Add a shared `displayMode` (`names` | `degrees`) to app state, toggling between note-name and scale-degree labels
- Add `buildMarkers(config, root, intervals, degreeLabels, displayMode)`, a shared function for turning a root + interval/degree-label set into fretboard `Marker[]`, reused later by the arpeggio tool
- Modify `app-shell` to add a shared global controls area for state that spans tools (starting with `displayMode`)

## Capabilities

### New Capabilities

- `scale-visualization`: root + scale selection (preset or custom), highlighting all matching notes on the fretboard
- `note-display-toggle`: shared names/degrees display mode

### Modified Capabilities

- `app-shell`: adds a shared global controls area for cross-tool state

## Impact

- New files: `src/theory/scales.ts`, `src/theory/degrees.ts`, `src/components/ScalePanel/`
- Depends on: `add-fretboard-rendering` (note model, `positionsForPitchClasses`, `Marker` API)
- `add-arpeggio-visualization` will reuse `buildMarkers`, the display toggle, and this panel's UI patterns
