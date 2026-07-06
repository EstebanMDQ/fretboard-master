import { STANDARD_SPELLINGS, spellingToLabel, type Spelling } from '../../theory/notes'
import { parseChordSymbol } from '../../theory/chordParser'
import type { PlaybackDirection } from '../../audio/notes'
import type { ArpeggioToolState } from '../../state/appStateStore'
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
  const parsed = arpeggioTool.symbolInput.trim() ? parseChordSymbol(arpeggioTool.symbolInput) : null
  const showNoteByNote = arpeggioTool.symbolInput.trim() === '' || parsed?.ok === false

  return (
    <div className="arpeggio-panel">
      <h2>Arpeggio</h2>

      <label className="arpeggio-panel__field">
        Chord symbol
        <input
          type="text"
          placeholder="e.g. Cmaj7"
          value={arpeggioTool.symbolInput}
          onChange={(e) => onSymbolChange(e.target.value)}
        />
      </label>

      {parsed && !parsed.ok && <p className="arpeggio-panel__error">{parsed.error}</p>}

      {showNoteByNote && (
        <div className="arpeggio-panel__note-by-note">
          <p className="arpeggio-panel__hint">Or build the chord one note at a time (first pick is the root):</p>
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
                Add note...
              </option>
              {STANDARD_SPELLINGS.map((spelling) => (
                <option key={spellingKey(spelling)} value={spellingKey(spelling)}>
                  {spellingToLabel(spelling)}
                </option>
              ))}
            </select>
            <button type="button" onClick={onClearNotes} disabled={arpeggioTool.noteByNote.length === 0}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="arpeggio-panel__playback">
        <label className="arpeggio-panel__playback-field">
          Direction
          <select
            value={arpeggioTool.playbackDirection}
            onChange={(e) => onDirectionChange(e.target.value as PlaybackDirection)}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
            <option value="both">Both</option>
          </select>
        </label>
        <button type="button" className="arpeggio-panel__play" onClick={onPlay} disabled={!canPlay}>
          {isPlaying ? 'Restart' : 'Play'}
        </button>
      </div>
    </div>
  )
}
