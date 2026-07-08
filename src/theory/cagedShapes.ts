import {
  pitchClassOfSpelling,
  spellDegree,
  spellingToLabel,
  type Marker,
  type Spelling,
} from './notes'
import { isStandardGuitarTuning, type InstrumentConfig } from './tunings'
import { parseChordSymbol } from './chordParser'
import type { DisplayMode } from './scales'

export type ShapeName = 'C' | 'A' | 'G' | 'E' | 'D'
export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented'
type ShapeDegree = 1 | 3 | 5

interface ShapeStringTemplate {
  /** 0 = high E (string 1), 5 = low E (string 6). */
  stringIndex: number
  degree: ShapeDegree
  /** Fret relative to the anchor-string root fret, for the MAJOR triad. */
  fretOffset: number
}

interface ShapeTemplate {
  name: ShapeName
  /** String carrying the reference root (degree 1, offset 0). */
  anchorStringIndex: number
  strings: ShapeStringTemplate[]
}

/**
 * The five movable CAGED shapes as MAJOR-triad templates (offsets relative to the anchor-string
 * root fret). Minor/diminished/augmented are derived from these by altering degree offsets.
 */
const MAJOR_SHAPE_TEMPLATES: ShapeTemplate[] = [
  {
    name: 'E',
    anchorStringIndex: 5,
    strings: [
      { stringIndex: 5, degree: 1, fretOffset: 0 },
      { stringIndex: 4, degree: 5, fretOffset: 2 },
      { stringIndex: 3, degree: 1, fretOffset: 2 },
      { stringIndex: 2, degree: 3, fretOffset: 1 },
      { stringIndex: 1, degree: 5, fretOffset: 0 },
      { stringIndex: 0, degree: 1, fretOffset: 0 },
    ],
  },
  {
    name: 'A',
    anchorStringIndex: 4,
    strings: [
      { stringIndex: 4, degree: 1, fretOffset: 0 },
      { stringIndex: 3, degree: 5, fretOffset: 2 },
      { stringIndex: 2, degree: 1, fretOffset: 2 },
      { stringIndex: 1, degree: 3, fretOffset: 2 },
      { stringIndex: 0, degree: 5, fretOffset: 0 },
    ],
  },
  {
    name: 'D',
    anchorStringIndex: 3,
    strings: [
      { stringIndex: 3, degree: 1, fretOffset: 0 },
      { stringIndex: 2, degree: 5, fretOffset: 2 },
      { stringIndex: 1, degree: 1, fretOffset: 3 },
      { stringIndex: 0, degree: 3, fretOffset: 2 },
    ],
  },
  {
    name: 'C',
    anchorStringIndex: 4,
    strings: [
      { stringIndex: 4, degree: 1, fretOffset: 0 },
      { stringIndex: 3, degree: 3, fretOffset: -1 },
      { stringIndex: 2, degree: 5, fretOffset: -3 },
      { stringIndex: 1, degree: 1, fretOffset: -2 },
      { stringIndex: 0, degree: 3, fretOffset: -3 },
    ],
  },
  {
    name: 'G',
    anchorStringIndex: 5,
    strings: [
      { stringIndex: 5, degree: 1, fretOffset: 0 },
      { stringIndex: 4, degree: 3, fretOffset: -1 },
      { stringIndex: 3, degree: 5, fretOffset: -3 },
      { stringIndex: 2, degree: 1, fretOffset: -3 },
      { stringIndex: 1, degree: 3, fretOffset: -3 },
      { stringIndex: 0, degree: 1, fretOffset: 0 },
    ],
  },
]

/** Derives a quality's shape from the major template by shifting the third and/or fifth. */
export function alterDegrees(template: ShapeTemplate, quality: TriadQuality): ShapeTemplate {
  const shift = (degree: ShapeDegree): number => {
    if (degree === 3 && (quality === 'minor' || quality === 'diminished')) return -1
    if (degree === 5 && quality === 'diminished') return -1
    if (degree === 5 && quality === 'augmented') return 1
    return 0
  }
  return {
    ...template,
    strings: template.strings.map((string) => ({
      ...string,
      fretOffset: string.fretOffset + shift(string.degree),
    })),
  }
}

/** Semitone interval (0-11) of each triad degree, per quality. */
const TRIAD_DEGREE_INTERVAL: Record<TriadQuality, Record<ShapeDegree, number>> = {
  major: { 1: 0, 3: 4, 5: 7 },
  minor: { 1: 0, 3: 3, 5: 7 },
  diminished: { 1: 0, 3: 3, 5: 6 },
  augmented: { 1: 0, 3: 4, 5: 8 },
}

/** Root-relative degree label of each triad degree, per quality. */
const TRIAD_DEGREE_LABEL: Record<TriadQuality, Record<ShapeDegree, string>> = {
  major: { 1: '1', 3: '3', 5: '5' },
  minor: { 1: '1', 3: 'b3', 5: '5' },
  diminished: { 1: '1', 3: 'b3', 5: 'b5' },
  augmented: { 1: '1', 3: '3', 5: '#5' },
}

export interface TriadInfo {
  quality: TriadQuality
  thirdInterval: number
  fifthInterval: number
}

function foldInterval(interval: number): number {
  return ((interval % 12) + 12) % 12
}

/**
 * Classifies a chord's underlying triad from its intervals. Returns null for chords with no third
 * (sus2, sus4, power) - CAGED has no shape for them.
 */
export function triadFromIntervals(intervals: number[]): TriadInfo | null {
  const has = (semitone: number): boolean => intervals.some((interval) => foldInterval(interval) === semitone)
  if (has(4) && has(7)) return { quality: 'major', thirdInterval: 4, fifthInterval: 7 }
  if (has(3) && has(7)) return { quality: 'minor', thirdInterval: 3, fifthInterval: 7 }
  if (has(3) && has(6)) return { quality: 'diminished', thirdInterval: 3, fifthInterval: 6 }
  if (has(4) && has(8)) return { quality: 'augmented', thirdInterval: 4, fifthInterval: 8 }
  return null
}

export interface CagedPosition {
  shape: ShapeName
  /** Root fret on the anchor string, used for the position label (e.g. "E shape, fret 5"). */
  rootFret: number
  markers: Marker[]
}

export type CagedResult =
  | { supported: true; positions: CagedPosition[] }
  | { supported: false; reason: string; positions: [] }

function labelFor(root: Spelling, degreeLabel: string, displayMode: DisplayMode): string {
  return displayMode === 'degrees' ? degreeLabel : spellingToLabel(spellDegree(root, degreeLabel))
}

interface PlacedNote {
  stringIndex: number
  fret: number
  degree: ShapeDegree
}

/** Enumerates every octave of a shape whose entire grip fits in [0, fretCount]. */
function placeShape(
  template: ShapeTemplate,
  config: InstrumentConfig,
  rootPitchClass: number,
): { rootFret: number; notes: PlacedNote[] }[] {
  const anchorOpenPitchClass = pitchClassOfSpelling(config.strings[template.anchorStringIndex].spelling)
  const base = foldInterval(rootPitchClass - anchorOpenPitchClass)
  const placements: { rootFret: number; notes: PlacedNote[] }[] = []

  for (let rootFret = base; rootFret <= config.fretCount; rootFret += 12) {
    const notes = template.strings.map((string) => ({
      stringIndex: string.stringIndex,
      fret: rootFret + string.fretOffset,
      degree: string.degree,
    }))
    if (notes.every((note) => note.fret >= 0 && note.fret <= config.fretCount)) {
      placements.push({ rootFret, notes })
    }
  }
  return placements
}

/**
 * Builds the CAGED positions for a chord symbol on standard guitar tuning. Gates on tuning and on the
 * chord having a major/minor/diminished/augmented triad; otherwise returns an unsupported reason.
 */
export function buildCagedPositions(
  config: InstrumentConfig,
  symbolInput: string,
  displayMode: DisplayMode,
): CagedResult {
  if (!isStandardGuitarTuning(config)) {
    return { supported: false, reason: 'CAGED positions require standard guitar tuning.', positions: [] }
  }

  const trimmed = symbolInput.trim()
  if (trimmed === '') {
    return { supported: true, positions: [] }
  }

  const parsed = parseChordSymbol(trimmed)
  if (!parsed.ok) {
    return { supported: false, reason: parsed.error, positions: [] }
  }

  const triad = triadFromIntervals(parsed.quality.intervals)
  if (!triad) {
    return {
      supported: false,
      reason: 'CAGED shapes cover major, minor, diminished, and augmented triads.',
      positions: [],
    }
  }

  const root = parsed.root
  const rootPitchClass = pitchClassOfSpelling(root)
  const { quality } = triad

  // Extra (non-triad) tones for extension marking, paired with the parser's honest degree labels.
  const extraTones = parsed.quality.intervals
    .map((interval, index) => ({
      pitchClass: foldInterval(rootPitchClass + interval),
      folded: foldInterval(interval),
      label: parsed.quality.degreeLabels[index],
    }))
    .filter(
      (tone) =>
        tone.folded !== 0 && tone.folded !== triad.thirdInterval && tone.folded !== triad.fifthInterval,
    )

  const built: { position: CagedPosition; sortFret: number }[] = []

  MAJOR_SHAPE_TEMPLATES.forEach((template) => {
    const altered = alterDegrees(template, quality)
    placeShape(altered, config, rootPitchClass).forEach(({ rootFret, notes }) => {
      const used = new Set<string>()
      const markers: Marker[] = notes.map((note) => {
        used.add(`${note.stringIndex}:${note.fret}`)
        const degreeLabel = TRIAD_DEGREE_LABEL[quality][note.degree]
        return {
          string: note.stringIndex,
          fret: note.fret,
          label: labelFor(root, degreeLabel, displayMode),
          emphasis: note.degree === 1,
          degree: TRIAD_DEGREE_INTERVAL[quality][note.degree],
        }
      })

      if (extraTones.length > 0) {
        const frets = notes.map((note) => note.fret)
        const lo = Math.max(0, Math.min(...frets) - 1)
        const hi = Math.min(config.fretCount, Math.max(...frets) + 1)
        config.strings.forEach((string, stringIndex) => {
          const openPitchClass = pitchClassOfSpelling(string.spelling)
          for (let fret = lo; fret <= hi; fret++) {
            const key = `${stringIndex}:${fret}`
            if (used.has(key)) continue
            const pitchClass = foldInterval(openPitchClass + fret)
            const tone = extraTones.find((extra) => extra.pitchClass === pitchClass)
            if (!tone) continue
            used.add(key)
            markers.push({
              string: stringIndex,
              fret,
              label: labelFor(root, tone.label, displayMode),
              emphasis: false,
              degree: tone.folded,
              extension: true,
            })
          }
        })
      }

      // Sort by the triad's leftmost fret so positions read left-to-right up the neck,
      // unaffected by extension markers that may sit a fret below the grip.
      const sortFret = Math.min(...notes.map((note) => note.fret))
      built.push({ position: { shape: template.name, rootFret, markers }, sortFret })
    })
  })

  built.sort((a, b) => a.sortFret - b.sortFret || a.position.rootFret - b.position.rootFret)

  return { supported: true, positions: built.map((entry) => entry.position) }
}
