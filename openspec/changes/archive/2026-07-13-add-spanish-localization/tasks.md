## 1. i18n infrastructure

- [x] 1.1 Create `src/i18n/types.ts` - define the `Translations` interface with a key for every user-visible string across all components (AppShell, ScalePanel, ArpeggioPanel, ChordsPanel, VoicingsPanel, InstrumentPanel, MetronomePanel)
- [x] 1.2 Create `src/i18n/en.ts` - export `en: Translations` with all English strings
- [x] 1.3 Create `src/i18n/es.ts` - export `es: Translations` with all Spanish translations
- [x] 1.4 Create `src/i18n/I18nContext.tsx` - `I18nProvider` component that detects locale from `localStorage` then `navigator.language`, holds locale state, and exposes a `setLocale` setter via a second context
- [x] 1.5 Create `src/i18n/useTranslation.ts` - `useTranslation()` hook returning the active `Translations` object; `useSetLocale()` hook returning the setter

## 2. Language toggle in AppShell header

- [x] 2.1 Wrap the app root (in `main.tsx` or `App.tsx`) with `<I18nProvider>`
- [x] 2.2 Add a language toggle (EN / ES buttons or a `<select>`) to the `AppShell` header that calls `useSetLocale()` and writes to `localStorage`

## 3. Translate AppShell strings

- [x] 3.1 Replace hardcoded tab labels ("Scales", "Arpeggios", "Chords", "Voicings") with `t.tabScales` etc.
- [x] 3.2 Replace "Labels", "Note names", "Scale degrees" with translation keys

## 4. Translate ScalePanel strings

- [x] 4.1 Replace panel title, Root label, Scale label, Direction label, and direction option text with translation keys
- [x] 4.2 Replace "Custom scale tones" legend and Play/Restart button text

## 5. Translate ArpeggioPanel strings

- [x] 5.1 Replace panel title, "Chord symbol" label, placeholder text, hint text, "Add note..." placeholder, Clear button, Direction options, Play/Restart button text
- [x] 5.2 Replace the parse error passthrough (error message comes from `chordParser` - keep in English as it is a technical string, or add a generic "Invalid chord symbol" translation)

## 6. Translate ChordsPanel strings

- [x] 6.1 Replace panel title, "Chord symbol" label, placeholder, hint text, "No CAGED shapes fit" message, "not supported" message, position label format strings, and "Position X of Y" counter

## 7. Translate VoicingsPanel strings

- [x] 7.1 Replace panel title, "Chord symbol" label, placeholder, hint text, "No playable voicing" and "No voicings match filters" messages, shape count label, and filter chip labels
- [x] 7.2 Replace tag labels (open, spread, close, rootless, no 5th, skip, stretch) in the `TAG_LABEL` map

## 8. Translate InstrumentPanel strings

- [x] 8.1 Replace panel title, "Name this tuning" placeholder, "Save" button, "Frets" label, "Strings (1 = top)" legend, and "Add string" button
- [x] 8.2 Replace the `aria-label` for "Delete tuning X" and "Remove string X" (use template strings with the name/number interpolated)

## 9. Translate MetronomePanel strings

- [x] 9.1 Replace "Metronome", Tempo, Beats, Note value, Feel labels and subdivision option text ("Quarter", "Straight 8ths", "Triplets", "Swing 8ths")
- [x] 9.2 Replace beat pattern preset button labels ("All beats", "Backbeat", "Downbeat only"), "Gap training" checkbox label, Play/Mute labels, and the hint text
- [x] 9.3 Replace Play/Stop button text

## 10. Verify

- [x] 10.1 Run `npm run build` and confirm TypeScript compiles with no errors (both locale files fully satisfy `Translations`)
- [x] 10.2 Run `npm test` to confirm no regressions in music theory tests
- [x] 10.3 Manually verify in browser: switch to Spanish and confirm all panels update; reload page and confirm Spanish persists; switch back to English
- [x] 10.4 Test with `navigator.language` mocked as `"es-ES"` (open in a browser with Spanish set as preferred language) to confirm auto-detection
