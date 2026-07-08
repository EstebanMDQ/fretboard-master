# Design: metronome-subdivisions

## Context

The engine (`createMetronomeEngine`) schedules exactly one click per counted beat inside `scheduleUpcomingBeats`: it advances `nextBeatTime` by `secondsPerClick(tempoBpm, denominator)`, records each beat into `recentBeats` (which drives the rAF visual indicator), and plays an accent/normal click or nothing for muted beats. This change layers extra intra-beat clicks without disturbing that main-beat accounting.

## Goals / Non-Goals

**Goals:**
- Add quarter / straight-8th / triplet / swing-8th feels within the current meter.
- Keep the visual indicator and `beatIndex`/`recentBeats` logic tracking main beats only.
- Persist the choice with existing settings; restore stopped.

**Non-Goals:**
- No adjustable swing percentage - swing is a fixed 2:1 (triplet-based) feel for now; a variable swing ratio is a future change.
- No per-subdivision accenting or muting, and no visual subdivision indicator.
- No special-casing of compound meters (see risks).

## Decisions

- **`subdivision` setting**: add `type Subdivision = 'quarter' | 'eighth' | 'triplet' | 'swing'` to `MetronomeSettings`, `MetronomeLiveSettings`, and `MetronomeToolState`, with a `setSubdivision` action, validation (`isValidSubdivision`), a default of `'quarter'` (preserving current behavior), and persistence through the existing save/load path.
- **Offset table (fractions of one beat interval)**: a pure helper `subdivisionOffsets(subdivision): number[]` returns the *extra* click offsets after the main beat at 0:
  - `quarter` -> `[]`
  - `eighth` -> `[0.5]`
  - `triplet` -> `[1/3, 2/3]`
  - `swing` -> `[2/3]`
  Keeping this a pure function makes it directly unit-testable and isolates the musical definition.
- **Scheduling**: in `scheduleUpcomingBeats`, keep the main-beat schedule/record exactly as today (it remains the sole writer of `recentBeats` and `beatIndex`, so the visual indicator is unchanged). When the beat is not muted, additionally schedule audio-only clicks at `time + offset * beatInterval` for each offset from the table, where `beatInterval = secondsPerClick(...)`. These extra clicks do **not** call `recordBeat` and do not touch `beatIndex`.
- **Mute interaction**: compute `muted` once (accent `mute` or `isGapMuted`) and gate both the main click and all subdivision clicks on it, so a silent beat is fully silent.
- **Subdivision voice**: subdivisions are quieter and distinct from the main click. Extend `playClick(time, freq)` with an optional gain/volume parameter (default preserves current loudness) and call it for subdivisions with a reduced gain and a subdivision frequency (e.g. ~1000-1200Hz, clearly below the accent click). Main-beat accent/normal clicks are unchanged.

## Directory layout

- `src/audio/metronome.ts`: add `Subdivision`, `subdivisionOffsets`, the `subdivision` field on settings/live-settings, validation + default, and the extra scheduling loop.
- `src/audio/voices.ts`: add a gain/volume parameter to the click voice.
- `src/state/appStateStore.ts`: `MetronomeToolState.subdivision`, `setSubdivision` action, live-settings threading.
- `src/components/MetronomePanel/MetronomePanel.tsx`: subdivision `<select>` wired to `setSubdivision`.
- `src/audio/metronome.test.ts`: cover `subdivisionOffsets` for each feel and the muted-beat suppression.

## Risks / Trade-offs

- **Compound meters (e.g. 6/8)**: the subdivision divides each *counted* beat, so triplets in 6/8 subdivide each eighth into three - musically dense but well-defined. Accepted; not special-cased.
- **Very fast subdivisions** at high tempo could crowd the click voice. The lookahead scheduler already batches per generator tick; extra events are scheduled at absolute times, so timing stays sample-accurate. Watch for audible clutter and keep the subdivision voice quiet.
- **Adding a parameter to `playClick`** could affect existing call sites → make the gain parameter optional with a default equal to today's level so main-beat and any other callers are unchanged.
