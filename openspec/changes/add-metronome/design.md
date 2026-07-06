# Design: add-metronome

## Context

No audio exists yet. This change adds the audio foundation (`audio-engine`) and the first audio-driven feature (`metronome`), and its shared scheduler/tempo state is reused by scale and arpeggio playback later.

## Goals / Non-Goals

**Goals:**
- Sample-accurate, drift-free scheduling using the Web Audio clock, not JS timers
- A generic scheduler API reusable by future note-playback features
- A practice-grade metronome: adjustable tempo/meter, per-beat accents, gap training

**Non-Goals:**
- Scale/arpeggio note playback (own changes: `add-scale-playback`, `add-arpeggio-playback`)
- Any sample-based or synthesized instrument voice beyond the metronome click

## Decisions

- **No audio dependencies - raw Web Audio API.** Explicitly rejects Tone.js: ~150KB for features this project doesn't need.
- **Lookahead scheduler ("two clocks" pattern)**: a `setInterval` at ~25ms wakes and schedules events falling within the next ~100ms window on the `AudioContext` clock. A generic `schedule(events)` API lives in `audio-engine` so `add-scale-playback` and `add-arpeggio-playback` can reuse it rather than building their own scheduler. Explicitly rejects `AudioWorklet` as overkill for this precision requirement.
- **AudioContext unlock on first interaction**: the context is lazily created and resumed on the first transport-control press; the app never attempts to autoplay audio.
- **Beat state model**: `beats: BeatAccent[]` where `BeatAccent = 'accent' | 'normal' | 'mute'`. Defaults are derived from the meter: beat 1 is accented by default; 6/8 and 12/8 accent each dotted-quarter group. Tapping a beat cycles its state. Changing the meter regenerates the defaults and marks the pattern "custom" once the user has edited it.
- **Click synthesis**: a short sine/square blip with fast exponential decay. Accented beats ring around 1800Hz, normal beats around 1000Hz. Muted beats produce no sound but still advance the visual indicator.
- **Gap training as a measure-level output gate**: for beat index `i`, mute audio only when `i mod (N+M) >= N`. This affects audio only - pattern and meter are unaffected, and visual beats continue uninterrupted.
- **Visual indicator via rAF**: a `requestAnimationFrame` loop compares `audioContext.currentTime` against the schedule queue to drive the visual beat indicator, rather than running a parallel JS timer - this avoids drift between what's seen and what's heard.
- **Shared tempo field**: tempo lives in shared app state as `tempoBpm` - this exact field name is reused later by `add-scale-playback` and `add-arpeggio-playback`.
- **Ranges**: tempo 30-300 BPM; meter numerator 1-16 over denominator 2/4/8/16.
- **Metronome settings always restore stopped on reload** - persisted tempo/meter/pattern, but never auto-starts playback.

## Directory layout

```
src/audio/engine.ts       # AudioContext lifecycle
src/audio/scheduler.ts    # lookahead scheduler, schedule(events) API
src/audio/voices.ts       # click/tone voice synthesis
src/audio/metronome.ts    # metronome logic (tempo, meter, accents, gap training)
src/components/MetronomePanel/
```

## Risks / Trade-offs

- [JS timer drift causing audible timing errors] → lookahead scheduler keys all event timing off `audioContext.currentTime`, never off `setInterval`/`setTimeout` timing directly
- [Visual/audio desync] → visual indicator derives from the same schedule queue and `audioContext.currentTime`, not a separate timer
