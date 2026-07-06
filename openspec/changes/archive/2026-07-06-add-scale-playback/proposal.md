# Proposal: add-scale-playback

## Why

Hearing a scale while seeing it highlighted reinforces the study loop. This change adds a play button to `ScalePanel` that plays the selected scale, one note per beat at the shared tempo, synced with the fretboard.

## What Changes

- Add a note voice: two detuned triangle oscillators through an exponential-decay gain envelope (fast attack ~5ms, decay over ~90% of the beat)
- Add `src/audio/notes.ts` with the frequency formula `440 * 2^((midi - 69) / 12)`; root register fixed at octave 3 regardless of tuning
- Add a sequence builder that turns the selected scale into an ordered note sequence, one octave, with direction options (ascending/descending/both)
- Schedule one note per beat at `tempoBpm` through the metronome's existing lookahead scheduler (`schedule(events)`), reusing it rather than reimplementing timing
- Sync the fretboard by degree, not specific fretting: while a degree is sounding, every marker sharing that degree pulses together
- Add interruption rules: changing scale, root, tuning, or switching tools stops playback; pressing play while already playing restarts from the top; the metronome and scale playback can run simultaneously as independent scheduler clients sharing a master gain

## Capabilities

### New Capabilities

- `scale-playback`: play the selected scale at the shared tempo with fretboard sync

### Modified Capabilities

- `audio-engine`: adds the shared note voice and sequence-scheduling reuse of `schedule(events)`

## Impact

- New files: `src/audio/notes.ts`; play controls added to `src/components/ScalePanel/`
- Depends on: `add-metronome` (audio engine, scheduler, `tempoBpm`) and `add-scale-visualization` (selected scale/root state)
- `add-arpeggio-playback` will reuse the note voice and sequence builder built here
