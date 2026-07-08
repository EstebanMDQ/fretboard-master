# Tasks: metronome-subdivisions

## 1. Subdivision model

- [x] 1.1 Add `Subdivision` type and `subdivisionOffsets(subdivision)` pure helper (quarter `[]`, eighth `[0.5]`, triplet `[1/3, 2/3]`, swing `[2/3]`) in `metronome.ts`
- [x] 1.2 Add `subdivision` to `MetronomeSettings`/`MetronomeLiveSettings`, with default `'quarter'`, validation, and persistence
- [x] 1.3 Add `subdivision` to `MetronomeToolState`, a `setSubdivision` action, and thread it into live settings

## 2. Engine and voice

- [x] 2.1 Extend the click voice (`playClick`) with an optional gain/volume parameter defaulting to the current level
- [x] 2.2 In `scheduleUpcomingBeats`, schedule audio-only subdivision clicks at `time + offset * beatInterval`, gated on the same `muted` check, without recording beats or advancing `beatIndex`
- [x] 2.3 Confirm the visual indicator and `recentBeats` still track main beats only

## 3. UI

- [x] 3.1 Add a subdivision selector to `MetronomePanel` wired to `setSubdivision`

## 4. Verification

- [x] 4.1 Add Vitest coverage for `subdivisionOffsets` per feel and for muted-beat suppression of subdivisions
- [x] 4.2 Verify subdivisions sound correctly for straight 8ths, triplets, and swing at a range of tempos
- [x] 4.3 Verify `npm test`, `npm run lint`, and `npm run build` pass
