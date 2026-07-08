# Design: metronome-beat-presets

## Context

Per-beat muting already exists: `BeatAccent` includes `'mute'`, `cycleAccent` cycles accent -> normal -> mute, the engine silences muted beats (`metronome.ts:146`), and `defaultPattern` builds the standard beat-1-accent pattern. The only gaps are discoverability (nothing signals tap-to-mute) and speed (building a backbeat is several taps). This change adds pattern presets and a clearer muted-beat UI, with no engine work.

## Goals / Non-Goals

**Goals:**
- One-tap presets that set the full pattern for the current meter: all / backbeat / downbeat-only.
- Make muting discoverable via a hint and clearer muted-beat styling.

**Non-Goals:**
- No audio-engine or click-synthesis change - muting already works.
- No saving of user-named custom patterns (out of scope; this is quick presets only).
- No change to the subdivision or gap-training features.

## Decisions

- **Preset builders as pure functions** in `metronome.ts`, so they are testable and meter-aware:
  - "all" reuses the existing `defaultPattern(numerator, denominator)`.
  - `backbeatPattern(numerator)`: beats at even positions (1-indexed 2, 4, ...) `'normal'`, odd positions `'mute'`. If `numerator < 2`, fall back to `defaultPattern` (no backbeat possible).
  - `downbeatOnlyPattern(numerator)`: index 0 `'accent'`, the rest `'mute'`.
- **New reducer action `setBeatPattern`** carrying a full `BeatAccent[]`, since the current reducer only exposes `cycleBeatAccent` (single beat) and `setMeter` (regenerates the default). The preset buttons compute a pattern from the current numerator/denominator and dispatch it. Persistence is automatic via the existing metronome save effect.
- **Preset length always matches the current meter**: buttons build from `metronome.numerator`, so switching meter and re-applying yields a correctly sized pattern. Existing `setMeter` behavior (reset to default on meter change) is unchanged.
- **Discoverability UI**: add a short hint near the beats row ("tap a beat: accent -> normal -> mute") and strengthen the existing `metronome-panel__beat--mute` styling (e.g. dimmed/hollow) so muted beats read as off at a glance. No behavior change to the tap-to-cycle interaction.

## Directory layout

- `src/audio/metronome.ts`: add `backbeatPattern` and `downbeatOnlyPattern` pure helpers (reuse `defaultPattern` for "all").
- `src/state/appStateStore.ts`: add `setBeatPattern` action and reducer case.
- `src/components/MetronomePanel/MetronomePanel.tsx`: preset buttons dispatching `setBeatPattern`; add the tap hint.
- `src/components/MetronomePanel/MetronomePanel.css`: clearer muted-beat styling.
- `src/audio/metronome.test.ts`: cover the preset builders across meters (including the `numerator < 2` fallback).

## Risks / Trade-offs

- **"Backbeat" for odd meters** (e.g. 3/4, 5/4) is defined mechanically as "even positions sound" rather than a musical convention. Acceptable - it is predictable and the user can still hand-edit; documented here rather than special-cased.
- **Applying a preset overwrites a hand-built pattern** with no undo. Accepted: presets are explicit buttons and the user can re-edit beats individually afterward.
