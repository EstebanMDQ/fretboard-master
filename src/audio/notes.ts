import { getAudioContext, getMasterGain } from './engine'

export function midiFromPitch(pitchClass: number, octave: number): number {
  return 12 * (octave + 1) + pitchClass
}

export function frequencyFromMidi(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

/** Two detuned triangle oscillators through a fast-attack, exponential-decay envelope. */
export function playNote(time: number, frequency: number, beatDurationSeconds: number): void {
  const context = getAudioContext()
  const gain = context.createGain()

  const attackSeconds = 0.005
  const releaseTime = time + beatDurationSeconds * 0.9

  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(0.5, time + attackSeconds)
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseTime)
  gain.connect(getMasterGain())

  const detuneCents = 6
  for (const detune of [-detuneCents, detuneCents]) {
    const oscillator = context.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(frequency, time)
    oscillator.detune.setValueAtTime(detune, time)
    oscillator.connect(gain)
    oscillator.start(time)
    oscillator.stop(releaseTime + 0.02)
  }
}

export type PlaybackDirection = 'ascending' | 'descending' | 'both'

export interface SequenceOptions {
  direction: PlaybackDirection
  /** Defaults to true. When true, appends the octave root only if the largest interval is already below 12 -
   *  simple chords/scales cap at one octave, while extended chords (9/11/13, true intervals >= 12) play as-is. */
  capAtOctave?: boolean
}

/** Turns a root-relative interval set into an ordered sequence of semitone offsets from the root. */
export function buildNoteSequence(intervals: number[], options: SequenceOptions): number[] {
  const sorted = [...intervals].sort((a, b) => a - b)
  const capAtOctave = options.capAtOctave ?? true
  const shouldCap = capAtOctave && (sorted.length === 0 || sorted[sorted.length - 1] < 12)
  const ascending = shouldCap ? [...sorted, 12] : sorted

  if (options.direction === 'ascending') return ascending
  const descending = [...ascending].reverse()
  if (options.direction === 'descending') return descending
  return [...ascending, ...descending.slice(1)]
}
