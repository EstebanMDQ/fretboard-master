import type { CagedResult } from '../../theory/cagedShapes'
import { useTranslation } from '../../i18n/useTranslation'
import './ChordsPanel.css'

interface ChordsPanelProps {
  symbolInput: string
  result: CagedResult
  positionIndex: number
  onSymbolChange: (symbol: string) => void
  onPositionChange: (positionIndex: number) => void
}

export function ChordsPanel({
  symbolInput,
  result,
  positionIndex,
  onSymbolChange,
  onPositionChange,
}: ChordsPanelProps) {
  const t = useTranslation()
  const positions = result.positions
  const hasPositions = result.supported && positions.length > 0
  const current = hasPositions ? positions[Math.min(positionIndex, positions.length - 1)] : null

  return (
    <div className="chords-panel">
      <h2>{t.chordsPanelTitle}</h2>

      <label className="chords-panel__field">
        {t.chordSymbolLabel}
        <input
          type="text"
          placeholder={t.chordSymbolPlaceholderChords}
          value={symbolInput}
          onChange={(e) => onSymbolChange(e.target.value)}
        />
      </label>

      {!result.supported && <p className="chords-panel__message">{result.reason}</p>}

      {result.supported && symbolInput.trim() === '' && (
        <p className="chords-panel__hint">{t.chordsHint}</p>
      )}

      {result.supported && symbolInput.trim() !== '' && positions.length === 0 && (
        <p className="chords-panel__message">{t.chordsNoShapes}</p>
      )}

      {hasPositions && current && (
        <div className="chords-panel__stepper">
          <div className="chords-panel__stepper-controls">
            <button
              type="button"
              onClick={() => onPositionChange(positionIndex - 1)}
              disabled={positionIndex <= 0}
              aria-label="Previous position"
            >
              &lsaquo;
            </button>
            <span className="chords-panel__position-label">
              {current.shape} shape &middot; fret {current.rootFret}
            </span>
            <button
              type="button"
              onClick={() => onPositionChange(positionIndex + 1)}
              disabled={positionIndex >= positions.length - 1}
              aria-label="Next position"
            >
              &rsaquo;
            </button>
          </div>

          <label className="chords-panel__field">
            Position
            <select value={positionIndex} onChange={(e) => onPositionChange(Number(e.target.value))}>
              {positions.map((position, index) => (
                <option key={`${position.shape}:${position.rootFret}`} value={index}>
                  {position.shape} shape &middot; fret {position.rootFret}
                </option>
              ))}
            </select>
          </label>

          <p className="chords-panel__count">
            {t.chordsPositionOf(Math.min(positionIndex, positions.length - 1) + 1, positions.length)}
          </p>
        </div>
      )}
    </div>
  )
}
