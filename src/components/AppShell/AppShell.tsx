import { useEffect, useRef } from 'react'
import { Fretboard } from '../Fretboard/Fretboard'
import { InstrumentPanel } from '../InstrumentPanel/InstrumentPanel'
import { ScalePanel } from '../ScalePanel/ScalePanel'
import { ArpeggioPanel } from '../ArpeggioPanel/ArpeggioPanel'
import { ChordsPanel } from '../ChordsPanel/ChordsPanel'
import { MetronomePanel } from '../MetronomePanel/MetronomePanel'
import { buildMarkers, SCALE_PRESETS } from '../../theory/scales'
import { fallbackDegreeLabel } from '../../theory/degrees'
import { resolveArpeggioChord } from '../../theory/chordParser'
import { buildCagedPositions } from '../../theory/cagedShapes'
import type { Marker } from '../../theory/notes'
import { useSequencePlayback } from '../../audio/useSequencePlayback'
import { useAppDispatch, useAppState } from '../../state/useAppState'
import './AppShell.css'

export function AppShell() {
  const { instrumentConfig, displayMode, activeTool, scaleTool, arpeggioTool, chordsTool, tempoBpm, metronome } =
    useAppState()
  const dispatch = useAppDispatch()
  const notePlayback = useSequencePlayback()

  const scaleIntervals = scaleTool.isCustom
    ? scaleTool.customIntervals
    : SCALE_PRESETS[scaleTool.presetIndex].intervals
  const scaleDegreeLabels = scaleTool.isCustom
    ? scaleTool.customIntervals.map(fallbackDegreeLabel)
    : SCALE_PRESETS[scaleTool.presetIndex].degreeLabels

  const chord = resolveArpeggioChord(arpeggioTool.symbolInput, arpeggioTool.noteByNote)

  const cagedResult = buildCagedPositions(instrumentConfig, chordsTool.symbolInput, displayMode)
  const cagedPositions = cagedResult.supported ? cagedResult.positions : []
  const currentCagedPosition =
    cagedPositions.length > 0
      ? cagedPositions[Math.min(chordsTool.positionIndex, cagedPositions.length - 1)]
      : null

  // Interruption rules: changing scale/chord, root, tuning, or switching tools stops playback.
  const stopPlaybackRef = useRef(notePlayback.stop)
  useEffect(() => {
    stopPlaybackRef.current = notePlayback.stop
  })
  useEffect(() => {
    stopPlaybackRef.current()
  }, [
    instrumentConfig,
    activeTool,
    scaleTool.root,
    scaleTool.isCustom,
    scaleTool.presetIndex,
    scaleTool.customIntervals,
    arpeggioTool.symbolInput,
    arpeggioTool.noteByNote,
    chordsTool.symbolInput,
  ])

  let markers: Marker[] = []
  if (activeTool === 'scale') {
    markers = buildMarkers(instrumentConfig, scaleTool.root, scaleIntervals, scaleDegreeLabels, displayMode)
  } else if (activeTool === 'arpeggio') {
    if (chord) {
      markers = buildMarkers(instrumentConfig, chord.root, chord.intervals, chord.degreeLabels, displayMode)
    }
  } else if (currentCagedPosition) {
    markers = currentCagedPosition.markers
  }
  if (notePlayback.isPlaying && notePlayback.currentInterval !== null) {
    markers = markers.map((marker) => ({ ...marker, pulsing: marker.degree === notePlayback.currentInterval }))
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
          <button
            type="button"
            className={activeTool === 'chords' ? 'app-shell__tab app-shell__tab--active' : 'app-shell__tab'}
            onClick={() => dispatch({ type: 'setActiveTool', tool: 'chords' })}
          >
            Chords
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

        <MetronomePanel
          tempoBpm={tempoBpm}
          metronome={metronome}
          onTempoChange={(value) => dispatch({ type: 'setTempoBpm', tempoBpm: value })}
          onMeterChange={(numerator, denominator) => dispatch({ type: 'setMeter', numerator, denominator })}
          onCycleBeat={(index) => dispatch({ type: 'cycleBeatAccent', index })}
          onSetBeatPattern={(pattern) => dispatch({ type: 'setBeatPattern', pattern })}
          onSubdivisionChange={(subdivision) => dispatch({ type: 'setSubdivision', subdivision })}
          onGapTrainingChange={(gapTraining) => dispatch({ type: 'setGapTraining', gapTraining })}
          onToggleCollapsed={() => dispatch({ type: 'toggleMetronomeCollapsed' })}
        />
      </div>

      <aside className="app-shell__panel" aria-label="Controls">
        {activeTool === 'scale' && (
          <ScalePanel
            scaleTool={scaleTool}
            onRootChange={(root) => dispatch({ type: 'setScaleRoot', root })}
            onPresetChange={(presetIndex) => dispatch({ type: 'selectScalePreset', presetIndex })}
            onCustomMode={() => dispatch({ type: 'setCustomScaleMode' })}
            onToggleCustomInterval={(interval) => dispatch({ type: 'toggleCustomScaleInterval', interval })}
            onDirectionChange={(direction) => dispatch({ type: 'setScalePlaybackDirection', direction })}
            isPlaying={notePlayback.isPlaying}
            onPlay={() =>
              notePlayback.play({
                root: scaleTool.root,
                intervals: scaleIntervals,
                tempoBpm,
                direction: scaleTool.playbackDirection,
              })
            }
          />
        )}
        {activeTool === 'arpeggio' && (
          <ArpeggioPanel
            arpeggioTool={arpeggioTool}
            onSymbolChange={(symbol) => dispatch({ type: 'setArpeggioSymbol', symbol })}
            onAddNote={(spelling) => dispatch({ type: 'addNoteByNote', spelling })}
            onClearNotes={() => dispatch({ type: 'clearNoteByNote' })}
            onDirectionChange={(direction) => dispatch({ type: 'setArpeggioPlaybackDirection', direction })}
            isPlaying={notePlayback.isPlaying}
            canPlay={chord !== null}
            onPlay={() => {
              if (!chord) return
              notePlayback.play({
                root: chord.root,
                intervals: chord.intervals,
                tempoBpm,
                direction: arpeggioTool.playbackDirection,
              })
            }}
          />
        )}
        {activeTool === 'chords' && (
          <ChordsPanel
            symbolInput={chordsTool.symbolInput}
            result={cagedResult}
            positionIndex={chordsTool.positionIndex}
            onSymbolChange={(symbol) => dispatch({ type: 'setChordSymbol', symbol })}
            onPositionChange={(positionIndex) => dispatch({ type: 'setChordPosition', positionIndex })}
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
