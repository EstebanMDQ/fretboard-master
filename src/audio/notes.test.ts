import { describe, expect, it } from 'vitest'
import { buildNoteSequence, frequencyFromMidi, midiFromPitch } from './notes'

describe('midiFromPitch', () => {
  it('computes MIDI note numbers with C4 as middle C (60)', () => {
    expect(midiFromPitch(0, 4)).toBe(60)
    expect(midiFromPitch(9, 4)).toBe(69) // A4
  })
})

describe('frequencyFromMidi', () => {
  it('computes A4 (MIDI 69) as 440Hz', () => {
    expect(frequencyFromMidi(69)).toBeCloseTo(440)
  })

  it('computes an octave up as double the frequency', () => {
    expect(frequencyFromMidi(81)).toBeCloseTo(880)
  })
})

describe('buildNoteSequence', () => {
  it('caps a major triad at the octave root when ascending', () => {
    expect(buildNoteSequence([0, 4, 7], { direction: 'ascending' })).toEqual([0, 4, 7, 12])
  })

  it('reverses for descending, still capped at the octave', () => {
    expect(buildNoteSequence([0, 4, 7], { direction: 'descending' })).toEqual([12, 7, 4, 0])
  })

  it('plays up and back down for "both", without repeating the turnaround note', () => {
    expect(buildNoteSequence([0, 4, 7], { direction: 'both' })).toEqual([0, 4, 7, 12, 7, 4, 0])
  })

  it('does not cap chords that already exceed an octave (extended chords)', () => {
    // C9: root, 3rd, 5th, b7, true 9th (14) - already spans past the octave, so no extra root is appended
    expect(buildNoteSequence([0, 4, 7, 10, 14], { direction: 'ascending' })).toEqual([0, 4, 7, 10, 14])
  })

  it('caps a 7-note scale at the octave the same way as a triad', () => {
    const major = [0, 2, 4, 5, 7, 9, 11]
    expect(buildNoteSequence(major, { direction: 'ascending' })).toEqual([0, 2, 4, 5, 7, 9, 11, 12])
  })
})
