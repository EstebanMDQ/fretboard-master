import { describe, expect, it } from 'vitest'
import {
  GUITAR_STANDARD,
  UKULELE_STANDARD,
  BASS_4_STANDARD,
  GUITAR_7_STANDARD,
  isStandardGuitarTuning,
  type InstrumentConfig,
} from './tunings'
import { buildCagedPositions, triadFromIntervals, type CagedPosition } from './cagedShapes'
import type { Marker } from './notes'

/** stringIndex -> fret map of the core (non-extension) triad tones of a position. */
function triadFrets(position: CagedPosition): Record<number, number> {
  const map: Record<number, number> = {}
  position.markers
    .filter((marker) => !marker.extension)
    .forEach((marker) => {
      map[marker.string] = marker.fret
    })
  return map
}

function positionsOf(symbol: string, config: InstrumentConfig = GUITAR_STANDARD): CagedPosition[] {
  const result = buildCagedPositions(config, symbol, 'degrees')
  expect(result.supported).toBe(true)
  return result.positions
}

function findShape(positions: CagedPosition[], shape: string, rootFret: number): CagedPosition {
  const match = positions.find((position) => position.shape === shape && position.rootFret === rootFret)
  expect(match, `${shape} shape at fret ${rootFret}`).toBeDefined()
  return match!
}

describe('shape geometry', () => {
  it('places the E shape for A major as the classic 5th-fret barre', () => {
    const eShape = findShape(positionsOf('A'), 'E', 5)
    // Low-to-high (idx 5..0): 5 7 7 6 5 5
    expect(triadFrets(eShape)).toEqual({ 5: 5, 4: 7, 3: 7, 2: 6, 1: 5, 0: 5 })
    const root = eShape.markers.find((m) => m.string === 5)!
    expect(root.emphasis).toBe(true)
  })

  it('marks the root with emphasis and every string with a triad label', () => {
    const eShape = findShape(positionsOf('C'), 'E', 8)
    const emphasized = eShape.markers.filter((m: Marker) => m.emphasis)
    expect(emphasized.every((m) => m.label === '1')).toBe(true)
  })
})

describe('quality derivations', () => {
  it('minor lowers only the third relative to major (E shape, A root)', () => {
    const major = triadFrets(findShape(positionsOf('A'), 'E', 5))
    const minor = triadFrets(findShape(positionsOf('Am'), 'E', 5))
    // Only string 2 (the third) moves: fret 6 -> 5. Everything else identical.
    expect(minor).toEqual({ ...major, 2: 5 })
  })

  it('diminished lowers the third and the fifth (E shape, A root)', () => {
    const major = triadFrets(findShape(positionsOf('A'), 'E', 5))
    const dim = triadFrets(findShape(positionsOf('Adim'), 'E', 5))
    // Third (string 2) 6->5, fifths (strings 4 and 1) each down one: 7->6, 5->4.
    expect(dim).toEqual({ ...major, 2: 5, 4: 6, 1: 4 })
  })

  it('augmented raises the fifth (E shape, A root)', () => {
    const major = triadFrets(findShape(positionsOf('A'), 'E', 5))
    const aug = triadFrets(findShape(positionsOf('Aaug'), 'E', 5))
    // Fifths (strings 4 and 1) up one: 7->8, 5->6.
    expect(aug).toEqual({ ...major, 4: 8, 1: 6 })
  })
})

describe('placement enumeration', () => {
  it('includes octave repeats (A major A shape at fret 0 and 12)', () => {
    const positions = positionsOf('A')
    const aShapes = positions.filter((p) => p.shape === 'A').map((p) => p.rootFret)
    expect(aShapes).toContain(0)
    expect(aShapes).toContain(12)
  })

  it('skips a below-neck octave when offsets would go negative (A major C shape)', () => {
    const cShapes = positionsOf('A')
      .filter((p) => p.shape === 'C')
      .map((p) => p.rootFret)
    // C shape anchored on the A string would need frets below 0 at rootFret 0, so it only fits at 12.
    expect(cShapes).not.toContain(0)
    expect(cShapes).toContain(12)
  })

  it('excludes placements that overflow a short neck', () => {
    const shortNeck: InstrumentConfig = { ...GUITAR_STANDARD, fretCount: 4 }
    const positions = positionsOf('A', shortNeck)
    expect(positions.length).toBeGreaterThan(0)
    positions.forEach((position) => {
      position.markers.forEach((marker) => {
        expect(marker.fret).toBeGreaterThanOrEqual(0)
        expect(marker.fret).toBeLessThanOrEqual(4)
      })
    })
    // The E shape (spans up to fret 7 for A) cannot fit on a 4-fret neck.
    expect(positions.some((p) => p.shape === 'E')).toBe(false)
  })

  it('orders positions by ascending fret', () => {
    const mins = positionsOf('C').map((p) => Math.min(...p.markers.map((m) => m.fret)))
    const sorted = [...mins].sort((a, b) => a - b)
    expect(mins).toEqual(sorted)
  })
})

describe('triad extraction', () => {
  const supported: Record<string, number[]> = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    six: [0, 4, 7, 9],
    m6: [0, 3, 7, 9],
    dom7: [0, 4, 7, 10],
    maj7: [0, 4, 7, 11],
    m7: [0, 3, 7, 10],
    ninth: [0, 4, 7, 10, 14],
    eleventh: [0, 4, 7, 10, 14, 17],
    thirteenth: [0, 4, 7, 10, 14, 17, 21],
    dim: [0, 3, 6],
    dim7: [0, 3, 6, 9],
    m7b5: [0, 3, 6, 10],
    aug: [0, 4, 8],
  }

  it('classifies major/minor/diminished/augmented chords', () => {
    for (const intervals of Object.values(supported)) {
      expect(triadFromIntervals(intervals)).not.toBeNull()
    }
  })

  it('returns null for thirdless chords (sus2, sus4, power)', () => {
    expect(triadFromIntervals([0, 2, 7])).toBeNull() // sus2
    expect(triadFromIntervals([0, 5, 7])).toBeNull() // sus4
    expect(triadFromIntervals([0, 7])).toBeNull() // power
  })

  it('reports thirdless chords as unsupported via buildCagedPositions', () => {
    const result = buildCagedPositions(GUITAR_STANDARD, 'Dsus4', 'degrees')
    expect(result.supported).toBe(false)
    if (!result.supported) expect(result.reason).toMatch(/major, minor, diminished, and augmented/)
  })
})

describe('extension marking', () => {
  it('marks the b7 of G7 as an extension', () => {
    const positions = positionsOf('G7')
    const allMarkers = positions.flatMap((p) => p.markers)
    const flatSeven = allMarkers.filter((m) => m.label === 'b7')
    expect(flatSeven.length).toBeGreaterThan(0)
    expect(flatSeven.every((m) => m.extension === true)).toBe(true)
  })

  it('labels the ninth of Cmaj9 as "9", never folded to "2"', () => {
    const allMarkers = positionsOf('Cmaj9').flatMap((p) => p.markers)
    expect(allMarkers.some((m) => m.label === '9')).toBe(true)
    expect(allMarkers.some((m) => m.label === '2')).toBe(false)
  })
})

describe('tuning gate', () => {
  it('accepts standard guitar tuning', () => {
    expect(isStandardGuitarTuning(GUITAR_STANDARD)).toBe(true)
  })

  it('rejects ukulele, bass, 7-string, and altered tunings', () => {
    expect(isStandardGuitarTuning(UKULELE_STANDARD)).toBe(false)
    expect(isStandardGuitarTuning(BASS_4_STANDARD)).toBe(false)
    expect(isStandardGuitarTuning(GUITAR_7_STANDARD)).toBe(false)
    // Drop-D: low E string retuned to D changes its pitch class.
    const dropD: InstrumentConfig = {
      ...GUITAR_STANDARD,
      strings: GUITAR_STANDARD.strings.map((string, index) =>
        index === 5 ? { ...string, spelling: { letter: 'D', accidental: 0 } } : string,
      ),
    }
    expect(isStandardGuitarTuning(dropD)).toBe(false)
  })

  it('reports unsupported tuning via buildCagedPositions', () => {
    const result = buildCagedPositions(UKULELE_STANDARD, 'C', 'degrees')
    expect(result.supported).toBe(false)
    if (!result.supported) expect(result.reason).toMatch(/standard guitar tuning/)
  })
})
