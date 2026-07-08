# Proposal: metronome-subdivisions

## Why

The metronome clicks once per counted beat, so a player can only practice against the pulse itself. Practicing time and feel needs subdivisions: hearing the same meter as straight 8ths, triplets, or a swing feel makes the metronome far more useful for internalizing rhythm.

## What Changes

- Add a subdivision "feel" that layers extra clicks inside each counted beat, selectable in the metronome:
  - **Quarter** (none): one click per beat, the current behavior.
  - **Straight 8ths**: an extra click at the halfway point of each beat.
  - **Triplets**: two extra clicks at the 1/3 and 2/3 points of each beat.
  - **Swing 8ths**: an extra click at a 2:1 (triplet-based) offbeat position, i.e. ~2/3 of the way through the beat.
- Subdivision clicks use a quieter, distinct voice so the main beat is still clearly the beat.
- Subdivisions respect the beat's accent state: a muted beat (per-beat mute or gap training) plays no subdivisions either.
- The visual beat indicator continues to track main beats only; subdivision clicks are audio-only.
- The selected subdivision persists across reloads alongside tempo/meter/pattern.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `metronome`: add a subdivision/feel layer (quarter, straight 8th, triplet, swing) to click synthesis, persisted with the other metronome settings

## Impact

- `src/audio/metronome.ts`: add a `subdivision` field to `MetronomeSettings`/`MetronomeLiveSettings`; extend the engine to schedule intra-beat subdivision clicks at feel-specific offsets; add validation and default; keep main-beat scheduling (and `beatIndex`/`recentBeats`) as the driver of the visual indicator.
- `src/audio/voices.ts`: allow a quieter/distinct subdivision click (e.g. a gain/volume parameter on `playClick`).
- `src/state/appStateStore.ts`: add `subdivision` to `MetronomeToolState`, a `setSubdivision` action, and thread it into `MetronomeLiveSettings`.
- `src/components/MetronomePanel/MetronomePanel.tsx`: add a subdivision selector.
- `src/audio/metronome.test.ts`: cover subdivision offset generation and mute interaction. No new dependencies.
