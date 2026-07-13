# i18n Specification

## Purpose
TBD - created by archiving change add-spanish-localization. Update Purpose after archive.
## Requirements
### Requirement: Typed translation dictionary
The system SHALL define a `Translations` TypeScript interface that covers every user-visible string in the UI. Both the English and Spanish locale objects SHALL satisfy this interface; a missing key SHALL be a compile error.

#### Scenario: Complete locale files compile
- **WHEN** the project is built
- **THEN** `tsc` succeeds only if both `en.ts` and `es.ts` export objects that fully satisfy the `Translations` interface

#### Scenario: Using a translation key
- **WHEN** a component calls `const t = useTranslation()` and accesses `t.tabScales`
- **THEN** TypeScript infers the type as `string` and the value is the locale-appropriate label

### Requirement: Browser language auto-detection
The system SHALL detect the user's preferred language from `navigator.language` / `navigator.languages` on initial load. If any of the user's preferred languages starts with `es`, the app SHALL default to Spanish. Otherwise it SHALL default to English.

#### Scenario: Spanish browser
- **WHEN** `navigator.language` is `"es-ES"` or `navigator.languages` includes `"es"` and no `localStorage` override exists
- **THEN** the app loads in Spanish

#### Scenario: Non-Spanish, non-English browser
- **WHEN** `navigator.language` is `"fr-FR"` and no override exists
- **THEN** the app loads in English

#### Scenario: localStorage override takes precedence
- **WHEN** `localStorage.getItem('locale')` is `"en"` and `navigator.language` is `"es-ES"`
- **THEN** the app loads in English

### Requirement: Manual language toggle
The system SHALL display a language toggle in the app header that lets the user switch between English and Spanish. The selected language SHALL be persisted to `localStorage` under the key `"locale"` so it survives page reloads.

#### Scenario: Switching to Spanish
- **WHEN** the user selects Spanish via the language toggle
- **THEN** all UI labels update immediately to Spanish without a page reload

#### Scenario: Switching to English
- **WHEN** the user selects English via the language toggle
- **THEN** all UI labels update immediately to English without a page reload

#### Scenario: Persistence across reloads
- **WHEN** the user selects Spanish and then reloads the page
- **THEN** the app loads in Spanish

### Requirement: All UI strings translated
The system SHALL provide Spanish translations for every user-visible string in the application, including panel titles, field labels, button text, dropdown options, hint text, and error messages. Music notation identifiers (note names, chord symbols, degree labels) SHALL remain untranslated.

#### Scenario: Scale panel in Spanish
- **WHEN** the language is Spanish
- **THEN** the Scale panel title shows "Escala", the Root label shows "Tonica", the Direction label shows "Direccion", and Play/Restart buttons show "Reproducir"/"Reiniciar"

#### Scenario: Tab labels in Spanish
- **WHEN** the language is Spanish
- **THEN** the navigation tabs show "Escalas", "Arpegios", "Acordes", "Voicings" (Voicings has no standard Spanish translation; keep as-is)

#### Scenario: Metronome panel in Spanish
- **WHEN** the language is Spanish
- **THEN** the Metronome toggle shows "Metronomo", Tempo shows "Tempo", Beats shows "Tiempos", Feel shows "Ritmo", and Play/Stop show "Reproducir"/"Detener"

#### Scenario: Note names and degrees are not translated
- **WHEN** the language is Spanish
- **THEN** note names (C, D#, Bb), chord symbols (Cmaj7), and degree labels (b3, #4) remain unchanged

