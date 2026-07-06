import { describe, expect, it } from 'vitest'
import { parseChordSymbol } from './chordParser'

describe('parseChordSymbol', () => {
  it('parses a bare major triad', () => {
    const result = parseChordSymbol('C')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.root).toEqual({ letter: 'C', accidental: 0 })
      expect(result.quality.intervals).toEqual([0, 4, 7])
    }
  })

  it('parses common chord symbols with correct root and intervals', () => {
    const cmaj7 = parseChordSymbol('Cmaj7')
    expect(cmaj7.ok).toBe(true)
    if (cmaj7.ok) expect(cmaj7.quality.intervals).toEqual([0, 4, 7, 11])

    const fSharpM7b5 = parseChordSymbol('F#m7b5')
    expect(fSharpM7b5.ok).toBe(true)
    if (fSharpM7b5.ok) {
      expect(fSharpM7b5.root).toEqual({ letter: 'F', accidental: 1 })
      expect(fSharpM7b5.quality.intervals).toEqual([0, 3, 6, 10])
    }

    const bb9 = parseChordSymbol('Bb9')
    expect(bb9.ok).toBe(true)
    if (bb9.ok) {
      expect(bb9.root).toEqual({ letter: 'B', accidental: -1 })
      expect(bb9.quality.intervals).toEqual([0, 4, 7, 10, 14])
    }
  })

  it('resolves common suffix synonyms to the same chord', () => {
    const cM7 = parseChordSymbol('CM7')
    const cMaj7 = parseChordSymbol('Cmaj7')
    expect(cM7.ok && cMaj7.ok).toBe(true)
    if (cM7.ok && cMaj7.ok) expect(cM7.quality.intervals).toEqual(cMaj7.quality.intervals)

    const cMin = parseChordSymbol('Cmin')
    const cDash = parseChordSymbol('C-')
    const cm = parseChordSymbol('Cm')
    expect(cMin.ok && cDash.ok && cm.ok).toBe(true)
    if (cMin.ok && cDash.ok && cm.ok) {
      expect(cMin.quality.intervals).toEqual(cm.quality.intervals)
      expect(cDash.quality.intervals).toEqual(cm.quality.intervals)
    }
  })

  it('matches the longest known suffix (m7b5 over m7 over m)', () => {
    const result = parseChordSymbol('Cm7b5')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.quality.intervals).toEqual([0, 3, 6, 10])
  })

  it('returns a typed error for an unrecognized suffix, preserving the parsed root', () => {
    const result = parseChordSymbol('Cfrobnicate')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.root).toEqual({ letter: 'C', accidental: 0 })
      expect(result.error).toBeTruthy()
    }
  })

  it('returns a typed error when no root can be parsed', () => {
    const result = parseChordSymbol('7')
    expect(result.ok).toBe(false)
  })

  it('parses slash chords, ignoring the bass note for the tone set', () => {
    const result = parseChordSymbol('C/G')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.root).toEqual({ letter: 'C', accidental: 0 })
      expect(result.quality.intervals).toEqual([0, 4, 7])
    }
  })
})
