import { describe, expect, it } from 'vitest'
import { GUITAR_STANDARD } from './tunings'
import { buildMarkers } from './scales'
import { CHORD_QUALITIES } from './chords'

describe('CHORD_QUALITIES', () => {
  it('has 20 qualities covering the documented catalog', () => {
    expect(CHORD_QUALITIES).toHaveLength(20)
  })

  it('stores true (unfolded) intervals for extended chords', () => {
    const ninth = CHORD_QUALITIES.find((q) => q.suffixes.includes('9'))!
    expect(ninth.intervals).toContain(14)
    const eleventh = CHORD_QUALITIES.find((q) => q.suffixes.includes('11'))!
    expect(eleventh.intervals).toContain(17)
    const thirteenth = CHORD_QUALITIES.find((q) => q.suffixes.includes('13'))!
    expect(thirteenth.intervals).toContain(21)
  })
})

describe('buildMarkers with extended chord intervals', () => {
  it('labels a 9th as "9", not folded down to "2"', () => {
    const ninth = CHORD_QUALITIES.find((q) => q.suffixes.includes('9'))!
    const root = { letter: 'C' as const, accidental: 0 as const }
    const markers = buildMarkers(GUITAR_STANDARD, root, ninth.intervals, ninth.degreeLabels, 'degrees')
    expect(markers.some((m) => m.label === '9')).toBe(true)
    expect(markers.some((m) => m.label === '2')).toBe(false)
  })
})
