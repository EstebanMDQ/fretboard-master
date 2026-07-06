# Tasks: add-scale-visualization

## 1. Scale theory

- [x] 1.1 Define scale shape `{ name, intervals, degreeLabels }` and preset catalog in `src/theory/scales.ts`
- [x] 1.2 Implement degree label <-> note name derivation via `spellDegree` in `src/theory/degrees.ts`
- [x] 1.3 Implement custom-scale flat-leaning fallback degree labeling (`fallbackDegreeLabel`)
- [x] 1.4 Implement shared `buildMarkers(config, root, intervals, degreeLabels, displayMode)`

## 2. State and UI

- [x] 2.1 Add `displayMode: 'names' | 'degrees'` to shared app state
- [x] 2.2 Add global controls region to `AppShell` for cross-tool state (display mode toggle)
- [x] 2.3 Implement `ScalePanel`: root picker, preset scale picker
- [x] 2.4 Implement custom scale editor (12-toggle chromatic row, root locked on)

## 3. Integration / verification

- [x] 3.1 Wire `ScalePanel` selections through `buildMarkers` into the `Fretboard`
- [x] 3.2 Add Vitest coverage for scale presets, degree labeling, and `buildMarkers`
- [x] 3.3 Verify `npm test`, `npm run lint`, and `npm run build` all pass
