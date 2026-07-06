# Design: add-scale-visualization

## Context

`Fretboard` and the note model exist and can render arbitrary markers. This change adds the first real study tool on top of them: scale selection and visualization.

## Goals / Non-Goals

**Goals:**
- Correct, shared scale data model usable by presets and custom scales alike
- A single marker-building function shared with the future arpeggio tool
- A names/degrees display toggle that lives in shared app state, not inside this tool

**Non-Goals:**
- Chord/arpeggio theory (own change: `add-arpeggio-visualization`)
- Scale playback/audio (own change: `add-scale-playback`)

## Decisions

- **Scale shape**: `{ name, intervals: number[], degreeLabels }`, where intervals are semitones from the root, strictly increasing, all less than 12. Presets and custom scales share this exact shape. Rejected alternative: representing scales as step patterns (W-W-H etc.) - explicit interval sets are simpler to validate and reuse.
- **Modes as explicit interval sets**: e.g. dorian is stored as `[0,2,3,5,7,9,10]` directly, not computed by rotating the major scale at runtime.
- **Degree labels are the source of truth for both display modes**: each preset carries explicit per-degree labels (needed to disambiguate cases a raw semitone offset can't, e.g. Lydian's `#4` vs Locrian's `b5` are both 6 semitones from the root); note-name labels are derived from the root spelling and degree label via `spellDegree`. Custom scales don't have a diatonic degree position to anchor to, so they fall back to a 12-entry flat-leaning semitone-to-label map instead.
- **Display mode lives in shared app state**: `displayMode: 'names' | 'degrees'` is global, not local to `ScalePanel`, because `add-arpeggio-visualization` needs the same toggle.
- **Shared marker-building function**: `buildMarkers(config, root, intervals, degreeLabels, displayMode)` is the single function that turns a root + interval/degree-label set into `Marker[]`. Both the scale and (later) arpeggio tools call this function rather than each building markers independently.
- **Custom scale editor**: a 12-toggle chromatic row with the root always locked on - no free-text interval entry.
- **Preset list**: major (ionian), natural minor (aeolian), harmonic minor, melodic minor, dorian, phrygian, lydian, mixolydian, locrian, major pentatonic, minor pentatonic, blues (minor blues), miyako bushi (`0,1,5,7,8`), whole tone, chromatic.

## Directory layout

```
src/theory/scales.ts    # scale shape, presets, buildMarkers
src/theory/degrees.ts   # degree label <-> spelling helpers, custom-scale fallback labeling
src/components/ScalePanel/
```

## Risks / Trade-offs

- [Custom scale degree labeling is ambiguous without a key context] → flat-leaning fallback map keeps labels readable without requiring the user to pick a key
