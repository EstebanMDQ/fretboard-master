import { getAudioContext, getMasterGain } from './engine'

/** Short sine blip with fast exponential decay, used for metronome clicks. */
export function playClick(time: number, frequency: number, durationSeconds = 0.05): void {
  const context = getAudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, time)

  gain.gain.setValueAtTime(0.6, time)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + durationSeconds)

  oscillator.connect(gain)
  gain.connect(getMasterGain())

  oscillator.start(time)
  oscillator.stop(time + durationSeconds + 0.02)
}
