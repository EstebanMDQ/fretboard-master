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
