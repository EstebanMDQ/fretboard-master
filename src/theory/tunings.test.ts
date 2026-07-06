import { describe, expect, it } from 'vitest'
import { GUITAR_STANDARD, UKULELE_STANDARD, positionsForPitchClasses } from './tunings'

describe('positionsForPitchClasses', () => {
  it('finds every fretted position for a given pitch class on standard guitar', () => {
    // Pitch class 0 (C): low E string (pc 4) fret 8, A string (pc 9) fret 3, D string (pc 2) fret 10, etc.
    const positions = positionsForPitchClasses(GUITAR_STANDARD, [0])
    const lowEString = 5 // last configured string = string 6 = low E
    expect(positions.some((p) => p.string === lowEString && p.fret === 8)).toBe(true)
    const aString = 4 // string 5 = A
    expect(positions.some((p) => p.string === aString && p.fret === 3)).toBe(true)
  })

  it('returns positions across all strings within the fret range', () => {
    const positions = positionsForPitchClasses(GUITAR_STANDARD, [0, 4, 7]) // C major triad tones
    const stringsCovered = new Set(positions.map((p) => p.string))
    expect(stringsCovered.size).toBe(GUITAR_STANDARD.strings.length)
  })

  it('respects reentrant tunings without special-casing them', () => {
    // Ukulele string 4 (G, reentrant) pitch class 7, open string itself should be included when pc 7 is requested
    const positions = positionsForPitchClasses(UKULELE_STANDARD, [7])
    expect(positions.some((p) => p.string === 3 && p.fret === 0)).toBe(true)
  })
})
