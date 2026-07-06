# Tasks: add-fretboard-rendering

## 1. Note model

- [ ] 1.1 Implement pitch representation (pitch class 0-11 + octave) in `src/theory/notes.ts`
- [ ] 1.2 Implement spelling type (letter + accidental, including double sharp/flat)
- [ ] 1.3 Implement `spellDegree(rootSpelling, degreeLabel)`
- [ ] 1.4 Define the 17 standard spellings (7 naturals, 5 sharps, 5 flats) used by root/rootless pickers

## 2. Instrument configuration

- [ ] 2.1 Define instrument config types (string count, fret count, per-string tuning) in `src/theory/tunings.ts`
- [ ] 2.2 Add standard tuning presets (at least standard guitar tuning) and validation for stored configs
- [ ] 2.3 Implement `localStorage` persistence under `fretboard-master:config:v1` with fallback to standard guitar tuning
- [ ] 2.4 Implement `InstrumentPanel` component to edit tuning, string count, and fret count

## 3. Fretboard rendering

- [ ] 3.1 Implement the `Fretboard` SVG component with the `{ config, markers }` contract
- [ ] 3.2 Implement equal-temperament fret spacing with linear fallback
- [ ] 3.3 Render strings in physical config order (not sorted by pitch); verify reentrant tunings render correctly
- [ ] 3.4 Implement `positionsForPitchClasses(config, pitchClasses)` shared helper

## 4. Integration / verification

- [ ] 4.1 Mount `Fretboard` and `InstrumentPanel` in the app shell's main/control regions
- [ ] 4.2 Verify the fretboard is responsive across common viewport sizes
- [ ] 4.3 Add Vitest coverage for note math, spelling, and `positionsForPitchClasses`
- [ ] 4.4 Verify `npm test`, `npm run lint`, and `npm run build` all pass
