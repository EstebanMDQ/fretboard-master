import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
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

const SUBDIVISION_VALUES: Subdivision[] = ['quarter', 'eighth', 'triplet', 'swing']

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
  const t = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number | null>(null)
  const engineRef = useRef<ReturnType<typeof createMetronomeEngine> | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const subdivisionLabels: Record<Subdivision, string> = {
    quarter: t.subdivisionQuarter,
    eighth: t.subdivisionEighth,
    triplet: t.subdivisionTriplet,
    swing: t.subdivisionSwing,
  }

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
        {t.metronomeToggle} {metronome.collapsed ? '▸' : '▾'}
      </button>

      {!metronome.collapsed && (
        <div className="metronome-panel__body">
          <label className="metronome-panel__field">
            {t.tempoLabel}
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
              {t.beatsLabel}
              <input
                type="number"
                min={1}
                max={16}
                value={metronome.numerator}
                onChange={(e) => onMeterChange(Number(e.target.value), metronome.denominator)}
              />
            </label>
            <label className="metronome-panel__field">
              {t.noteValueLabel}
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
            {t.feelLabel}
            <select
              value={metronome.subdivision}
              onChange={(e) => onSubdivisionChange(e.target.value as Subdivision)}
            >
              {SUBDIVISION_VALUES.map((value) => (
                <option key={value} value={value}>
                  {subdivisionLabels[value]}
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
          <p className="metronome-panel__hint">{t.metronomeBeatHint}</p>

          <div className="metronome-panel__pattern-presets">
            <button type="button" onClick={() => onSetBeatPattern(defaultPattern(metronome.numerator, metronome.denominator))}>
              {t.beatPatternAllBeats}
            </button>
            <button type="button" onClick={() => onSetBeatPattern(backbeatPattern(metronome.numerator))}>
              {t.beatPatternBackbeat}
            </button>
            <button type="button" onClick={() => onSetBeatPattern(downbeatOnlyPattern(metronome.numerator))}>
              {t.beatPatternDownbeat}
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
              {t.gapTrainingLabel}
            </label>
            {metronome.gapTraining && (
              <>
                <label className="metronome-panel__field">
                  {t.gapPlayLabel}
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
                  {t.gapMuteLabel}
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
            {isPlaying ? t.metronomeStopBtn : t.metronomePlayBtn}
          </button>
        </div>
      )}
    </div>
  )
}
