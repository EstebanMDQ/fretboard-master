# Proposal: add-fretboard-rendering

## Why

Every study tool in this app (scales, arpeggios) needs to highlight notes on a fretboard. Before building those tools we need a pure note/pitch model and a configurable, responsive SVG fretboard component that can render highlighted markers for any tuning, string count, and fret count.

## What Changes

- Add a pure note model: integer pitch (pitch class 0-11 + octave) for math, and a separate spelling type (letter + accidental, up to double sharps/flats) for display
- Add `spellDegree(rootSpelling, degreeLabel)` for degree-driven enharmonic spelling
- Add instrument configuration: string count, fret count, per-string tuning; persisted to `localStorage`
- Add an `InstrumentPanel` to edit tuning, string count, and fret count, with root/rootless pickers offering the 17 standard spellings (naturals + 5 sharps + 5 flats) as discrete choices
- Add the `Fretboard` SVG component that renders a configurable, responsive fretboard with highlighted note markers
- Add `positionsForPitchClasses(config, pitchClasses)`, a shared theory helper for turning a set of pitch classes into fretboard positions, for reuse by later scale/arpeggio features

## Capabilities

### New Capabilities

- `note-model`: pure pitch/spelling math (pitch class + octave, degree-driven enharmonic spelling)
- `instrument-config`: configurable tuning/string count/fret count, persisted locally
- `fretboard-rendering`: a `Fretboard` component that renders any instrument config with highlighted markers, with zero knowledge of scales/chords

### Modified Capabilities

None.

## Impact

- New files: `src/theory/notes.ts`, `src/theory/tunings.ts`, `src/components/Fretboard/`, `src/components/InstrumentPanel/`
- Depends on: `setup-app-scaffold`
- Foundation for: `add-scale-visualization` and `add-arpeggio-visualization`, both of which build on the highlighted-notes (`Marker`) API
- Non-goal: doubled courses (mandolin, 12-string) are modeled as single strings, not distinct course pairs
