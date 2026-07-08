import { useEffect, useRef, useState } from 'react'
import { unlockAudio } from '../../audio/engine'
import {
  backbeatPattern,
  createMetronomeEngine,
  defaultPattern,
  downbeatOnlyPattern,
  type MetronomeLiveSettings,
  type Subdivision,
} from '../../audio/metronome'
import type { MetronomeToolState } from '../../state/appStateStore'
import './MetronomePanel.css'

interface MetronomePanelProps {
  tempoBpm: number
  metronome: MetronomeToolState
  onTempoChange: (tempoBpm: number) => void
  onMeterChange: (numerator: number, denominator: 2 | 4 | 8 | 16) => void
  onCycleBeat: (index: number) => void
  onSetBeatPattern: (pattern: MetronomeToolState['pattern']) => void
  onSubdivisionChange: (subdivision: Subdivision) => void
  onGapTrainingChange: (gapTraining: MetronomeToolState['gapTraining']) => void
  onToggleCollapsed: () => void
}

const DENOMINATORS = [2, 4, 8, 16] as const

const SUBDIVISIONS: { value: Subdivision; label: string }[] = [
  { value: 'quarter', label: 'Quarter' },
  { value: 'eighth', label: 'Straight 8ths' },
  { value: 'triplet', label: 'Triplets' },
  { value: 'swing', label: 'Swing 8ths' },
]

export function MetronomePanel({
  tempoBpm,
  metronome,
  onTempoChange,
  onMeterChange,
  onCycleBeat,
  onSetBeatPattern,
  onSubdivisionChange,
  onGapTrainingChange,
  onToggleCollapsed,
}: MetronomePanelProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number | null>(null)
  const engineRef = useRef<ReturnType<typeof createMetronomeEngine> | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const liveSettingsRef = useRef<MetronomeLiveSettings>({
    tempoBpm,
    denominator: metronome.denominator,
    pattern: metronome.pattern,
    gapTraining: metronome.gapTraining,
    subdivision: metronome.subdivision,
  })
  useEffect(() => {
    liveSettingsRef.current = {
      tempoBpm,
      denominator: metronome.denominator,
      pattern: metronome.pattern,
      gapTraining: metronome.gapTraining,
      subdivision: metronome.subdivision,
    }
  }, [tempoBpm, metronome.denominator, metronome.pattern, metronome.gapTraining, metronome.subdivision])

  useEffect(() => {
    if (!isPlaying) return
    let frameId: number
    function loop() {
      const index = engineRef.current?.getCurrentBeatIndex() ?? null
      setCurrentBeatIndex((prev) => (prev === index ? prev : index))
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [isPlaying])

  useEffect(() => () => engineRef.current?.stop(), [])

  // Dismiss the overlay on Escape or an outside click while it is open.
  useEffect(() => {
    if (metronome.collapsed) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onToggleCollapsed()
    }
    function onPointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onToggleCollapsed()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [metronome.collapsed, onToggleCollapsed])

  async function handleTogglePlay() {
    if (isPlaying) {
      engineRef.current?.stop()
      setIsPlaying(false)
      setCurrentBeatIndex(null)
      return
    }
    await unlockAudio()
    if (!engineRef.current) {
      engineRef.current = createMetronomeEngine()
    }
    engineRef.current.start(() => liveSettingsRef.current)
    setIsPlaying(true)
  }

  return (
    <div className="metronome-panel" ref={panelRef}>
      <button type="button" className="metronome-panel__toggle" onClick={onToggleCollapsed}>
        Metronome {metronome.collapsed ? '▸' : '▾'}
      </button>

      {!metronome.collapsed && (
        <div className="metronome-panel__body">
          <label className="metronome-panel__field">
            Tempo
            <input
              type="number"
              min={30}
              max={300}
              value={tempoBpm}
              onChange={(e) => onTempoChange(Number(e.target.value))}
            />
          </label>

          <div className="metronome-panel__meter">
            <label className="metronome-panel__field">
              Beats
              <input
                type="number"
                min={1}
                max={16}
                value={metronome.numerator}
                onChange={(e) => onMeterChange(Number(e.target.value), metronome.denominator)}
              />
            </label>
            <label className="metronome-panel__field">
              Note value
              <select
                value={metronome.denominator}
                onChange={(e) => onMeterChange(metronome.numerator, Number(e.target.value) as 2 | 4 | 8 | 16)}
              >
                {DENOMINATORS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="metronome-panel__field">
            Feel
            <select
              value={metronome.subdivision}
              onChange={(e) => onSubdivisionChange(e.target.value as Subdivision)}
            >
              {SUBDIVISIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="metronome-panel__beats">
            {metronome.pattern.map((accent, index) => (
              <button
                key={index}
                type="button"
                className={[
                  'metronome-panel__beat',
                  `metronome-panel__beat--${accent}`,
                  currentBeatIndex !== null && currentBeatIndex % metronome.pattern.length === index
                    ? 'metronome-panel__beat--current'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onCycleBeat(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="metronome-panel__hint">Tap a beat: accent &rarr; normal &rarr; mute</p>

          <div className="metronome-panel__pattern-presets">
            <button type="button" onClick={() => onSetBeatPattern(defaultPattern(metronome.numerator, metronome.denominator))}>
              All beats
            </button>
            <button type="button" onClick={() => onSetBeatPattern(backbeatPattern(metronome.numerator))}>
              Backbeat
            </button>
            <button type="button" onClick={() => onSetBeatPattern(downbeatOnlyPattern(metronome.numerator))}>
              Downbeat only
            </button>
          </div>

          <div className="metronome-panel__gap">
            <label>
              <input
                type="checkbox"
                checked={metronome.gapTraining !== null}
                onChange={(e) =>
                  onGapTrainingChange(e.target.checked ? { soundingMeasures: 2, silentMeasures: 2 } : null)
                }
              />
              Gap training
            </label>
            {metronome.gapTraining && (
              <>
                <label className="metronome-panel__field">
                  Play
                  <input
                    type="number"
                    min={1}
                    value={metronome.gapTraining.soundingMeasures}
                    onChange={(e) =>
                      onGapTrainingChange({
                        ...metronome.gapTraining!,
                        soundingMeasures: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label className="metronome-panel__field">
                  Mute
                  <input
                    type="number"
                    min={1}
                    value={metronome.gapTraining.silentMeasures}
                    onChange={(e) =>
                      onGapTrainingChange({
                        ...metronome.gapTraining!,
                        silentMeasures: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </>
            )}
          </div>

          <button type="button" className="metronome-panel__play" onClick={handleTogglePlay}>
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
      )}
    </div>
  )
}
