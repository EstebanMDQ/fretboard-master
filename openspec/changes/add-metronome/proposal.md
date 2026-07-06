# Proposal: add-metronome

## Why

Both current study tools would benefit from tempo-synced playback, and a metronome is a useful standalone practice tool. This change adds a raw Web Audio engine (context lifecycle, lookahead scheduler, click voices) and a full metronome (tempo, meter, per-beat accents, gap training) as a global collapsible shell control.

## What Changes

- Add a raw Web Audio engine: lazy `AudioContext` creation, resumed on first transport-control press (no autoplay attempts)
- Add a lookahead scheduler ("two clocks" pattern): a `setInterval` timer at ~25ms wakes and schedules any events falling within the next ~100ms window on the `AudioContext` clock; exposed as a generic `schedule(events)` API in `audio-engine` for reuse by scale/arpeggio playback later
- Add click voices: short sine/square blip with fast exponential decay - accented beats ~1800Hz, normal beats ~1000Hz; muted beats produce no sound but still advance the visual indicator
- Add metronome logic: tempo (30-300 BPM), meter (numerator 1-16 over denominator 2/4/8/16), per-beat accent pattern (`BeatAccent = 'accent' | 'normal' | 'mute'`), with defaults derived from meter (beat 1 accented; 6/8 and 12/8 accent each dotted-quarter group) and tap-to-cycle editing
- Add gap training as a measure-level output gate: mutes audio only for `index mod (N+M) >= N`, leaving pattern/meter and visual beats unaffected
- Add a visual beat indicator driven by `requestAnimationFrame` comparing `audioContext.currentTime` to the schedule queue (not a parallel JS timer), to avoid drift between sight and sound
- Add `tempoBpm` to shared app state, under that exact field name, for reuse by `add-scale-playback` and `add-arpeggio-playback`
- Add `MetronomePanel` as a collapsible global shell control, always restored stopped on reload

## Capabilities

### New Capabilities

- `audio-engine`: AudioContext lifecycle, lookahead scheduler, reusable click/tone voices
- `metronome`: tempo, meter, accent pattern, gap training, visual beat indicator

### Modified Capabilities

- `app-shell`: adds `MetronomePanel` as a collapsible global control

## Impact

- New files: `src/audio/engine.ts`, `src/audio/scheduler.ts`, `src/audio/voices.ts`, `src/audio/metronome.ts`, `src/components/MetronomePanel/`
- Depends on code-wise only on `setup-app-scaffold`
- Implement after `add-arpeggio-visualization`: this change's `app-shell` spec delta builds on the tool switcher added there, so implementing in that order keeps the shell spec history linear, even though the audio code itself has no dependency on arpeggio visualization
- Explicitly rejects Tone.js (~150KB for features not needed) and AudioWorklet (overkill for this scheduling precision requirement)
