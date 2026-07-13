## Context

All UI strings are hardcoded directly in component JSX. There is no abstraction layer for text - no i18n library, no string constants file, no translation mechanism. The project has no existing dependencies beyond React, and the conventions favor simple solutions.

## Goals / Non-Goals

**Goals:**
- Support English and Spanish with browser auto-detection
- Manual language override persisted to `localStorage`
- Zero new npm packages
- TypeScript-strict: every key in the translation dictionary is type-checked; missing keys are compile errors

**Non-Goals:**
- Supporting more than two languages in this change (the architecture should allow adding more, but only en/es are delivered)
- Pluralization rules or ICU message format - all strings in this app are simple static labels
- Right-to-left layout support
- Translating music theory identifiers (note names, chord symbols, degree labels, tuning names)

## Decisions

### 1. No external i18n library

Libraries like `react-i18next` or `lingui` add significant bundle weight and configuration for what amounts to a typed dictionary lookup. The app's strings are all simple labels with no interpolation, pluralization, or date formatting. A plain TypeScript object with a `useTranslation` hook covers every use case here.

**Alternative considered:** `react-i18next` - rejected because it would be the only non-React runtime dependency and adds ~30KB for features we don't need.

### 2. Dictionary shape: flat keyed object per locale

```ts
// src/i18n/types.ts
export interface Translations {
  // AppShell
  tabScales: string
  tabArpeggios: string
  tabChords: string
  tabVoicings: string
  labelsLabel: string
  labelNoteNames: string
  labelScaleDegrees: string
  // ScalePanel
  panelScaleTitle: string
  scaleRoot: string
  scaleScale: string
  scaleDirection: string
  directionAscending: string
  directionDescending: string
  directionBoth: string
  scaleCustomTones: string
  playBtn: string
  restartBtn: string
  // ... all other strings
}
```

Flat over nested: every key is unique app-wide, nesting adds noise without benefit for this scale. TypeScript enforces completeness - both `en.ts` and `es.ts` must satisfy `Translations`.

### 3. Context + hook pattern

```ts
// src/i18n/I18nContext.tsx
const I18nContext = createContext<Translations>(en)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<'en' | 'es'>(() => detectLocale())
  const t = locale === 'es' ? es : en
  // expose setLocale through a separate context or combine them
  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>
}

// src/i18n/useTranslation.ts
export function useTranslation() {
  return useContext(I18nContext)
}
```

Components call `const t = useTranslation()` and use `t.tabScales` etc. No string interpolation needed.

**Alternative considered:** Passing translations as props - rejected because it would require threading through every component layer; context is the right React pattern here.

### 4. Language detection order

1. Check `localStorage.getItem('locale')` - user override takes precedence
2. Check `navigator.language` / `navigator.languages` - use first `es` match for Spanish, first `en` match for English
3. Default to English

### 5. Language toggle placement

A small `<select>` or two-button toggle (EN | ES) in the `AppShell` header, to the right of the title. Dispatches a `setLocale` call that updates context state and persists to `localStorage`.

**Alternative considered:** Detecting-only with no manual override - rejected per the spec requirement that users can override.

### 6. Scale preset name translation

Scale preset names (e.g. "Major (Ionian)", "Dorian") are part of the `SCALE_PRESETS` data structure. Rather than duplicating the entire preset list, each preset gets a translation key (e.g. `scaleMajorIonian`, `scaleDorian`). The `ScalePanel` looks up `t[preset.nameKey]` instead of `preset.name`. The `Scale` interface gains an optional `nameKey: keyof Translations` field; the presets without a key fall back to `preset.name`.

**Simpler alternative:** Keep scale names in English and only translate labels/buttons - deferred to avoid scope creep; the spec requires all user-visible strings to be translated.

## Risks / Trade-offs

- [Risk] Flat dictionary grows large as strings accumulate - Mitigation: acceptable for this app's scale; restructure to namespaced keys if it exceeds ~100 entries
- [Risk] A developer adds a new string in English without adding the Spanish translation - Mitigation: TypeScript enforces both locale files satisfy the `Translations` interface; CI will catch omissions at build time
- [Risk] Scale preset name keys must stay in sync between `scales.ts` and both locale files - Mitigation: the `nameKey` field is typed as `keyof Translations`, so typos are compile errors
