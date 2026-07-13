import { STANDARD_SPELLINGS, spellingToLabel, type Spelling } from '../../theory/notes'
import { SCALE_FAMILIES } from '../../theory/scales'
import type { PlaybackDirection } from '../../audio/notes'
import type { ScaleToolState } from '../../state/appStateStore'
import { useTranslation } from '../../i18n/useTranslation'
import './ScalePanel.css'

interface ScalePanelProps {
  scaleTool: ScaleToolState
  onRootChange: (root: Spelling) => void
  onFamilyChange: (familyIndex: number) => void
  onModeChange: (modeIndex: number) => void
  onCustomMode: () => void
  onToggleCustomInterval: (interval: number) => void
  onDirectionChange: (direction: PlaybackDirection) => void
  isPlaying: boolean
  onPlay: () => void
}

function spellingKey(spelling: Spelling): string {
  return `${spelling.letter}${spelling.accidental}`
}

export function ScalePanel({
  scaleTool,
  onRootChange,
  onFamilyChange,
  onModeChange,
  onCustomMode,
  onToggleCustomInterval,
  onDirectionChange,
  isPlaying,
  onPlay,
}: ScalePanelProps) {
  const t = useTranslation()
  const currentFamily = SCALE_FAMILIES[scaleTool.familyIndex]

  return (
    <div className="scale-panel">
      <h2>{t.scalePanelTitle}</h2>

      <label className="scale-panel__field">
        {t.scaleRoot}
        <select
          value={spellingKey(scaleTool.root)}
          onChange={(e) => {
            const match = STANDARD_SPELLINGS.find((spelling) => spellingKey(spelling) === e.target.value)
            if (match) onRootChange(match)
          }}
        >
          {STANDARD_SPELLINGS.map((spelling) => (
            <option key={spellingKey(spelling)} value={spellingKey(spelling)}>
              {spellingToLabel(spelling)}
            </option>
          ))}
        </select>
      </label>

      <label className="scale-panel__field">
        {t.scaleFamily}
        <select
          value={scaleTool.isCustom ? 'custom' : String(scaleTool.familyIndex)}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              onCustomMode()
            } else {
              onFamilyChange(Number(e.target.value))
            }
          }}
        >
          {SCALE_FAMILIES.map((family, index) => (
            <option key={family.name} value={index}>
              {family.name}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </label>

      {!scaleTool.isCustom && (
        <label className="scale-panel__field">
          {t.scaleMode}
          <select
            value={String(scaleTool.modeIndex)}
            onChange={(e) => onModeChange(Number(e.target.value))}
          >
            {currentFamily.modes.map((mode, index) => (
              <option key={mode.name} value={index}>
                {mode.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {scaleTool.isCustom && (
        <fieldset className="scale-panel__custom">
          <legend>{t.scaleCustomTones}</legend>
          {Array.from({ length: 12 }, (_, interval) => interval).map((interval) => (
            <label key={interval} className="scale-panel__toggle">
              <input
                type="checkbox"
                checked={scaleTool.customIntervals.includes(interval)}
                disabled={interval === 0}
                onChange={() => onToggleCustomInterval(interval)}
              />
              {interval}
            </label>
          ))}
        </fieldset>
      )}

      <div className="scale-panel__playback">
        <label className="scale-panel__field">
          {t.scaleDirection}
          <select
            value={scaleTool.playbackDirection}
            onChange={(e) => onDirectionChange(e.target.value as PlaybackDirection)}
          >
            <option value="ascending">{t.directionAscending}</option>
            <option value="descending">{t.directionDescending}</option>
            <option value="both">{t.directionBoth}</option>
          </select>
        </label>
        <button type="button" className="scale-panel__play" onClick={onPlay}>
          {isPlaying ? t.restartBtn : t.playBtn}
        </button>
      </div>
    </div>
  )
}
