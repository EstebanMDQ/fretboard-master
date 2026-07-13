import { describe, expect, it } from 'vitest'
import { GUITAR_STANDARD } from './tunings'
import { SCALE_FAMILIES, SCALE_PRESETS, buildMarkers } from './scales'
import { pitchClassOfSpelling, spellDegree } from './notes'

describe('SCALE_FAMILIES', () => {
  it('has 8 families', () => {
    expect(SCALE_FAMILIES).toHaveLength(8)
    const names = SCALE_FAMILIES.map((f) => f.name)
    expect(names).toEqual(['Major', 'Harmonic Minor', 'Melodic Minor', 'Pentatonic', 'Diminished', 'Augmented', 'Symmetrical', 'Other'])
  })

  it('Major family has 7 modes with Ionian first', () => {
    const major = SCALE_FAMILIES.find((f) => f.name === 'Major')!
    expect(major.modes).toHaveLength(7)
    expect(major.modes[0].name).toBe('Ionian')
    expect(major.modes[0].intervals).toEqual([0, 2, 4, 5, 7, 9, 11])
  })

  it('Harmonic Minor family has 7 modes with Harmonic Minor first', () => {
    const hm = SCALE_FAMILIES.find((f) => f.name === 'Harmonic Minor')!
    expect(hm.modes).toHaveLength(7)
    expect(hm.modes[0].name).toBe('Harmonic Minor')
    expect(hm.modes[0].intervals).toEqual([0, 2, 3, 5, 7, 8, 11])
  })

  it('Augmented family has 2 modes with correct intervals', () => {
    const aug = SCALE_FAMILIES.find((f) => f.name === 'Augmented')!
    expect(aug.modes).toHaveLength(2)
    expect(aug.modes[0].intervals).toEqual([0, 3, 4, 7, 8, 11])
    expect(aug.modes[1].intervals).toEqual([0, 1, 4, 5, 8, 9])
  })

  it('every mode has strictly increasing intervals all below 12, matching label count', () => {
    for (const family of SCALE_FAMILIES) {
      for (const mode of family.modes) {
        expect(mode.intervals.length).toBe(mode.degreeLabels.length)
        for (const interval of mode.intervals) {
          expect(interval).toBeGreaterThanOrEqual(0)
          expect(interval).toBeLessThan(12)
        }
        for (let i = 1; i < mode.intervals.length; i++) {
          expect(mode.intervals[i]).toBeGreaterThan(mode.intervals[i - 1])
        }
      }
    }
  })
})

describe('SCALE_PRESETS', () => {
  it('is derived from SCALE_FAMILIES and contains all modes', () => {
    const total = SCALE_FAMILIES.reduce((sum, f) => sum + f.modes.length, 0)
    expect(SCALE_PRESETS).toHaveLength(total)
  })

  it('disambiguates Lydian #4 from Locrian b5 (both 6 semitones from root)', () => {
    const lydian = SCALE_PRESETS.find((s) => s.name === 'Lydian')!
    const locrian = SCALE_PRESETS.find((s) => s.name === 'Locrian')!
    expect(lydian.degreeLabels[lydian.intervals.indexOf(6)]).toBe('#4')
    expect(locrian.degreeLabels[locrian.intervals.indexOf(6)]).toBe('b5')
  })

  it('defines the two octatonic diminished scales with matching interval/label spellings', () => {
    const wholeHalf = SCALE_PRESETS.find((s) => s.name === 'Whole-Half')!
    const halfWhole = SCALE_PRESETS.find((s) => s.name === 'Half-Whole')!
    expect(wholeHalf.intervals).toEqual([0, 2, 3, 5, 6, 8, 9, 11])
    expect(halfWhole.intervals).toEqual([0, 1, 3, 4, 6, 7, 9, 10])

    // Every degree label must spell back to its interval (valid spellDegree input).
    const root = { letter: 'C' as const, accidental: 0 as const }
    const rootPc = pitchClassOfSpelling(root)
    for (const scale of [wholeHalf, halfWhole]) {
      scale.intervals.forEach((interval, index) => {
        const spelled = spellDegree(root, scale.degreeLabels[index])
        expect(((pitchClassOfSpelling(spelled) - rootPc) % 12 + 12) % 12).toBe(interval)
      })
    }
  })
})

describe('buildMarkers', () => {
  const major = SCALE_FAMILIES.find((f) => f.name === 'Major')!.modes[0]
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
