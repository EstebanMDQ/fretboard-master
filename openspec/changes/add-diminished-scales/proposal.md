## Why

The scale catalog covers the modes, pentatonics, blues, whole tone, and chromatic, but omits the two symmetric octatonic diminished scales - staples for improvising over diminished and dominant-7 chords. Adding them rounds out the symmetric-scale family (the whole-tone scale is already present) and directly supports the app's learning goal of visualizing less-familiar scale shapes on the fretboard.

## What Changes

- Add two 8-note preset scales to the scale picker:
  - **Diminished (Whole-Half)**: W-H-W-H-W-H-W-H, intervals `[0, 2, 3, 5, 6, 8, 9, 11]`, degree labels `1 2 b3 4 b5 b6 6 7`. The classic diminished scale used over diminished-7 chords.
  - **Diminished (Half-Whole)**: H-W-H-W-H-W-H-W, intervals `[0, 1, 3, 4, 6, 7, 9, 10]`, degree labels `1 b2 #2 3 #4 5 6 b7`. The "dominant diminished" scale used over dominant-7 (b9/#9/#11/13) chords.
- Both integrate with the existing preset machinery (visualization, degree/name labels, playback) with no code changes beyond the catalog entry.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `scale-visualization`: the preset catalog gains the two diminished scales; the "Preset catalog" requirement is updated to list them.

## Impact

- `src/theory/scales.ts`: two new entries appended to `SCALE_PRESETS`.
- `src/theory/scales.test.ts`: the preset-count assertion changes from 15 to 17; add a spelling/interval check for the diminished scales.
- No new dependencies; `ScalePanel` renders presets from the array, so the picker updates automatically.
