import { describe, expect, it } from 'vitest'
import { STANDARD_SPELLINGS, pitchClassOfSpelling, spellDegree, spellingToLabel } from './notes'

describe('pitchClassOfSpelling', () => {
  it('computes natural pitch classes', () => {
    expect(pitchClassOfSpelling({ letter: 'C', accidental: 0 })).toBe(0)
    expect(pitchClassOfSpelling({ letter: 'B', accidental: 0 })).toBe(11)
  })

  it('computes sharps and flats, wrapping mod 12', () => {
    expect(pitchClassOfSpelling({ letter: 'C', accidental: 1 })).toBe(1)
    expect(pitchClassOfSpelling({ letter: 'C', accidental: -1 })).toBe(11)
    expect(pitchClassOfSpelling({ letter: 'B', accidental: 1 })).toBe(0)
  })
})

describe('spellingToLabel', () => {
  it('formats naturals, sharps, flats, and double accidentals', () => {
    expect(spellingToLabel({ letter: 'C', accidental: 0 })).toBe('C')
    expect(spellingToLabel({ letter: 'F', accidental: 1 })).toBe('F#')
    expect(spellingToLabel({ letter: 'B', accidental: -1 })).toBe('Bb')
    expect(spellingToLabel({ letter: 'F', accidental: 2 })).toBe('F##')
    expect(spellingToLabel({ letter: 'D', accidental: -2 })).toBe('Dbb')
  })
})

describe('STANDARD_SPELLINGS', () => {
  it('has exactly 17 entries: 7 naturals, 5 sharps, 5 flats', () => {
    expect(STANDARD_SPELLINGS).toHaveLength(17)
    expect(STANDARD_SPELLINGS.filter((s) => s.accidental === 0)).toHaveLength(7)
    expect(STANDARD_SPELLINGS.filter((s) => s.accidental === 1)).toHaveLength(5)
    expect(STANDARD_SPELLINGS.filter((s) => s.accidental === -1)).toHaveLength(5)
  })
})

describe('spellDegree', () => {
  it('spells the major 7th of G major as F#', () => {
    expect(spellDegree({ letter: 'G', accidental: 0 }, '7')).toEqual({ letter: 'F', accidental: 1 })
  })

  it('spells the raised 7th of G# harmonic minor as a double sharp (F##)', () => {
    expect(spellDegree({ letter: 'G', accidental: 1 }, '7')).toEqual({ letter: 'F', accidental: 2 })
  })

  it('spells the b2 of E phrygian as F natural', () => {
    expect(spellDegree({ letter: 'E', accidental: 0 }, 'b2')).toEqual({ letter: 'F', accidental: 0 })
  })

  it('spells the root as an unchanged degree 1', () => {
    expect(spellDegree({ letter: 'A', accidental: -1 }, '1')).toEqual({ letter: 'A', accidental: -1 })
  })

  it('spells extended degrees (9, 11, 13) using the correct letter', () => {
    expect(spellDegree({ letter: 'C', accidental: 0 }, '9')).toEqual({ letter: 'D', accidental: 0 })
    expect(spellDegree({ letter: 'C', accidental: 0 }, '11')).toEqual({ letter: 'F', accidental: 0 })
    expect(spellDegree({ letter: 'C', accidental: 0 }, '13')).toEqual({ letter: 'A', accidental: 0 })
  })

  it('throws on an invalid degree label', () => {
    expect(() => spellDegree({ letter: 'C', accidental: 0 }, 'foo')).toThrow()
  })
})
