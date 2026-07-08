# Design: add-tuning-library

## Context

`tunings.ts` exposes two hardcoded preset configs (`GUITAR_STANDARD`, `UKULELE_STANDARD`) that `InstrumentPanel` wires to two hardcoded buttons, plus load/save of a single "current config" to `localStorage` (`fretboard-master:config:v1`). This change adds more presets and a persisted library of user-named tunings. It reuses the existing config shape (`InstrumentConfig`) and the existing validation (`isValidInstrumentConfig`) unchanged.

## Goals / Non-Goals

**Goals:**
- Add bass (4- and 5-string) and 7-string guitar presets, selectable like the existing ones.
- Let the user save the current configuration under a name, load it back, and delete it, persisted across reloads.
- Keep presets data-driven so future tunings are a one-line addition.

**Non-Goals:**
- No change to `AppState`/reducer shape - the library is local to `InstrumentPanel`, and applying a tuning reuses the existing `onChange`/`setInstrumentConfig` path.
- No import/export/sharing of tunings, no cloud sync (pure client-side, static site).
- No new "tuning" data type distinct from `InstrumentConfig` - a saved tuning stores the full config (strings + fret count), consistent with how the built-in presets are defined.

## Decisions

- **Preset configs and octaves** (scientific pitch, matching `GUITAR_STANDARD` where high E = E4, low E = E2). Strings are in physical order, index 0 = string 1 = highest:
  - `BASS_4_STANDARD`: G2, D2, A1, E1 (E A D G, an octave below the guitar's bottom four).
  - `BASS_5_STANDARD`: G2, D2, A1, E1, B0 (adds a low B below the E).
  - `GUITAR_7_STANDARD`: E4, B3, G3, D3, A2, E2, B1 (standard guitar with a low B added below the low E).
  - Fret counts are just editable defaults: 24 for the basses and the 7-string; the existing guitar (15) and ukulele (12) are unchanged.
- **Data-driven presets**: introduce `BUILT_IN_TUNINGS: NamedTuning[]` where `NamedTuning = { name: string; config: InstrumentConfig }`. `InstrumentPanel` maps over it to render preset buttons instead of hardcoding them. Keep the existing named `*_STANDARD` exports (they are referenced elsewhere, e.g. as the load fallback and in tests).
- **Saved-tunings store**: new module-level functions in `tunings.ts` backed by a new versioned key `fretboard-master:tunings:v1`, kept separate from the current-config key so the two never clash:
  - `loadSavedTunings(): NamedTuning[]` - parse an array, validate each entry (non-empty `name` string + `isValidInstrumentConfig(config)`), skip invalid entries, return `[]` on any failure.
  - `saveSavedTunings(list: NamedTuning[]): void` - same try/catch graceful-degradation pattern as `saveInstrumentConfig`.
  - Pure helpers `upsertTuning(list, entry)` (replace by exact name match, else append) and `deleteTuning(list, name)` for testability.
- **Library lives in local component state**: `InstrumentPanel` holds the saved list via `useState(() => loadSavedTunings())` and calls `saveSavedTunings` after each mutation. This keeps the reducer untouched and the change localized. The current config continues to flow through props.
- **Overwrite semantics**: saving is upsert-by-name; an existing name is overwritten in place. Save is disabled when the trimmed name is empty.

## Directory layout

- `src/theory/tunings.ts`: add the three preset configs, `NamedTuning`, `BUILT_IN_TUNINGS`, `TUNINGS_STORAGE_KEY`, `loadSavedTunings`, `saveSavedTunings`, `upsertTuning`, `deleteTuning`, and validation helpers.
- `src/theory/tunings.test.ts`: extend with preset shape checks and library load/save/upsert/delete/validation coverage.
- `src/components/InstrumentPanel/InstrumentPanel.tsx` (+ `.css`): render presets from `BUILT_IN_TUNINGS`; add a save-as name input and a saved-tunings list with Load and Delete controls.

## Risks / Trade-offs

- **Silent overwrite on duplicate name** could lose a saved tuning. Trade-off accepted for simplicity: the save is an explicit user action with the name visible; no confirm dialog. Revisit if it proves error-prone.
- **Very low octaves (B0/E1)** exist only for audio playback; the fretboard note math is pitch-class only and unaffected. The audio engine simply produces low frequencies, which is correct for bass.
- **Local component state for the library** means the saved list is not part of the central store. Acceptable because nothing else needs to read it; if a future feature does, it can be lifted into `AppState` then.
