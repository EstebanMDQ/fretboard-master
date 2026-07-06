import { Fretboard } from '../Fretboard/Fretboard'
import { InstrumentPanel } from '../InstrumentPanel/InstrumentPanel'
import { ScalePanel } from '../ScalePanel/ScalePanel'
import { ArpeggioPanel } from '../ArpeggioPanel/ArpeggioPanel'
import { buildMarkers, SCALE_PRESETS } from '../../theory/scales'
import { fallbackDegreeLabel } from '../../theory/degrees'
import { resolveArpeggioChord } from '../../theory/chordParser'
import type { Marker } from '../../theory/notes'
import { useAppDispatch, useAppState } from '../../state/useAppState'
import './AppShell.css'

export function AppShell() {
  const { instrumentConfig, displayMode, activeTool, scaleTool, arpeggioTool } = useAppState()
  const dispatch = useAppDispatch()

  let markers: Marker[] = []
  if (activeTool === 'scale') {
    const intervals = scaleTool.isCustom ? scaleTool.customIntervals : SCALE_PRESETS[scaleTool.presetIndex].intervals
    const degreeLabels = scaleTool.isCustom
      ? scaleTool.customIntervals.map(fallbackDegreeLabel)
      : SCALE_PRESETS[scaleTool.presetIndex].degreeLabels
    markers = buildMarkers(instrumentConfig, scaleTool.root, intervals, degreeLabels, displayMode)
  } else {
    const chord = resolveArpeggioChord(arpeggioTool.symbolInput, arpeggioTool.noteByNote)
    if (chord) {
      markers = buildMarkers(instrumentConfig, chord.root, chord.intervals, chord.degreeLabels, displayMode)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>fretboard-master</h1>
      </header>

      <div className="app-shell__global-controls" aria-label="Global controls">
        <nav className="app-shell__tabs" aria-label="Study tool">
          <button
            type="button"
            className={activeTool === 'scale' ? 'app-shell__tab app-shell__tab--active' : 'app-shell__tab'}
            onClick={() => dispatch({ type: 'setActiveTool', tool: 'scale' })}
          >
            Scales
          </button>
          <button
            type="button"
            className={activeTool === 'arpeggio' ? 'app-shell__tab app-shell__tab--active' : 'app-shell__tab'}
            onClick={() => dispatch({ type: 'setActiveTool', tool: 'arpeggio' })}
          >
            Arpeggios
          </button>
        </nav>

        <label className="app-shell__display-toggle">
          Labels
          <select
            value={displayMode}
            onChange={(e) => dispatch({ type: 'setDisplayMode', displayMode: e.target.value as 'names' | 'degrees' })}
          >
            <option value="names">Note names</option>
            <option value="degrees">Scale degrees</option>
          </select>
        </label>
      </div>

      <aside className="app-shell__panel" aria-label="Controls">
        {activeTool === 'scale' ? (
          <ScalePanel
            scaleTool={scaleTool}
            onRootChange={(root) => dispatch({ type: 'setScaleRoot', root })}
            onPresetChange={(presetIndex) => dispatch({ type: 'selectScalePreset', presetIndex })}
            onCustomMode={() => dispatch({ type: 'setCustomScaleMode' })}
            onToggleCustomInterval={(interval) => dispatch({ type: 'toggleCustomScaleInterval', interval })}
          />
        ) : (
          <ArpeggioPanel
            arpeggioTool={arpeggioTool}
            onSymbolChange={(symbol) => dispatch({ type: 'setArpeggioSymbol', symbol })}
            onAddNote={(spelling) => dispatch({ type: 'addNoteByNote', spelling })}
            onClearNotes={() => dispatch({ type: 'clearNoteByNote' })}
          />
        )}
        <InstrumentPanel
          config={instrumentConfig}
          onChange={(config) => dispatch({ type: 'setInstrumentConfig', config })}
        />
      </aside>
      <main className="app-shell__main" aria-label="Fretboard">
        <Fretboard config={instrumentConfig} markers={markers} />
      </main>
    </div>
  )
}
