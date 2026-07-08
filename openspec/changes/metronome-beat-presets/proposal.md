# Proposal: metronome-beat-presets

## Why

The metronome already supports silencing individual beats (tap a beat to cycle accent -> normal -> mute), which is exactly what "play only 2 and 4" or "only the downbeat" needs. But it is not discoverable - nothing tells the user tapping mutes, and building a backbeat means several taps. Quick presets and a clearer muted-beat affordance make this existing capability usable.

## What Changes

- Add beat-pattern preset buttons that set the whole per-beat pattern for the current meter in one click:
  - **All beats**: every beat sounds, beat 1 accented (the current default pattern).
  - **Backbeat**: only the even-numbered beats sound (2 & 4 in 4/4); odd beats muted.
  - **Downbeat only**: beat 1 accented, all other beats muted.
- Make muting discoverable: label the beats row with a hint that tapping cycles accent -> normal -> mute, and style muted beats so they read clearly as "off".
- No audio-engine change - muting already works; this adds a way to set patterns quickly and a clearer UI.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `metronome`: add one-tap beat-pattern presets (all / backbeat / downbeat-only) that set the full accent pattern, and a clearer muted-beat affordance

## Impact

- `src/audio/metronome.ts`: add pure helpers that build preset patterns from the numerator (e.g. `backbeatPattern(numerator)`, `downbeatOnlyPattern(numerator)`); reuse the existing `defaultPattern` for "all".
- `src/state/appStateStore.ts`: add a `setBeatPattern` action to set the full pattern (persisted via the existing pattern persistence).
- `src/components/MetronomePanel/MetronomePanel.tsx` (+ `.css`): render preset buttons, add the tap hint, and strengthen the muted-beat styling. No engine or audio changes; no new dependencies.
