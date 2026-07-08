# Tasks: add-tuning-library

## 1. Preset tunings

- [x] 1.1 Add `BASS_4_STANDARD`, `BASS_5_STANDARD`, and `GUITAR_7_STANDARD` configs to `tunings.ts` with the octaves defined in design
- [x] 1.2 Add `NamedTuning` type and `BUILT_IN_TUNINGS` list (guitar, ukulele, both basses, 7-string)
- [x] 1.3 Render preset buttons in `InstrumentPanel` by mapping over `BUILT_IN_TUNINGS`

## 2. Tuning library store

- [x] 2.1 Add `TUNINGS_STORAGE_KEY` (`fretboard-master:tunings:v1`), `loadSavedTunings`, and `saveSavedTunings` with entry validation and graceful fallback
- [x] 2.2 Add pure `upsertTuning` (replace-by-name or append) and `deleteTuning` helpers

## 3. Library UI

- [x] 3.1 Hold the saved list in `InstrumentPanel` local state initialized from `loadSavedTunings`, persisting via `saveSavedTunings` on each change
- [x] 3.2 Add a save-as name input and Save button, disabled when the trimmed name is empty; save upserts the current config
- [x] 3.3 Render the saved-tunings list with Load and Delete controls; style in `InstrumentPanel.css`

## 4. Verification

- [x] 4.1 Add Vitest coverage for preset shapes and library load/save/upsert/delete/validation
- [x] 4.2 Verify `npm test`, `npm run lint`, and `npm run build` all pass
