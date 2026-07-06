let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

/** Shared output node so simultaneous scheduler clients (metronome, note playback) mix into one gain stage. */
export function getMasterGain(): GainNode {
  const context = getAudioContext()
  if (!masterGain) {
    masterGain = context.createGain()
    masterGain.gain.value = 0.8
    masterGain.connect(context.destination)
  }
  return masterGain
}

/** Resumes the AudioContext. Call this from the first transport-control interaction, never on load. */
export async function unlockAudio(): Promise<void> {
  const context = getAudioContext()
  if (context.state !== 'running') {
    await context.resume()
  }
}
