import { describe, expect, it } from 'vitest'
import { GUITAR_STANDARD } from './tunings'
import { SCALE_PRESETS, buildMarkers } from './scales'

describe('SCALE_PRESETS', () => {
  it('has 15 presets with strictly increasing intervals all below 12', () => {
    expect(SCALE_PRESETS).toHaveLength(15)
    for (const scale of SCALE_PRESETS) {
      expect(scale.intervals.length).toBe(scale.degreeLabels.length)
      for (const interval of scale.intervals) {
        expect(interval).toBeGreaterThanOrEqual(0)
        expect(interval).toBeLessThan(12)
      }
      for (let i = 1; i < scale.intervals.length; i++) {
        expect(scale.intervals[i]).toBeGreaterThan(scale.intervals[i - 1])
      }
    }
  })

  it('disambiguates Lydian #4 from Locrian b5 (both 6 semitones from root)', () => {
    const lydian = SCALE_PRESETS.find((s) => s.name === 'Lydian')!
    const locrian = SCALE_PRESETS.find((s) => s.name === 'Locrian')!
    expect(lydian.degreeLabels[lydian.intervals.indexOf(6)]).toBe('#4')
    expect(locrian.degreeLabels[locrian.intervals.indexOf(6)]).toBe('b5')
  })
})

describe('buildMarkers', () => {
  const major = SCALE_PRESETS.find((s) => s.name === 'Major (Ionian)')!
  const root = { letter: 'G' as const, accidental: 0 as const }

  it('emphasizes the root and labels other degrees with note names by default', () => {
    const markers = buildMarkers(GUITAR_STANDARD, root, major.intervals, major.degreeLabels, 'names')
    const rootMarkers = markers.filter((m) => m.emphasis)
    expect(rootMarkers.length).toBeGreaterThan(0)
    expect(rootMarkers.every((m) => m.label === 'G')).toBe(true)
    // The major 7th of G is F#, found on the high E string (index 0) at fret 2
    const seventh = markers.find((m) => m.string === 0 && m.fret === 2)
    expect(seventh?.label).toBe('F#')
  })

  it('labels with scale degrees when displayMode is degrees', () => {
    const markers = buildMarkers(GUITAR_STANDARD, root, major.intervals, major.degreeLabels, 'degrees')
    expect(markers.every((m) => major.degreeLabels.includes(m.label))).toBe(true)
  })
})
