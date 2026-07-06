# Tasks: add-metronome

## 1. Audio engine

- [x] 1.1 Implement lazy `AudioContext` lifecycle with first-interaction unlock in `src/audio/engine.ts`
- [x] 1.2 Implement the lookahead scheduler (~25ms wake interval, ~100ms lookahead window) and generic `schedule(events)` API in `src/audio/scheduler.ts`
- [x] 1.3 Implement click/tone voice synthesis in `src/audio/voices.ts`

## 2. Metronome logic

- [x] 2.1 Implement tempo (`tempoBpm`, 30-300) and meter (1-16 over 2/4/8/16) state in `src/audio/metronome.ts`
- [x] 2.2 Implement per-beat accent pattern with meter-derived defaults and tap-to-cycle editing
- [x] 2.3 Implement gap training as a measure-level audio-only mute gate

## 3. UI

- [x] 3.1 Implement `MetronomePanel` as a collapsible global shell control
- [x] 3.2 Implement the rAF-driven visual beat indicator synced to the schedule queue
- [x] 3.3 Persist tempo/meter/accent pattern; always restore playback stopped

## 4. Verification

- [x] 4.1 Add Vitest coverage for meter-derived default accents and the gap-training gate formula
- [ ] 4.2 Manually verify audio/visual sync holds over an extended run (needs a real browser; not verifiable in this headless environment - please check on your end)
- [x] 4.3 Verify `npm test`, `npm run lint`, and `npm run build` all pass
