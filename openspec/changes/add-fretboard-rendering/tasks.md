# Tasks: add-fretboard-rendering

## 1. Note model

- [x] 1.1 Implement pitch representation (pitch class 0-11 + octave) in `src/theory/notes.ts`
- [x] 1.2 Implement spelling type (letter + accidental, including double sharp/flat)
- [x] 1.3 Implement `spellDegree(rootSpelling, degreeLabel)`
- [x] 1.4 Define the 17 standard spellings (7 naturals, 5 sharps, 5 flats) used by root/rootless pickers

## 2. Instrument configuration

- [x] 2.1 Define instrument config types (string count, fret count, per-string tuning) in `src/theory/tunings.ts`
- [x] 2.2 Add standard tuning presets (at least standard guitar tuning) and validation for stored configs
- [x] 2.3 Implement `localStorage` persistence under `fretboard-master:config:v1` with fallback to standard guitar tuning
- [x] 2.4 Implement `InstrumentPanel` component to edit tuning, string count, and fret count

## 3. Fretboard rendering

- [x] 3.1 Implement the `Fretboard` SVG component with the `{ config, markers }` contract
- [x] 3.2 Implement equal-temperament fret spacing with linear fallback
- [x] 3.3 Render strings in physical config order (not sorted by pitch); verify reentrant tunings render correctly
- [x] 3.4 Implement `positionsForPitchClasses(config, pitchClasses)` shared helper

## 4. Integration / verification

- [x] 4.1 Mount `Fretboard` and `InstrumentPanel` in the app shell's main/control regions
- [x] 4.2 Verify the fretboard is responsive across common viewport sizes
- [x] 4.3 Add Vitest coverage for note math, spelling, and `positionsForPitchClasses`
- [x] 4.4 Verify `npm test`, `npm run lint`, and `npm run build` all pass
