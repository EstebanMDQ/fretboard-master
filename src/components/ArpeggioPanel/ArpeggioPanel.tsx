import { STANDARD_SPELLINGS, spellingToLabel, type Spelling } from '../../theory/notes'
import { parseChordSymbol } from '../../theory/chordParser'
import type { PlaybackDirection } from '../../audio/notes'
import type { ArpeggioToolState } from '../../state/appStateStore'
import { useTranslation } from '../../i18n/useTranslation'
import './ArpeggioPanel.css'

interface ArpeggioPanelProps {
  arpeggioTool: ArpeggioToolState
  onSymbolChange: (symbol: string) => void
  onAddNote: (spelling: Spelling) => void
  onClearNotes: () => void
  onDirectionChange: (direction: PlaybackDirection) => void
  isPlaying: boolean
  canPlay: boolean
  onPlay: () => void
}

function spellingKey(spelling: Spelling): string {
  return `${spelling.letter}${spelling.accidental}`
}

export function ArpeggioPanel({
  arpeggioTool,
  onSymbolChange,
  onAddNote,
  onClearNotes,
  onDirectionChange,
  isPlaying,
  canPlay,
  onPlay,
}: ArpeggioPanelProps) {
  const t = useTranslation()
  const parsed = arpeggioTool.symbolInput.trim() ? parseChordSymbol(arpeggioTool.symbolInput) : null
  const showNoteByNote = arpeggioTool.symbolInput.trim() === '' || parsed?.ok === false

  return (
    <div className="arpeggio-panel">
      <h2>{t.arpeggioPanelTitle}</h2>

      <label className="arpeggio-panel__field">
        {t.chordSymbolLabel}
        <input
          type="text"
          placeholder={t.chordSymbolPlaceholderArpeggio}
          value={arpeggioTool.symbolInput}
          onChange={(e) => onSymbolChange(e.target.value)}
        />
      </label>

      {parsed && !parsed.ok && <p className="arpeggio-panel__error">{parsed.error}</p>}

      {showNoteByNote && (
        <div className="arpeggio-panel__note-by-note">
          <p className="arpeggio-panel__hint">{t.arpeggioHint}</p>
          <div className="arpeggio-panel__picks">
            {arpeggioTool.noteByNote.map((spelling, index) => (
              <span key={index} className="arpeggio-panel__pick">
                {spellingToLabel(spelling)}
              </span>
            ))}
          </div>
          <div className="arpeggio-panel__add-note">
            <select
              value=""
              onChange={(e) => {
                const match = STANDARD_SPELLINGS.find((spelling) => spellingKey(spelling) === e.target.value)
                if (match) onAddNote(match)
              }}
            >
              <option value="" disabled>
                {t.addNotePlaceholder}
              </option>
              {STANDARD_SPELLINGS.map((spelling) => (
                <option key={spellingKey(spelling)} value={spellingKey(spelling)}>
                  {spellingToLabel(spelling)}
                </option>
              ))}
            </select>
            <button type="button" onClick={onClearNotes} disabled={arpeggioTool.noteByNote.length === 0}>
              {t.clearBtn}
            </button>
          </div>
        </div>
      )}

      <div className="arpeggio-panel__playback">
        <label className="arpeggio-panel__playback-field">
          {t.scaleDirection}
          <select
            value={arpeggioTool.playbackDirection}
            onChange={(e) => onDirectionChange(e.target.value as PlaybackDirection)}
          >
            <option value="ascending">{t.directionAscending}</option>
            <option value="descending">{t.directionDescending}</option>
            <option value="both">{t.directionBoth}</option>
          </select>
        </label>
        <button type="button" className="arpeggio-panel__play" onClick={onPlay} disabled={!canPlay}>
          {isPlaying ? t.restartBtn : t.playBtn}
        </button>
      </div>
    </div>
  )
}
