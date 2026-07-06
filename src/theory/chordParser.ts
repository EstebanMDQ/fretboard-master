import { pitchClassOfSpelling, type Spelling } from './notes'
import { CHORD_QUALITIES, type ChordQuality } from './chords'
import { fallbackDegreeLabel } from './degrees'

export interface ChordParseSuccess {
  ok: true
  root: Spelling
  quality: ChordQuality
}

export interface ChordParseError {
  ok: false
  error: string
  root?: Spelling
}

export type ChordParseResult = ChordParseSuccess | ChordParseError

const ROOT_PATTERN = /^([A-G])(#{1,2}|b{1,2})?/

function accidentalSymbolToValue(symbol: string | undefined): Spelling['accidental'] {
  switch (symbol) {
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

function parseRoot(input: string): { root: Spelling; rest: string } | null {
  const match = ROOT_PATTERN.exec(input)
  if (!match) return null
  const [full, letter, accidentalSymbol] = match
  return {
    root: { letter: letter as Spelling['letter'], accidental: accidentalSymbolToValue(accidentalSymbol) },
    rest: input.slice(full.length),
  }
}

/** Maps common synonyms to the canonical suffix already present in CHORD_QUALITIES. */
const SUFFIX_SYNONYMS: Record<string, string> = {
  min: 'm',
  '-': 'm',
  M7: 'maj7',
  min7: 'm7',
  min7b5: 'm7b5',
  'm7-5': 'm7b5',
  min6: 'm6',
  M9: 'maj9',
  min9: 'm9',
  '+': 'aug',
}

function stripSlashBass(input: string): string {
  const slashIndex = input.indexOf('/')
  return slashIndex === -1 ? input : input.slice(0, slashIndex)
}

export function parseChordSymbol(input: string): ChordParseResult {
  const withoutBass = stripSlashBass(input.trim())

  const parsedRoot = parseRoot(withoutBass)
  if (!parsedRoot) {
    return { ok: false, error: 'Could not parse a root note' }
  }
  const { root, rest } = parsedRoot
  const normalizedRest = SUFFIX_SYNONYMS[rest] ?? rest

  const quality = CHORD_QUALITIES.find((q) => q.suffixes.includes(rest) || q.suffixes.includes(normalizedRest))
  if (!quality) {
    return { ok: false, error: `Unrecognized chord quality: "${rest}"`, root }
  }

  return { ok: true, root, quality }
}

export interface ResolvedChord {
  root: Spelling
  intervals: number[]
  degreeLabels: string[]
}

/**
 * Resolves the currently-playable chord for the arpeggio tool: a parsed symbol takes priority;
 * otherwise falls back to the note-by-note picks (pre-seeded with any root the parser did extract).
 */
export function resolveArpeggioChord(symbolInput: string, noteByNote: Spelling[]): ResolvedChord | null {
  const parsed = symbolInput.trim() ? parseChordSymbol(symbolInput) : null
  if (parsed?.ok) {
    return { root: parsed.root, intervals: parsed.quality.intervals, degreeLabels: parsed.quality.degreeLabels }
  }

  const notes = noteByNote.length > 0 ? noteByNote : parsed && !parsed.ok && parsed.root ? [parsed.root] : []
  if (notes.length === 0) return null

  const root = notes[0]
  const rootPitchClass = pitchClassOfSpelling(root)
  const intervals = notes.map((note) => (((pitchClassOfSpelling(note) - rootPitchClass) % 12) + 12) % 12)
  const degreeLabels = intervals.map(fallbackDegreeLabel)
  return { root, intervals, degreeLabels }
}
