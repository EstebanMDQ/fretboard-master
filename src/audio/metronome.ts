import { getAudioContext } from './engine'
import { createSchedulerHandle } from './scheduler'
import { playClick } from './voices'

export type BeatAccent = 'accent' | 'normal' | 'mute'

export interface GapTrainingSettings {
  soundingMeasures: number
  silentMeasures: number
}

export interface MetronomeSettings {
  tempoBpm: number
  numerator: number
  denominator: 2 | 4 | 8 | 16
  pattern: BeatAccent[]
  gapTraining: GapTrainingSettings | null
  subdivision: Subdivision
}

/** Beat 1 is accented by default; 6/8, 9/8, and 12/8 accent each dotted-quarter group instead. */
export function defaultPattern(numerator: number, denominator: number): BeatAccent[] {
  if (denominator === 8 && numerator % 3 === 0 && numerator >= 6) {
    return Array.from({ length: numerator }, (_, i) => (i % 3 === 0 ? 'accent' : 'normal'))
  }
  return Array.from({ length: numerator }, (_, i) => (i === 0 ? 'accent' : 'normal'))
}

export function cycleAccent(accent: BeatAccent): BeatAccent {
  if (accent === 'accent') return 'normal'
  if (accent === 'normal') return 'mute'
  return 'accent'
}

/** Only even-numbered beats (2, 4, ...) sound; falls back to the default when no even beat exists. */
export function backbeatPattern(numerator: number): BeatAccent[] {
  if (numerator < 2) return defaultPattern(numerator, 4)
  return Array.from({ length: numerator }, (_, i): BeatAccent => ((i + 1) % 2 === 0 ? 'normal' : 'mute'))
}

/** Beat 1 accented, every other beat muted. */
export function downbeatOnlyPattern(numerator: number): BeatAccent[] {
  return Array.from({ length: numerator }, (_, i): BeatAccent => (i === 0 ? 'accent' : 'mute'))
}

export type Subdivision = 'quarter' | 'eighth' | 'triplet' | 'swing'

/** Extra click offsets within one beat interval (as fractions of the beat), after the main click at 0. */
export function subdivisionOffsets(subdivision: Subdivision): number[] {
  switch (subdivision) {
    case 'eighth':
      return [0.5]
    case 'triplet':
      return [1 / 3, 2 / 3]
    case 'swing':
      return [2 / 3]
    case 'quarter':
    default:
      return []
  }
}

/** tempoBpm always refers to quarter-note beats; the click interval follows the meter's own denominator. */
export function secondsPerClick(tempoBpm: number, denominator: number): number {
  return (60 / tempoBpm) * (4 / denominator)
}

/** Gap training mutes audio only, on a per-measure cycle; pattern, meter, and visual beats are unaffected. */
export function isGapMuted(measureIndex: number, gapTraining: GapTrainingSettings | null): boolean {
  if (!gapTraining) return false
  const cycle = gapTraining.soundingMeasures + gapTraining.silentMeasures
  if (cycle <= 0) return false
  return ((measureIndex % cycle) + cycle) % cycle >= gapTraining.soundingMeasures
}

export const DEFAULT_METRONOME_SETTINGS: MetronomeSettings = {
  tempoBpm: 100,
  numerator: 4,
  denominator: 4,
  pattern: defaultPattern(4, 4),
  gapTraining: null,
  subdivision: 'quarter',
}

const STORAGE_KEY = 'fretboard-master:metronome:v1'
const VALID_DENOMINATORS = new Set([2, 4, 8, 16])
const VALID_SUBDIVISIONS = new Set(['quarter', 'eighth', 'triplet', 'swing'])

function isValidSubdivision(value: unknown): value is Subdivision {
  return typeof value === 'string' && VALID_SUBDIVISIONS.has(value)
}

function isValidPattern(value: unknown): value is BeatAccent[] {
  return Array.isArray(value) && value.length > 0 && value.every((v) => v === 'accent' || v === 'normal' || v === 'mute')
}

function isValidGapTraining(value: unknown): value is GapTrainingSettings | null {
  if (value === null) return true
  if (typeof value !== 'object') return false
  const gap = value as Record<string, unknown>
  return typeof gap.soundingMeasures === 'number' && typeof gap.silentMeasures === 'number'
}

function isValidSettings(value: unknown): value is MetronomeSettings {
  if (typeof value !== 'object' || value === null) return false
  const settings = value as Record<string, unknown>
  return (
    typeof settings.tempoBpm === 'number' &&
    settings.tempoBpm >= 30 &&
    settings.tempoBpm <= 300 &&
    typeof settings.numerator === 'number' &&
    settings.numerator >= 1 &&
    settings.numerator <= 16 &&
    typeof settings.denominator === 'number' &&
    VALID_DENOMINATORS.has(settings.denominator) &&
    isValidPattern(settings.pattern) &&
    isValidGapTraining(settings.gapTraining) &&
    (settings.subdivision === undefined || isValidSubdivision(settings.subdivision))
  )
}

export function loadMetronomeSettings(): MetronomeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_METRONOME_SETTINGS
    const parsed: unknown = JSON.parse(raw)
    if (!isValidSettings(parsed)) return DEFAULT_METRONOME_SETTINGS
    // Normalize settings persisted before subdivision existed.
    return { ...parsed, subdivision: isValidSubdivision(parsed.subdivision) ? parsed.subdivision : 'quarter' }
  } catch {
    return DEFAULT_METRONOME_SETTINGS
  }
}

export function saveMetronomeSettings(settings: MetronomeSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage unavailable - settings just won't persist
  }
}

export interface BeatEvent {
  beatIndex: number
  time: number
}

export interface MetronomeLiveSettings {
  tempoBpm: number
  denominator: number
  pattern: BeatAccent[]
  gapTraining: GapTrainingSettings | null
  subdivision: Subdivision
}

const GENERATOR_INTERVAL_MS = 25
const GENERATE_HORIZON_SECONDS = 0.2
const RECENT_BEAT_WINDOW_SECONDS = 2
const SUBDIVISION_CLICK_FREQ = 1400
const SUBDIVISION_CLICK_GAIN = 0.25

/** The playing engine: schedules clicks via the lookahead scheduler and tracks beats for the visual indicator. */
export function createMetronomeEngine() {
  const schedulerHandle = createSchedulerHandle()
  let running = false
  let generatorId: ReturnType<typeof setInterval> | null = null
  let nextBeatTime = 0
  let beatIndex = 0
  let recentBeats: BeatEvent[] = []

  function recordBeat(event: BeatEvent) {
    recentBeats.push(event)
    const cutoff = getAudioContext().currentTime - RECENT_BEAT_WINDOW_SECONDS
    recentBeats = recentBeats.filter((beat) => beat.time >= cutoff)
  }

  function scheduleUpcomingBeats(getSettings: () => MetronomeLiveSettings) {
    const context = getAudioContext()
    const horizon = context.currentTime + GENERATE_HORIZON_SECONDS

    while (nextBeatTime < horizon) {
      const settings = getSettings()
      const patternLength = settings.pattern.length || 1
      const positionInMeasure = beatIndex % patternLength
      const measureIndex = Math.floor(beatIndex / patternLength)
      const accent = settings.pattern[positionInMeasure] ?? 'normal'
      const muted = accent === 'mute' || isGapMuted(measureIndex, settings.gapTraining)
      const time = nextBeatTime
      const index = beatIndex
      const beatInterval = secondsPerClick(settings.tempoBpm, settings.denominator)

      schedulerHandle.schedule([
        {
          time,
          callback: () => {
            if (!muted) {
              playClick(time, accent === 'accent' ? 1800 : 1000)
            }
            recordBeat({ beatIndex: index, time })
          },
        },
      ])

      // Audio-only subdivision clicks inside the beat; they never record a beat or advance the visual indicator.
      if (!muted) {
        for (const offset of subdivisionOffsets(settings.subdivision)) {
          const subTime = time + offset * beatInterval
          schedulerHandle.schedule([
            {
              time: subTime,
              callback: () => playClick(subTime, SUBDIVISION_CLICK_FREQ, 0.04, SUBDIVISION_CLICK_GAIN),
            },
          ])
        }
      }

      nextBeatTime += beatInterval
      beatIndex += 1
    }
  }

  function start(getSettings: () => MetronomeLiveSettings) {
    if (running) return
    running = true
    beatIndex = 0
    recentBeats = []
    nextBeatTime = getAudioContext().currentTime + 0.05
    scheduleUpcomingBeats(getSettings)
    generatorId = setInterval(() => scheduleUpcomingBeats(getSettings), GENERATOR_INTERVAL_MS)
  }

  function stop() {
    running = false
    if (generatorId !== null) {
      clearInterval(generatorId)
      generatorId = null
    }
    schedulerHandle.cancelAll()
    recentBeats = []
  }

  function isRunning() {
    return running
  }

  /** For a UI rAF loop: which beat is currently sounding, based on audioContext.currentTime. */
  function getCurrentBeatIndex(): number | null {
    const now = getAudioContext().currentTime
    let current: number | null = null
    for (const beat of recentBeats) {
      if (beat.time <= now && (current === null || beat.beatIndex > current)) {
        current = beat.beatIndex
      }
    }
    return current
  }

  return { start, stop, isRunning, getCurrentBeatIndex }
}
