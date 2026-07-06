import { pitchClassOfSpelling, spellDegree, spellingToLabel, type Marker, type Spelling } from './notes'
import { positionsForPitchClasses, type InstrumentConfig } from './tunings'
import { fallbackDegreeLabel } from './degrees'

export interface Scale {
  name: string
  intervals: number[]
  degreeLabels: string[]
}

export type DisplayMode = 'names' | 'degrees'

/**
 * Turns a root + interval/degree-label set into fretboard markers. The single function shared
 * by scale and (later) arpeggio visualization, so every study tool highlights notes the same way.
 */
export function buildMarkers(
  config: InstrumentConfig,
  root: Spelling,
  intervals: number[],
  degreeLabels: string[],
  displayMode: DisplayMode,
): Marker[] {
  const rootPitchClass = pitchClassOfSpelling(root)
  const pitchClasses = intervals.map((interval) => (rootPitchClass + interval) % 12)
  const positions = positionsForPitchClasses(config, pitchClasses)

  return positions.map((position) => {
    const relativeInterval = (((position.pitchClass - rootPitchClass) % 12) + 12) % 12
    // Extended intervals (e.g. a 9th stored as 14) fold to the same pitch class as a 2nd (2);
    // match by pitch class so the degree label stays honest ("9", not "2").
    const degreeIndex = intervals.findIndex((interval) => (((interval % 12) + 12) % 12) === relativeInterval)
    const degreeLabel = degreeIndex >= 0 ? degreeLabels[degreeIndex] : fallbackDegreeLabel(relativeInterval)
    const label = displayMode === 'degrees' ? degreeLabel : spellingToLabel(spellDegree(root, degreeLabel))
    return {
      string: position.string,
      fret: position.fret,
      label,
      emphasis: relativeInterval === 0,
    }
  })
}

export const SCALE_PRESETS: Scale[] = [
  { name: 'Major (Ionian)', intervals: [0, 2, 4, 5, 7, 9, 11], degreeLabels: ['1', '2', '3', '4', '5', '6', '7'] },
  {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    degreeLabels: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  },
  {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    degreeLabels: ['1', '2', 'b3', '4', '5', 'b6', '7'],
  },
  {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    degreeLabels: ['1', '2', 'b3', '4', '5', '6', '7'],
  },
  { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], degreeLabels: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
  { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], degreeLabels: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
  { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11], degreeLabels: ['1', '2', '3', '#4', '5', '6', '7'] },
  { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], degreeLabels: ['1', '2', '3', '4', '5', '6', 'b7'] },
  { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10], degreeLabels: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
  { name: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9], degreeLabels: ['1', '2', '3', '5', '6'] },
  { name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10], degreeLabels: ['1', 'b3', '4', '5', 'b7'] },
  { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10], degreeLabels: ['1', 'b3', '4', 'b5', '5', 'b7'] },
  { name: 'Miyako Bushi', intervals: [0, 1, 5, 7, 8], degreeLabels: ['1', 'b2', '4', '5', 'b6'] },
  { name: 'Whole Tone', intervals: [0, 2, 4, 6, 8, 10], degreeLabels: ['1', '2', '3', '#4', '#5', 'b7'] },
  {
    name: 'Chromatic',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    degreeLabels: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
  },
]
