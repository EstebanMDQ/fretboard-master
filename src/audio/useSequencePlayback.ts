import { useEffect, useRef, useState } from 'react'
import { getAudioContext, unlockAudio } from './engine'
import { createSchedulerHandle } from './scheduler'
import { buildNoteSequence, frequencyFromMidi, midiFromPitch, playNote, type PlaybackDirection } from './notes'
import { pitchClassOfSpelling, type Spelling } from '../theory/notes'

export interface SequencePlaybackConfig {
  root: Spelling
  intervals: number[]
  tempoBpm: number
  direction: PlaybackDirection
  capAtOctave?: boolean
}

const ROOT_OCTAVE = 3

/**
 * Plays a root + interval sequence one note per beat, reusing the lookahead scheduler.
 * Shared by scale and (later) arpeggio playback so both interrupt/restart the same way.
 */
export function useSequencePlayback() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentInterval, setCurrentInterval] = useState<number | null>(null)
  const schedulerRef = useRef(createSchedulerHandle())
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function stop() {
    schedulerRef.current.cancelAll()
    if (stopTimeoutRef.current !== null) {
      clearTimeout(stopTimeoutRef.current)
      stopTimeoutRef.current = null
    }
    setIsPlaying(false)
    setCurrentInterval(null)
  }

  async function play(config: SequencePlaybackConfig) {
    stop()
    await unlockAudio()
    const context = getAudioContext()
    const rootMidi = midiFromPitch(pitchClassOfSpelling(config.root), ROOT_OCTAVE)
    const sequence = buildNoteSequence(config.intervals, {
      direction: config.direction,
      capAtOctave: config.capAtOctave,
    })
    const secondsPerBeat = 60 / config.tempoBpm
    const startTime = context.currentTime + 0.1

    schedulerRef.current.schedule(
      sequence.map((interval, index) => ({
        time: startTime + index * secondsPerBeat,
        callback: (time: number) => {
          playNote(time, frequencyFromMidi(rootMidi + interval), secondsPerBeat)
          setCurrentInterval(((interval % 12) + 12) % 12)
        },
      })),
    )
    setIsPlaying(true)

    const totalSeconds = startTime - context.currentTime + sequence.length * secondsPerBeat
    stopTimeoutRef.current = setTimeout(() => {
      setIsPlaying(false)
      setCurrentInterval(null)
    }, totalSeconds * 1000)
  }

  useEffect(() => () => stop(), [])

  return { isPlaying, currentInterval, play, stop }
}
