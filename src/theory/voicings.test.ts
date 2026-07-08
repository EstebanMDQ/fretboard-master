import { describe, expect, it } from 'vitest'
import { GUITAR_STANDARD, type InstrumentConfig } from './tunings'
import { pitchClassOfSpelling } from './notes'
import {
  adjacencyReward,
  chordToneRoles,
  findVoicings,
  shapeSignature,
  type Voicing,
} from './voicings'
import { parseChordSymbol } from './chordParser'

/** DADGAD (low to high in this app's index order: index 0 = high string). */
const DADGAD: InstrumentConfig = {
  strings: [
    { spelling: { letter: 'D', accidental: 0 }, octave: 4 },
    { spelling: { letter: 'A', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'G', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'D', accidental: 0 }, octave: 3 },
    { spelling: { letter: 'A', accidental: 0 }, octave: 2 },
    { spelling: { letter: 'D', accidental: 0 }, octave: 2 },
  ],
  fretCount: 15,
}

function rolesFor(symbol: string): ReturnType<typeof chordToneRoles> {
  const parsed = parseChordSymbol(symbol)
  if (!parsed.ok) throw new Error(`unparseable: ${symbol}`)
  return chordToneRoles(pitchClassOfSpelling(parsed.root), parsed.quality.intervals, parsed.quality.degreeLabels)
}

function voicingsFor(config: InstrumentConfig, symbol: string): Voicing[] {
  const result = findVoicings(config, symbol)
  expect(result.supported).toBe(true)
  return result.voicings
}

describe('chordToneRoles and drop-order', () => {
  it('marks guide tones and named extension essential, the perfect fifth and unnamed extensions droppable', () => {
    const roles = rolesFor('C13')
    const byDegree = (num: number) => roles.find((tone) => tone.degreeNumber === num)!
    expect(byDegree(3).essential).toBe(true) // third
    expect(byDegree(7).essential).toBe(true) // b7
    expect(byDegree(13).essential).toBe(true) // named extension
    expect(byDegree(13).named).toBe(true)
    expect(byDegree(5).essential).toBe(false) // perfect fifth is droppable
    expect(byDegree(9).essential).toBe(false) // unnamed lower extension
    expect(byDegree(11).essential).toBe(false) // unnamed 11 (avoid note)
  })

  it('keeps altered tones essential', () => {
    const augFifth = rolesFor('Caug').find((tone) => tone.degreeNumber === 5)!
    expect(augFifth.role).toBe('alteredFifth')
    expect(augFifth.essential).toBe(true)
    const dimFifth = rolesFor('Cm7b5').find((tone) => tone.degreeNumber === 5)!
    expect(dimFifth.role).toBe('alteredFifth')
    expect(dimFifth.essential).toBe(true)
  })

  it('keeps the sus tone essential and needs no third', () => {
    const sus4 = rolesFor('Csus4')
    expect(sus4.some((tone) => tone.role === 'sus' && tone.essential)).toBe(true)
    expect(sus4.some((tone) => tone.role === 'third')).toBe(false)
  })

  it('keeps the fifth essential for a power chord', () => {
    const power = rolesFor('C5')
    expect(power.find((tone) => tone.role === 'fifth')!.essential).toBe(true)
  })

  it('makes the root essential when there is no seventh, droppable when there is', () => {
    expect(rolesFor('C').find((tone) => tone.role === 'root')!.essential).toBe(true)
    expect(rolesFor('C7').find((tone) => tone.role === 'root')!.essential).toBe(false)
  })
})

describe('essential coverage and playability', () => {
  it('every generated voicing covers the essential tones (C7: third and b7)', () => {
    const voicings = voicingsFor(GUITAR_STANDARD, 'C7')
    expect(voicings.length).toBeGreaterThan(0)
    for (const voicing of voicings) {
      const degrees = new Set(voicing.notes.map((note) => note.degree))
      expect(degrees.has(4)).toBe(true) // major third
      expect(degrees.has(10)).toBe(true) // b7
    }
  })

  it('never omits an altered tone (Cm7b5 keeps the b5)', () => {
    for (const voicing of voicingsFor(GUITAR_STANDARD, 'Cm7b5')) {
      expect(voicing.notes.some((note) => note.degree === 6)).toBe(true) // b5 folds to 6
    }
  })

  it('respects the span cap and minimum sounding strings', () => {
    for (const voicing of voicingsFor(GUITAR_STANDARD, 'Cmaj7')) {
      expect(voicing.frettedSpan).toBeLessThanOrEqual(7)
      expect(voicing.notes.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('tags voicings with a 6-7 fret span as a stretch', () => {
    for (const voicing of voicingsFor(GUITAR_STANDARD, 'Cmaj7')) {
      expect(voicing.tags.includes('stretch')).toBe(voicing.frettedSpan >= 6)
    }
  })
})

describe('open strings', () => {
  it('finds open-string voicings for a D chord in DADGAD, labeled by degree at fret 0', () => {
    const voicings = voicingsFor(DADGAD, 'D')
    const openVoicings = voicings.filter((voicing) => voicing.tags.includes('open-strings'))
    expect(openVoicings.length).toBeGreaterThan(0)
    for (const voicing of openVoicings) {
      const openNotes = voicing.notes.filter((note) => note.open)
      expect(openNotes.length).toBeGreaterThan(0)
      // Open D string is the root (1), open A string is the fifth (5).
      openNotes.forEach((note) => {
        expect(note.fret).toBe(0)
        expect(['1', '5']).toContain(note.label)
      })
    }
  })

  it('does not count open strings toward the fretted-hand span', () => {
    const voicing = voicingsFor(DADGAD, 'D').find(
      (v) => v.notes.some((note) => note.open) && v.notes.some((note) => note.fret >= 1),
    )
    expect(voicing).toBeDefined()
    if (voicing) {
      const frettedFrets = voicing.notes.filter((note) => note.fret >= 1).map((note) => note.fret)
      const expectedSpan = Math.max(...frettedFrets) - Math.min(...frettedFrets)
      expect(voicing.frettedSpan).toBe(expectedSpan)
    }
  })
})

describe('de-duplication by shape', () => {
  it('returns only distinct shape signatures', () => {
    const voicings = voicingsFor(GUITAR_STANDARD, 'C')
    const signatures = voicings.map(shapeSignature)
    expect(new Set(signatures).size).toBe(signatures.length)
  })

  it('collapses octave-equivalent moveable shapes into one entry listing both positions', () => {
    const voicings = voicingsFor(GUITAR_STANDARD, 'C7')
    const collapsed = voicings.filter((voicing) => voicing.positions.length > 1)
    expect(collapsed.length).toBeGreaterThan(0)
    for (const voicing of collapsed) {
      const sorted = [...voicing.positions].sort((a, b) => a - b)
      expect(voicing.positions).toEqual(sorted)
    }
  })
})

describe('scoring, tags, adjacency', () => {
  it('rewards an upper-register 2nd more than a bass-register 2nd', () => {
    const low = lowestOpenMidi()
    const lowMidis = [low, low + 2] // low, a whole step apart
    const highMidis = [low + 24, low + 26] // two octaves up, same interval
    expect(adjacencyReward(GUITAR_STANDARD, highMidis)).toBeGreaterThan(adjacencyReward(GUITAR_STANDARD, lowMidis))
  })

  it('tags rootless and no-fifth voicings and annotates them', () => {
    const voicings = voicingsFor(GUITAR_STANDARD, 'C13')
    const rootless = voicings.find((voicing) => voicing.tags.includes('rootless'))
    expect(rootless).toBeDefined()
    if (rootless) {
      expect(rootless.notes.some((note) => note.isRoot)).toBe(false)
      expect(rootless.annotations).toContain('rootless')
    }
  })
})

describe('input handling', () => {
  it('reports an unparseable chord symbol', () => {
    const result = findVoicings(GUITAR_STANDARD, 'H#nonsense')
    expect(result.supported).toBe(false)
    if (!result.supported) expect(result.reason.length).toBeGreaterThan(0)
  })

  it('returns an empty list for empty input', () => {
    const result = findVoicings(GUITAR_STANDARD, '   ')
    expect(result.supported).toBe(true)
    expect(result.voicings).toEqual([])
  })
})

/** Lowest open-string midi of standard tuning, for adjacency register fixtures. */
function lowestOpenMidi(): number {
  const low = GUITAR_STANDARD.strings[GUITAR_STANDARD.strings.length - 1]
  return low.octave * 12 + pitchClassOfSpelling(low.spelling)
}
