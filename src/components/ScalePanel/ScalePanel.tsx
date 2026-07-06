import { STANDARD_SPELLINGS, spellingToLabel, type Spelling } from '../../theory/notes'
import { SCALE_PRESETS } from '../../theory/scales'
import type { PlaybackDirection } from '../../audio/notes'
import type { ScaleToolState } from '../../state/appStateStore'
import './ScalePanel.css'

interface ScalePanelProps {
  scaleTool: ScaleToolState
  onRootChange: (root: Spelling) => void
  onPresetChange: (presetIndex: number) => void
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
  onPresetChange,
  onCustomMode,
  onToggleCustomInterval,
  onDirectionChange,
  isPlaying,
  onPlay,
}: ScalePanelProps) {
  return (
    <div className="scale-panel">
      <h2>Scale</h2>

      <label className="scale-panel__field">
        Root
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
        Scale
        <select
          value={scaleTool.isCustom ? 'custom' : String(scaleTool.presetIndex)}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              onCustomMode()
            } else {
              onPresetChange(Number(e.target.value))
            }
          }}
        >
          {SCALE_PRESETS.map((scale, index) => (
            <option key={scale.name} value={index}>
              {scale.name}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </label>

      {scaleTool.isCustom && (
        <fieldset className="scale-panel__custom">
          <legend>Custom scale tones</legend>
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
          Direction
          <select
            value={scaleTool.playbackDirection}
            onChange={(e) => onDirectionChange(e.target.value as PlaybackDirection)}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
            <option value="both">Both</option>
          </select>
        </label>
        <button type="button" className="scale-panel__play" onClick={onPlay}>
          {isPlaying ? 'Restart' : 'Play'}
        </button>
      </div>
    </div>
  )
}
