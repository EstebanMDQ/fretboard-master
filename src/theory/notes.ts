export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type Accidental = -2 | -1 | 0 | 1 | 2

export interface Spelling {
  letter: Letter
  accidental: Accidental
}

export interface Marker {
  string: number
  fret: number
  label: string
  emphasis: boolean
  /** Relative interval (0-11) from the root; lets playback sync pulse every marker sharing a sounding degree. */
  degree?: number
  pulsing?: boolean
  /** Set on chord-shape extension tones (7ths, 9ths, ...) so they render distinctly from core triad tones. */
  extension?: boolean
}

const LETTER_ORDER: Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const NATURAL_PITCH_CLASS: Record<Letter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}

const ACCIDENTAL_SYMBOL: Record<Accidental, string> = {
  [-2]: 'bb',
  [-1]: 'b',
  [0]: '',
  [1]: '#',
  [2]: '##',
}

function mod12(value: number): number {
  return ((value % 12) + 12) % 12
}

export function pitchClassOfSpelling(spelling: Spelling): number {
  return mod12(NATURAL_PITCH_CLASS[spelling.letter] + spelling.accidental)
}

export function spellingToLabel(spelling: Spelling): string {
  return `${spelling.letter}${ACCIDENTAL_SYMBOL[spelling.accidental]}`
}

/** The 17 standard root spellings: naturals, plus 5 sharps and 5 flats. No enharmonic duplicates (e.g. no Cb, Fb, E#, B#). */
export const STANDARD_SPELLINGS: Spelling[] = [
  ...LETTER_ORDER.map((letter): Spelling => ({ letter, accidental: 0 })),
  ...(['C', 'D', 'F', 'G', 'A'] as const).map((letter): Spelling => ({ letter, accidental: 1 })),
  ...(['D', 'E', 'G', 'A', 'B'] as const).map((letter): Spelling => ({ letter, accidental: -1 })),
]

const DEGREE_LABEL_PATTERN = /^(b{1,2}|#{1,2})?(\d{1,2})$/

const MAJOR_SCALE_SEMITONES: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
}

function naturalSemitonesForDegree(degreeNumber: number): number {
  const genericStep = ((degreeNumber - 1) % 7) + 1
  const octaves = Math.floor((degreeNumber - 1) / 7)
  return MAJOR_SCALE_SEMITONES[genericStep] + octaves * 12
}

function accidentalOffsetFromPrefix(prefix: string | undefined): number {
  switch (prefix) {
    case '#':
      return 1
    case '##':
      return 2
    case 'b':
      return -1
    case 'bb':
      return -2
    default:
      return 0
  }
}

function clampAccidental(value: number): Accidental {
  if (value <= -2) return -2
  if (value >= 2) return 2
  return value as Accidental
}

/**
 * Spells a scale/chord degree relative to a root, e.g. spellDegree({letter:'G',accidental:0}, '7') => F#.
 * Degree-driven: there is no global sharp/flat preference, the spelling always follows from root + degree.
 */
export function spellDegree(rootSpelling: Spelling, degreeLabel: string): Spelling {
  const match = DEGREE_LABEL_PATTERN.exec(degreeLabel)
  if (!match) {
    throw new Error(`Invalid degree label: ${degreeLabel}`)
  }
  const [, accidentalPrefix, degreeNumberStr] = match
  const degreeNumber = Number(degreeNumberStr)
  const accidentalOffset = accidentalOffsetFromPrefix(accidentalPrefix)

  const rootPitchClass = pitchClassOfSpelling(rootSpelling)
  const targetPitchClass = mod12(rootPitchClass + naturalSemitonesForDegree(degreeNumber) + accidentalOffset)

  const rootLetterIndex = LETTER_ORDER.indexOf(rootSpelling.letter)
  const genericStep = (degreeNumber - 1) % 7
  const targetLetter = LETTER_ORDER[(rootLetterIndex + genericStep) % 7]

  const naturalTargetPitchClass = NATURAL_PITCH_CLASS[targetLetter]
  const rawAccidental = mod12(targetPitchClass - naturalTargetPitchClass + 6) - 6
  const accidental = clampAccidental(rawAccidental)

  return { letter: targetLetter, accidental }
}
