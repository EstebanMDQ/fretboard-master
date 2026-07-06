# Design: add-fretboard-rendering

## Context

The app shell exists but renders only placeholders. This change adds the note math and the visual fretboard that every study tool will highlight notes on.

## Goals / Non-Goals

**Goals:**
- Pitch math that is correct and unit-testable, independent of display spelling
- Enharmonically correct note spelling, driven by the current scale/chord degree rather than a global sharp/flat preference
- A configurable, responsive `Fretboard` component that knows nothing about scales or chords
- Instrument configuration (tuning, string count, fret count) that persists across reloads

**Non-Goals:**
- Scale and chord theory (own changes: `add-scale-visualization`, `add-arpeggio-visualization`)
- Modeling doubled courses (mandolin, 12-string) as distinct string pairs - each course is a single string here

## Decisions

- **Two-layer note representation**: an integer pitch (pitch class 0-11 + octave) drives all math; a separate spelling type (letter + accidental, including double sharps/flats) drives display. Enharmonics are not interchangeable - the same pitch can and must be spelled differently depending on context.
- **Spelling is degree-driven**: `spellDegree(rootSpelling, degreeLabel)` derives a spelling from the root's spelling and the interval's degree label. There is no global sharp-vs-flat preference flag. Root and rootless pickers offer the 17 standard spellings (naturals + 5 sharps + 5 flats) as discrete choices, not free text.
- **Fretboard component contract**: `<Fretboard config={instrument} markers={Marker[]} />` where `Marker = { string, fret, label, emphasis }`. The `Fretboard` has zero knowledge of scales or chords - it only draws what it's given.
- **Shared helper**: `positionsForPitchClasses(config, pitchClasses)` lives in the theory layer and is reused by both the scale and arpeggio marker builders added in later changes.
- **Fret spacing**: equal-temperament formula, `position ∝ 1 - 2^(-fret/12)`, with a linear fallback constant for degenerate configs.
- **Layout**: horizontal, nut on the left. Strings are rendered in physical config order (the first configured string at the top, matching standard tab/fretboard-diagram convention) - not sorted by pitch. This matters for reentrant tunings such as ukulele high-G.
- **Persistence**: instrument config is stored under the versioned `localStorage` key `fretboard-master:config:v1`. Invalid or missing data falls back to standard guitar tuning.

## Directory layout

```
src/theory/notes.ts       # pitch/spelling math, spellDegree, positionsForPitchClasses
src/theory/tunings.ts     # instrument config types, standard tunings, persistence
src/components/Fretboard/
src/components/InstrumentPanel/
```

## Risks / Trade-offs

- [Corrupted or outdated localStorage data] → validate on load, fall back to standard guitar tuning on any parse/shape mismatch
- [Reentrant tunings could tempt sorting strings by pitch] → explicitly render in physical config order to keep reentrant tunings correct
