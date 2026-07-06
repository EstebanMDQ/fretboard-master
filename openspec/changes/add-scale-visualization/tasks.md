# Tasks: add-scale-visualization

## 1. Scale theory

- [ ] 1.1 Define scale shape `{ name, intervals, degreeLabels }` and preset catalog in `src/theory/scales.ts`
- [ ] 1.2 Implement degree label <-> note name derivation via `spellDegree` in `src/theory/degrees.ts`
- [ ] 1.3 Implement custom-scale flat-leaning fallback labeling with greedy letter-preference upgrade
- [ ] 1.4 Implement shared `buildMarkers(config, root, intervals, displayMode)`

## 2. State and UI

- [ ] 2.1 Add `displayMode: 'names' | 'degrees'` to shared app state
- [ ] 2.2 Add global controls region to `AppShell` for cross-tool state (display mode toggle)
- [ ] 2.3 Implement `ScalePanel`: root picker, preset scale picker
- [ ] 2.4 Implement custom scale editor (12-toggle chromatic row, root locked on)

## 3. Integration / verification

- [ ] 3.1 Wire `ScalePanel` selections through `buildMarkers` into the `Fretboard`
- [ ] 3.2 Add Vitest coverage for scale presets, degree labeling, and `buildMarkers`
- [ ] 3.3 Verify `npm test`, `npm run lint`, and `npm run build` all pass
