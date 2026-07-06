import { createContext, type Dispatch } from 'react'
import { loadInstrumentConfig, type InstrumentConfig } from '../theory/tunings'

export interface AppState {
  instrumentConfig: InstrumentConfig
}

export type AppAction = { type: 'setInstrumentConfig'; config: InstrumentConfig }

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'setInstrumentConfig':
      return { ...state, instrumentConfig: action.config }
    default:
      return state
  }
}

export function initAppState(): AppState {
  return { instrumentConfig: loadInstrumentConfig() }
}

export const AppStateContext = createContext<AppState | undefined>(undefined)
export const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined)
