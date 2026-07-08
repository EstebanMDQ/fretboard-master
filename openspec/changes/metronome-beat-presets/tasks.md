# Tasks: metronome-beat-presets

## 1. Preset builders

- [x] 1.1 Add pure `backbeatPattern(numerator)` (even positions sound, odd muted; fall back to `defaultPattern` when `numerator < 2`) in `metronome.ts`
- [x] 1.2 Add pure `downbeatOnlyPattern(numerator)` (beat 1 accent, rest muted)

## 2. State

- [x] 2.1 Add a `setBeatPattern` action and reducer case that replaces the full accent pattern

## 3. UI

- [x] 3.1 Add preset buttons (All / Backbeat / Downbeat only) that build a pattern from the current meter and dispatch `setBeatPattern`
- [x] 3.2 Add a tap hint ("tap a beat: accent -> normal -> mute") near the beats row
- [x] 3.3 Strengthen muted-beat styling in `MetronomePanel.css` so muted beats read as off

## 4. Verification

- [x] 4.1 Add Vitest coverage for `backbeatPattern` and `downbeatOnlyPattern` across meters, including the `numerator < 2` fallback
- [x] 4.2 Verify `npm test`, `npm run lint`, and `npm run build` pass
