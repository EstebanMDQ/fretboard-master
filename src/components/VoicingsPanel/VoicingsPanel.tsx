import type { FindVoicingsResult, Voicing, VoicingTag } from '../../theory/voicings'
import type { VoicingFilter } from '../../state/appStateStore'
import './VoicingsPanel.css'

const FILTER_LABELS: Record<VoicingFilter, string> = {
  'open-strings': 'Open strings',
  spread: 'Spread',
  close: 'Close',
  rootless: 'Rootless',
  'no-fifth': 'No 5th',
  'string-skip': 'String skip',
  stretch: 'Stretch',
}

const FILTER_ORDER: VoicingFilter[] = [
  'open-strings',
  'spread',
  'close',
  'rootless',
  'no-fifth',
  'string-skip',
  'stretch',
]

interface VoicingsPanelProps {
  symbolInput: string
  result: FindVoicingsResult
  visibleVoicings: Voicing[]
  filters: VoicingFilter[]
  selectedIndex: number
  onSymbolChange: (symbol: string) => void
  onToggleFilter: (filter: VoicingFilter) => void
  onSelect: (index: number) => void
}

/** Bass-to-top stack of degree labels, e.g. "1 5 b7 3". */
function degreeStack(voicing: Voicing): string {
  return [...voicing.notes]
    .sort((a, b) => a.midi - b.midi)
    .map((note) => note.label)
    .join(' ')
}

function positionLabel(voicing: Voicing): string {
  const openOnly = voicing.notes.every((note) => note.fret === 0)
  if (openOnly) return 'open'
  const frets = voicing.positions.filter((fret) => fret > 0)
  if (frets.length === 0) return 'open'
  return frets.length === 1 ? `fret ${frets[0]}` : `frets ${frets.join(', ')}`
}

const TAG_LABEL: Record<VoicingTag, string> = {
  'open-strings': 'open',
  spread: 'spread',
  close: 'close',
  rootless: 'rootless',
  'no-fifth': 'no 5th',
  'string-skip': 'skip',
  stretch: 'stretch',
}

export function VoicingsPanel({
  symbolInput,
  result,
  visibleVoicings,
  filters,
  selectedIndex,
  onSymbolChange,
  onToggleFilter,
  onSelect,
}: VoicingsPanelProps) {
  const hasInput = symbolInput.trim() !== ''
  const clampedIndex = Math.min(selectedIndex, Math.max(0, visibleVoicings.length - 1))

  return (
    <div className="voicings-panel">
      <h2>Voicings</h2>

      <label className="voicings-panel__field">
        Chord symbol
        <input
          type="text"
          placeholder="e.g. B13, Cm7b5"
          value={symbolInput}
          onChange={(e) => onSymbolChange(e.target.value)}
        />
      </label>

      {!result.supported && <p className="voicings-panel__message">{result.reason}</p>}

      {result.supported && !hasInput && (
        <p className="voicings-panel__hint">Enter a chord to discover playable voicings on the current tuning.</p>
      )}

      {result.supported && hasInput && (
        <>
          <div className="voicings-panel__filters" role="group" aria-label="Filters">
            {FILTER_ORDER.map((filter) => (
              <button
                key={filter}
                type="button"
                className={
                  filters.includes(filter)
                    ? 'voicings-panel__chip voicings-panel__chip--active'
                    : 'voicings-panel__chip'
                }
                onClick={() => onToggleFilter(filter)}
              >
                {FILTER_LABELS[filter]}
              </button>
            ))}
          </div>

          {visibleVoicings.length === 0 ? (
            <p className="voicings-panel__message">
              {result.voicings.length === 0
                ? 'No playable voicing found for this chord on this tuning.'
                : 'No voicings match the active filters.'}
            </p>
          ) : (
            <>
              <p className="voicings-panel__count">{visibleVoicings.length} shapes</p>
              <ul className="voicings-panel__list">
                {visibleVoicings.map((voicing, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      className={
                        index === clampedIndex
                          ? 'voicings-panel__item voicings-panel__item--active'
                          : 'voicings-panel__item'
                      }
                      onClick={() => onSelect(index)}
                    >
                      <span className="voicings-panel__degrees">{degreeStack(voicing)}</span>
                      <span className="voicings-panel__meta">
                        {positionLabel(voicing)}
                        {voicing.tags.map((tag) => (
                          <span key={tag} className="voicings-panel__tag">
                            {TAG_LABEL[tag]}
                          </span>
                        ))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
