import { Fretboard } from '../Fretboard/Fretboard'
import { InstrumentPanel } from '../InstrumentPanel/InstrumentPanel'
import { ScalePanel } from '../ScalePanel/ScalePanel'
import { buildMarkers, SCALE_PRESETS } from '../../theory/scales'
import { fallbackDegreeLabel } from '../../theory/degrees'
import { useAppDispatch, useAppState } from '../../state/useAppState'
import './AppShell.css'

export function AppShell() {
  const { instrumentConfig, displayMode, scaleTool } = useAppState()
  const dispatch = useAppDispatch()

  const intervals = scaleTool.isCustom ? scaleTool.customIntervals : SCALE_PRESETS[scaleTool.presetIndex].intervals
  const degreeLabels = scaleTool.isCustom
    ? scaleTool.customIntervals.map(fallbackDegreeLabel)
    : SCALE_PRESETS[scaleTool.presetIndex].degreeLabels

  const markers = buildMarkers(instrumentConfig, scaleTool.root, intervals, degreeLabels, displayMode)

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>fretboard-master</h1>
      </header>

      <div className="app-shell__global-controls" aria-label="Global controls">
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
        <ScalePanel
          scaleTool={scaleTool}
          onRootChange={(root) => dispatch({ type: 'setScaleRoot', root })}
          onPresetChange={(presetIndex) => dispatch({ type: 'selectScalePreset', presetIndex })}
          onCustomMode={() => dispatch({ type: 'setCustomScaleMode' })}
          onToggleCustomInterval={(interval) => dispatch({ type: 'toggleCustomScaleInterval', interval })}
        />
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
