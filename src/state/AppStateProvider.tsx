import { useEffect, useReducer, type ReactNode } from 'react'
import { saveInstrumentConfig } from '../theory/tunings'
import { saveMetronomeSettings } from '../audio/metronome'
import { AppDispatchContext, AppStateContext, appReducer, initAppState } from './appStateStore'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, initAppState)

  useEffect(() => {
    saveInstrumentConfig(state.instrumentConfig)
  }, [state.instrumentConfig])

  useEffect(() => {
    saveMetronomeSettings({
      tempoBpm: state.tempoBpm,
      numerator: state.metronome.numerator,
      denominator: state.metronome.denominator,
      pattern: state.metronome.pattern,
      gapTraining: state.metronome.gapTraining,
      subdivision: state.metronome.subdivision,
    })
  }, [state.tempoBpm, state.metronome])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}
