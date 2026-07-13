## Why

All UI text is hardcoded in English, making the app inaccessible to Spanish-speaking guitarists. Adding Spanish and auto-detecting the browser language removes that barrier without requiring any user action.

## What Changes

- Add a lightweight i18n system (no external library - a typed dictionary + React context) with English and Spanish translation files
- Auto-detect the preferred language from `navigator.language` on load; default to English if neither `es` nor `en` matches
- Add a manual language toggle in the app header so users can override the detected language
- Translate all user-visible strings across all panels: AppShell, ScalePanel, ArpeggioPanel, ChordsPanel, VoicingsPanel, InstrumentPanel, MetronomePanel
- Scale preset names, direction options, filter labels, and subdivision labels are all translated
- Error messages and hint text are translated

**Not changing:**
- Music theory data (note names, chord symbols, degree labels stay in universal notation)
- Built-in tuning names (e.g. "Standard", "Drop D") - these are proper names, not translated
- The app title "fretboard-master"

## Capabilities

### New Capabilities

- `i18n`: Translation system - typed dictionary interface, English and Spanish locale files, React context for providing the active locale, `useTranslation` hook for consuming strings in components, and browser language auto-detection on load with manual override stored in `localStorage`.

### Modified Capabilities

None - no existing spec-level requirements change. All panels gain i18n support as an implementation detail.

## Impact

- `src/i18n/` - new directory: `types.ts` (dictionary interface), `en.ts`, `es.ts`, `I18nContext.tsx`, `useTranslation.ts`
- All `.tsx` files in `src/components/` - replace hardcoded strings with translation hook calls
- `src/components/AppShell/AppShell.tsx` - add language toggle button to header
- No new npm dependencies
- No changes to music theory logic, state, or audio engine
