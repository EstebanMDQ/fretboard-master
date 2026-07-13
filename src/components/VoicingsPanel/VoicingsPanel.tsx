import type { FindVoicingsResult, Voicing, VoicingTag } from '../../theory/voicings'
import type { VoicingFilter } from '../../state/appStateStore'
import { useTranslation } from '../../i18n/useTranslation'
import type { Translations } from '../../i18n/types'
import './VoicingsPanel.css'

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

function filterLabel(filter: VoicingFilter, t: Translations): string {
  const map: Record<VoicingFilter, string> = {
    'open-strings': t.filterOpenStrings,
    spread: t.filterSpread,
    close: t.filterClose,
    rootless: t.filterRootless,
    'no-fifth': t.filterNoFifth,
    'string-skip': t.filterStringSkip,
    stretch: t.filterStretch,
  }
  return map[filter]
}

function tagLabel(tag: VoicingTag, t: Translations): string {
  const map: Record<VoicingTag, string> = {
    'open-strings': t.tagOpen,
    spread: t.tagSpread,
    close: t.tagClose,
    rootless: t.tagRootless,
    'no-fifth': t.tagNoFifth,
    'string-skip': t.tagSkip,
    stretch: t.tagStretch,
  }
  return map[tag]
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
  const t = useTranslation()
  const hasInput = symbolInput.trim() !== ''
  const clampedIndex = Math.min(selectedIndex, Math.max(0, visibleVoicings.length - 1))

  return (
    <div className="voicings-panel">
      <h2>{t.voicingsPanelTitle}</h2>

      <label className="voicings-panel__field">
        {t.chordSymbolLabel}
        <input
          type="text"
          placeholder={t.chordSymbolPlaceholderVoicings}
          value={symbolInput}
          onChange={(e) => onSymbolChange(e.target.value)}
        />
      </label>

      {!result.supported && <p className="voicings-panel__message">{result.reason}</p>}

      {result.supported && !hasInput && (
        <p className="voicings-panel__hint">{t.voicingsHint}</p>
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
                {filterLabel(filter, t)}
              </button>
            ))}
          </div>

          {visibleVoicings.length === 0 ? (
            <p className="voicings-panel__message">
              {result.voicings.length === 0 ? t.voicingsNoVoicing : t.voicingsNoMatch}
            </p>
          ) : (
            <>
              <p className="voicings-panel__count">{t.voicingsShapeCount(visibleVoicings.length)}</p>
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
                            {tagLabel(tag, t)}
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
