# Tasks: add-arpeggio-playback

## 1. Sequence logic

- [ ] 1.1 Extend the shared sequence builder (from `add-scale-playback`) with a "cap at octave only if within an octave" flag
- [ ] 1.2 Verify simple chords (triads, 6ths, 7ths) still cap at one octave by default
- [ ] 1.3 Verify extended chords (9/11/13) play true, unfolded intervals

## 2. Integration

- [ ] 2.1 Add play control to `ArpeggioPanel`, disabled until a valid chord exists
- [ ] 2.2 Wire the play control through the shared note voice, scheduler, and degree-based fretboard pulsing

## 3. Verification

- [ ] 3.1 Add Vitest coverage for the octave-capping flag across simple and extended chords
- [ ] 3.2 Verify `npm test`, `npm run lint`, and `npm run build` all pass
