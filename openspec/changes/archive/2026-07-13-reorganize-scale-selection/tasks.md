## 1. Data layer - restructure scales

- [x] 1.1 Add `ScaleFamily` interface to `src/theory/scales.ts` (name: string, modes: Scale[])
- [x] 1.2 Define `SCALE_FAMILIES` with all 8 families and their modes (Major 7, Harmonic Minor 7, Melodic Minor 7, Pentatonic 3, Diminished 2, Augmented 2, Symmetrical 2, Other 1)
- [x] 1.3 Keep `SCALE_PRESETS` as a derived export (`SCALE_FAMILIES.flatMap(f => f.modes)`) to avoid breaking imports elsewhere
- [x] 1.4 Update `src/theory/scales.test.ts` to verify SCALE_FAMILIES structure and spot-check intervals for Major/Ionian, Harmonic Minor mode 0, and Augmented mode 0

## 2. State - replace presetIndex with familyIndex + modeIndex

- [x] 2.1 Update `ScaleToolState` in `src/state/appStateStore.ts`: replace `presetIndex: number` with `familyIndex: number` and `modeIndex: number`
- [x] 2.2 Update `initScaleToolState()` to use `familyIndex: 0, modeIndex: 0`
- [x] 2.3 Replace the `selectScalePreset` action with `selectScaleFamily` (resets modeIndex to 0) and `selectScaleMode` actions in the action union and reducer

## 3. UI - update ScalePanel

- [x] 3.1 Update `ScalePanel` props: replace `onPresetChange` with `onFamilyChange` and `onModeChange`
- [x] 3.2 Replace the single Scale `<select>` with two linked selects: Family (maps SCALE_FAMILIES) and Mode (maps current family's modes)
- [x] 3.3 Wire family change to dispatch `selectScaleFamily`; wire mode change to dispatch `selectScaleMode`
- [x] 3.4 Update the parent component (App.tsx or wherever ScalePanel is used) to pass the new props and dispatch the new actions

## 4. Marker generation - connect new state to buildMarkers

- [x] 4.1 Update wherever markers are computed from scale state: replace `SCALE_PRESETS[scaleTool.presetIndex]` with `SCALE_FAMILIES[scaleTool.familyIndex].modes[scaleTool.modeIndex]`

## 5. Verify

- [x] 5.1 Run `npm run typecheck` (or equivalent) and confirm no TypeScript errors
- [x] 5.2 Run `npm test` and confirm all tests pass
- [x] 5.3 Manually verify in the browser: selecting Major > Dorian highlights the correct notes; switching families resets to mode 0; custom scale editor still works
