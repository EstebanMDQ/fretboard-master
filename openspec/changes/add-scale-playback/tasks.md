# Tasks: add-scale-playback

## 1. Audio

- [ ] 1.1 Implement frequency formula `440 * 2^((midi - 69) / 12)` in `src/audio/notes.ts`
- [ ] 1.2 Implement the note voice (two detuned triangle oscillators, exponential-decay envelope)
- [ ] 1.3 Implement the sequence builder (root at octave 3, one octave, direction options)

## 2. Playback integration

- [ ] 2.1 Add play control to `ScalePanel`, scheduling one note per beat via the shared `schedule(events)` API
- [ ] 2.2 Implement degree-based fretboard pulse sync during playback
- [ ] 2.3 Implement interruption rules (stop on scale/root/tuning/tool change; restart-from-top on re-press)

## 3. Verification

- [ ] 3.1 Verify metronome and scale playback can run concurrently without audio clipping or stopping each other
- [ ] 3.2 Add Vitest coverage for the frequency formula and sequence builder
- [ ] 3.3 Verify `npm test`, `npm run lint`, and `npm run build` all pass
