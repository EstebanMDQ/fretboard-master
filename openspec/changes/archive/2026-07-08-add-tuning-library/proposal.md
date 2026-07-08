# Proposal: add-tuning-library

## Why

The app ships only two built-in tunings (guitar and ukulele) and lets the user hand-edit strings, but there is no way to jump to common alternate instruments (bass, 7-string) or to save a personal tuning and return to it later. A player who dials in a custom 7-string tuning loses it the moment they switch presets, since only the single "current config" is persisted.

## What Changes

- Add built-in preset tunings alongside the existing guitar and ukulele: **4-string bass** (E A D G), **5-string bass** (low B added), and **7-string guitar** (standard tuning with a low B). Refactor the hardcoded preset buttons into a data-driven list so presets are easy to add.
- Add a **tuning library**: the user can name and save the current instrument configuration to the browser, see their saved tunings listed, load any of them back into the fretboard, and delete ones they no longer want. Saved tunings persist across reloads in `localStorage`, separate from the "current config" key.
- Saving under a name that already exists overwrites that entry (upsert by name); saving with an empty name is disabled.

## Capabilities

### New Capabilities

- `tuning-library`: a set of selectable tunings - built-in presets plus user-created named tunings that persist in the browser and can be loaded or deleted

### Modified Capabilities

None. Applying a tuning reuses the existing `setInstrumentConfig` path from `instrument-config`; no existing requirement changes.

## Impact

- `src/theory/tunings.ts`: add bass and 7-string preset configs, a data-driven `BUILT_IN_TUNINGS` list, and a saved-tunings store (new versioned `localStorage` key `fretboard-master:tunings:v1`) with load/save/delete and validation reusing the existing `isValidInstrumentConfig`.
- `src/components/InstrumentPanel/InstrumentPanel.tsx` (+ CSS): render presets from the list, add a "save current as" name input and a saved-tunings list with load and delete controls.
- No changes to app state shape or the current-config persistence; no new dependencies. Pure client-side, consistent with the static-site architecture.
