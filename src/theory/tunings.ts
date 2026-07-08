import { pitchClassOfSpelling, type Spelling } from './notes'

export interface StringConfig {
  spelling: Spelling
  octave: number
}

/** Strings are in physical order: index 0 (string 1) renders at the bottom of the fretboard. */
export interface InstrumentConfig {
  strings: StringConfig[]
  fretCount: number
}

export interface FretboardPosition {
  string: number
  fret: number
  pitchClass: number
}

export const GUITAR_STANDARD: InstrumentConfig = {
  strings: [
    { spelling: { letter: 'E', accidental: 0 }, octave: 4 },
    { spelling: { letter: 'B', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'G', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'D', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'A', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'E', accidental: 0 }, octave: 2 },
  ],
  fretCount: 15,
}

/** Reentrant tuning: string 4 (G) is tuned above string 3 (C). */
export const UKULELE_STANDARD: InstrumentConfig = {
  strings: [
    { spelling: { letter: 'A', accidental: 0 }, octave: 4 },
    { spelling: { letter: 'E', accidental: 0 }, octave: 4 },
    { spelling: { letter: 'C', accidental: 0 }, octave: 4 },
    { spelling: { letter: 'G', accidental: 0 }, octave: 4 },
  ],
  fretCount: 12,
}

/** 4-string bass, standard EADG, one octave below the guitar's bottom four strings. */
export const BASS_4_STANDARD: InstrumentConfig = {
  strings: [
    { spelling: { letter: 'G', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'D', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'A', accidental: 0 }, octave: 1 },
    { spelling: { letter: 'E', accidental: 0 }, octave: 1 },
  ],
  fretCount: 24,
}

/** 5-string bass: 4-string bass with a low B added below the E. */
export const BASS_5_STANDARD: InstrumentConfig = {
  strings: [
    { spelling: { letter: 'G', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'D', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'A', accidental: 0 }, octave: 1 },
    { spelling: { letter: 'E', accidental: 0 }, octave: 1 },
    { spelling: { letter: 'B', accidental: 0 }, octave: 0 },
  ],
  fretCount: 24,
}

/** 7-string guitar: standard guitar tuning with a low B added below the low E. */
export const GUITAR_7_STANDARD: InstrumentConfig = {
  strings: [
    { spelling: { letter: 'E', accidental: 0 }, octave: 4 },
    { spelling: { letter: 'B', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'G', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'D', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'A', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'E', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'B', accidental: 0 }, octave: 1 },
  ],
  fretCount: 24,
}

export interface NamedTuning {
  name: string
  config: InstrumentConfig
}

/** Built-in presets, rendered in order as quick-select buttons. */
export const BUILT_IN_TUNINGS: NamedTuning[] = [
  { name: 'Guitar', config: GUITAR_STANDARD },
  { name: 'Ukulele', config: UKULELE_STANDARD },
  { name: 'Bass (4-string)', config: BASS_4_STANDARD },
  { name: 'Bass (5-string)', config: BASS_5_STANDARD },
  { name: 'Guitar (7-string)', config: GUITAR_7_STANDARD },
]

/** Open pitch classes of standard 6-string guitar tuning, high-to-low: E B G D A E. */
const STANDARD_GUITAR_PITCH_CLASSES = [4, 11, 7, 2, 9, 4]

/**
 * True when the config is standard 6-string guitar tuning by open pitch class (octave ignored).
 * CAGED shape geometry is pitch-class based, so this is the gate for the Chords tool.
 */
export function isStandardGuitarTuning(config: InstrumentConfig): boolean {
  if (config.strings.length !== STANDARD_GUITAR_PITCH_CLASSES.length) return false
  return config.strings.every(
    (string, index) => pitchClassOfSpelling(string.spelling) === STANDARD_GUITAR_PITCH_CLASSES[index],
  )
}

export function positionsForPitchClasses(config: InstrumentConfig, pitchClasses: number[]): FretboardPosition[] {
  const targetSet = new Set(pitchClasses.map((pitchClass) => ((pitchClass % 12) + 12) % 12))
  const positions: FretboardPosition[] = []

  config.strings.forEach((stringConfig, stringIndex) => {
    const openPitchClass = pitchClassOfSpelling(stringConfig.spelling)
    for (let fret = 0; fret <= config.fretCount; fret++) {
      const pitchClass = ((openPitchClass + fret) % 12 + 12) % 12
      if (targetSet.has(pitchClass)) {
        positions.push({ string: stringIndex, fret, pitchClass })
      }
    }
  })

  return positions
}

const STORAGE_KEY = 'fretboard-master:config:v1'

const VALID_LETTERS = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
const VALID_ACCIDENTALS = new Set([-2, -1, 0, 1, 2])

function isValidSpelling(value: unknown): value is Spelling {
  if (typeof value !== 'object' || value === null) return false
  const spelling = value as Record<string, unknown>
  return (
    typeof spelling.letter === 'string' &&
    VALID_LETTERS.has(spelling.letter) &&
    typeof spelling.accidental === 'number' &&
    VALID_ACCIDENTALS.has(spelling.accidental)
  )
}

function isValidStringConfig(value: unknown): value is StringConfig {
  if (typeof value !== 'object' || value === null) return false
  const stringConfig = value as Record<string, unknown>
  return isValidSpelling(stringConfig.spelling) && typeof stringConfig.octave === 'number'
}

function isValidInstrumentConfig(value: unknown): value is InstrumentConfig {
  if (typeof value !== 'object' || value === null) return false
  const config = value as Record<string, unknown>
  return (
    Array.isArray(config.strings) &&
    config.strings.length > 0 &&
    config.strings.every(isValidStringConfig) &&
    typeof config.fretCount === 'number' &&
    config.fretCount > 0
  )
}

export function loadInstrumentConfig(): InstrumentConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return GUITAR_STANDARD
    const parsed: unknown = JSON.parse(raw)
    return isValidInstrumentConfig(parsed) ? parsed : GUITAR_STANDARD
  } catch {
    return GUITAR_STANDARD
  }
}

export function saveInstrumentConfig(config: InstrumentConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) - config just won't persist
  }
}

const TUNINGS_STORAGE_KEY = 'fretboard-master:tunings:v1'

function isValidNamedTuning(value: unknown): value is NamedTuning {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return typeof entry.name === 'string' && entry.name.trim().length > 0 && isValidInstrumentConfig(entry.config)
}

/** Loads the user's saved tuning library, skipping any entries that fail validation. */
export function loadSavedTunings(): NamedTuning[] {
  try {
    const raw = localStorage.getItem(TUNINGS_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidNamedTuning)
  } catch {
    return []
  }
}

export function saveSavedTunings(tunings: NamedTuning[]): void {
  try {
    localStorage.setItem(TUNINGS_STORAGE_KEY, JSON.stringify(tunings))
  } catch {
    // localStorage unavailable - saved tunings just won't persist
  }
}

/** Adds an entry, replacing any existing entry with the same name. */
export function upsertTuning(list: NamedTuning[], entry: NamedTuning): NamedTuning[] {
  const index = list.findIndex((tuning) => tuning.name === entry.name)
  if (index === -1) return [...list, entry]
  return list.map((tuning, i) => (i === index ? entry : tuning))
}

export function deleteTuning(list: NamedTuning[], name: string): NamedTuning[] {
  return list.filter((tuning) => tuning.name !== name)
}
