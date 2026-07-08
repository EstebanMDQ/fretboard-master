## Context

Scale presets are plain data: `{ name, intervals, degreeLabels }` in `src/theory/scales.ts`, consumed by `buildMarkers` and rendered by `ScalePanel` (which maps over the array). Adding a scale is a data-only change. The only real decision is how to spell the two octatonic scales, since an 8-note scale must reuse a letter name, and the app spells notes by degree label via `spellDegree` (per the project's enharmonic rule: spelling follows the scale's harmonic framework, not a global sharp/flat default).

## Goals / Non-Goals

**Goals:**
- Add both diminished scales with intervals and degree labels that satisfy the preset contract (strictly increasing intervals, all < 12) and read correctly in both label modes.

**Non-Goals:**
- Restructuring how presets are stored or ordered.
- A dedicated "symmetric scales" grouping in the UI (presets remain a flat list).

## Decisions

### Interval sets

- **Whole-Half**: `[0, 2, 3, 5, 6, 8, 9, 11]` (steps 2-1-2-1-2-1-2-1).
- **Half-Whole**: `[0, 1, 3, 4, 6, 7, 9, 10]` (steps 1-2-1-2-1-2-1-2).

Both are strictly increasing and below 12, satisfying the existing preset test.

### Degree-label spelling

- **Whole-Half** -> `1 2 b3 4 b5 b6 6 7`. Reads as a minor-leaning scale (matches its use over diminished chords); reuses the letter of the 6th (b6 then 6) rather than introducing double flats (e.g. `bb7`). Concretely for a C root: C D Eb F Gb Ab A B.
- **Half-Whole** -> `1 b2 #2 3 #4 5 6 b7`. Spelled from its dominant-7 framework (b9, #9, 3, #11, 5, 13, b7), so the natural 3 and b7 read as a dominant chord's guide tones and the tensions read as altered 9ths/11th. For a C root: C Db D# E F# G A Bb.

Rationale: these labels keep the harmonic function legible in degree mode and produce sensible note names in names mode, while avoiding double accidentals. Each label is a valid `spellDegree` input and maps back to the listed interval.

## Risks / Trade-offs

- **Enharmonic taste**: an 8-note scale forces one doubled letter, so any spelling is a compromise. The half-whole's `#2`/`#4` follow dominant convention; a flat-leaning alternative (`b3`/`b5`) is equally valid but obscures the dominant function. Mitigation: the choice matches the project's degree-driven spelling rule and is documented here.
- **Preset-count test**: the existing test pins the count at 15; it must move to 17 or it will fail. Covered in tasks.
