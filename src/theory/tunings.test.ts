import { describe, expect, it } from 'vitest'
import {
  BASS_4_STANDARD,
  BASS_5_STANDARD,
  BUILT_IN_TUNINGS,
  GUITAR_7_STANDARD,
  GUITAR_STANDARD,
  UKULELE_STANDARD,
  deleteTuning,
  loadSavedTunings,
  positionsForPitchClasses,
  upsertTuning,
  type NamedTuning,
} from './tunings'

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

describe('built-in presets', () => {
  it('exposes all presets in BUILT_IN_TUNINGS', () => {
    const names = BUILT_IN_TUNINGS.map((t) => t.name)
    expect(names).toEqual(['Guitar', 'Ukulele', 'Bass (4-string)', 'Bass (5-string)', 'Guitar (7-string)'])
  })

  it('tunes the 4-string bass E A D G with the low E at octave 1', () => {
    expect(BASS_4_STANDARD.strings).toHaveLength(4)
    const lowest = BASS_4_STANDARD.strings[BASS_4_STANDARD.strings.length - 1]
    expect(lowest).toEqual({ spelling: { letter: 'E', accidental: 0 }, octave: 1 })
  })

  it('adds a low B (octave 0) below the E on the 5-string bass', () => {
    expect(BASS_5_STANDARD.strings).toHaveLength(5)
    const lowest = BASS_5_STANDARD.strings[BASS_5_STANDARD.strings.length - 1]
    expect(lowest).toEqual({ spelling: { letter: 'B', accidental: 0 }, octave: 0 })
  })

  it('adds a low B (octave 1) below the low E on the 7-string guitar', () => {
    expect(GUITAR_7_STANDARD.strings).toHaveLength(7)
    const lowest = GUITAR_7_STANDARD.strings[GUITAR_7_STANDARD.strings.length - 1]
    expect(lowest).toEqual({ spelling: { letter: 'B', accidental: 0 }, octave: 1 })
    // The top six strings match standard guitar.
    expect(GUITAR_7_STANDARD.strings.slice(0, 6)).toEqual(GUITAR_STANDARD.strings)
  })
})

describe('saved-tuning library', () => {
  const entry: NamedTuning = { name: 'tebi tuning', config: GUITAR_7_STANDARD }

  it('appends a new tuning', () => {
    expect(upsertTuning([], entry)).toEqual([entry])
  })

  it('overwrites an existing entry with the same name', () => {
    const updated: NamedTuning = { name: 'tebi tuning', config: BASS_5_STANDARD }
    const result = upsertTuning([entry], updated)
    expect(result).toHaveLength(1)
    expect(result[0].config).toBe(BASS_5_STANDARD)
  })

  it('deletes by name', () => {
    expect(deleteTuning([entry], 'tebi tuning')).toEqual([])
    expect(deleteTuning([entry], 'other')).toEqual([entry])
  })

  it('falls back to an empty library when storage is unavailable', () => {
    expect(loadSavedTunings()).toEqual([])
  })
})
