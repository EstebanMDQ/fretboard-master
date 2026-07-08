import { describe, expect, it } from 'vitest'
import {
  backbeatPattern,
  cycleAccent,
  defaultPattern,
  downbeatOnlyPattern,
  isGapMuted,
  secondsPerClick,
  subdivisionOffsets,
} from './metronome'

describe('defaultPattern', () => {
  it('accents beat 1 in simple meters', () => {
    expect(defaultPattern(4, 4)).toEqual(['accent', 'normal', 'normal', 'normal'])
    expect(defaultPattern(3, 4)).toEqual(['accent', 'normal', 'normal'])
  })

  it('accents each dotted-quarter group in 6/8 and 12/8', () => {
    expect(defaultPattern(6, 8)).toEqual(['accent', 'normal', 'normal', 'accent', 'normal', 'normal'])
    expect(defaultPattern(12, 8)).toEqual([
      'accent', 'normal', 'normal',
      'accent', 'normal', 'normal',
      'accent', 'normal', 'normal',
      'accent', 'normal', 'normal',
    ])
  })

  it('does not apply the dotted-quarter grouping to 3/8', () => {
    // 3/8 is not >= 6, so it falls back to the simple-meter default (beat 1 accented only)
    expect(defaultPattern(3, 8)).toEqual(['accent', 'normal', 'normal'])
  })
})

describe('cycleAccent', () => {
  it('cycles accent -> normal -> mute -> accent', () => {
    expect(cycleAccent('accent')).toBe('normal')
    expect(cycleAccent('normal')).toBe('mute')
    expect(cycleAccent('mute')).toBe('accent')
  })
})

describe('secondsPerClick', () => {
  it('computes quarter-note interval at a given tempo', () => {
    expect(secondsPerClick(60, 4)).toBeCloseTo(1)
    expect(secondsPerClick(120, 4)).toBeCloseTo(0.5)
  })

  it('clicks faster for eighth-note meters at the same tempo', () => {
    expect(secondsPerClick(120, 8)).toBeCloseTo(0.25)
  })
})

describe('subdivisionOffsets', () => {
  it('returns no extra clicks for quarter', () => {
    expect(subdivisionOffsets('quarter')).toEqual([])
  })

  it('adds a midpoint click for straight 8ths', () => {
    expect(subdivisionOffsets('eighth')).toEqual([0.5])
  })

  it('adds 1/3 and 2/3 clicks for triplets', () => {
    expect(subdivisionOffsets('triplet')).toEqual([1 / 3, 2 / 3])
  })

  it('adds a single 2/3 offbeat for swing', () => {
    expect(subdivisionOffsets('swing')).toEqual([2 / 3])
  })
})

describe('backbeatPattern', () => {
  it('sounds only even beats in 4/4', () => {
    expect(backbeatPattern(4)).toEqual(['mute', 'normal', 'mute', 'normal'])
  })

  it('sounds only beat 2 in 3/4', () => {
    expect(backbeatPattern(3)).toEqual(['mute', 'normal', 'mute'])
  })

  it('falls back to the default when there is no even beat', () => {
    expect(backbeatPattern(1)).toEqual(['accent'])
  })
})

describe('downbeatOnlyPattern', () => {
  it('accents beat 1 and mutes the rest', () => {
    expect(downbeatOnlyPattern(4)).toEqual(['accent', 'mute', 'mute', 'mute'])
  })
})

describe('isGapMuted', () => {
  const gapTraining = { soundingMeasures: 2, silentMeasures: 1 }

  it('does not mute when gap training is disabled', () => {
    expect(isGapMuted(0, null)).toBe(false)
  })

  it('mutes only the silent measures in the cycle', () => {
    expect(isGapMuted(0, gapTraining)).toBe(false)
    expect(isGapMuted(1, gapTraining)).toBe(false)
    expect(isGapMuted(2, gapTraining)).toBe(true)
    expect(isGapMuted(3, gapTraining)).toBe(false)
    expect(isGapMuted(5, gapTraining)).toBe(true)
  })
})
