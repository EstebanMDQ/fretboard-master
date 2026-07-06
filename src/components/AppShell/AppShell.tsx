import { Fretboard } from '../Fretboard/Fretboard'
import { InstrumentPanel } from '../InstrumentPanel/InstrumentPanel'
import { spellingToLabel, type Marker } from '../../theory/notes'
import { useAppDispatch, useAppState } from '../../state/useAppState'
import './AppShell.css'

export function AppShell() {
  const { instrumentConfig } = useAppState()
  const dispatch = useAppDispatch()

  const markers: Marker[] = instrumentConfig.strings.map((stringConfig, stringIndex) => ({
    string: stringIndex,
    fret: 0,
    label: spellingToLabel(stringConfig.spelling),
    emphasis: true,
  }))

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>fretboard-master</h1>
      </header>
      <aside className="app-shell__panel" aria-label="Controls">
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
