import { useEffect, useReducer, type ReactNode } from 'react'
import { saveInstrumentConfig } from '../theory/tunings'
import { AppDispatchContext, AppStateContext, appReducer, initAppState } from './appStateStore'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, initAppState)

  useEffect(() => {
    saveInstrumentConfig(state.instrumentConfig)
  }, [state.instrumentConfig])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}
