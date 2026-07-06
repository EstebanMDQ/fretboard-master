import { createContext, type Dispatch } from 'react'
import type { Spelling } from '../theory/notes'
import { loadInstrumentConfig, type InstrumentConfig } from '../theory/tunings'
import type { DisplayMode } from '../theory/scales'

export interface ScaleToolState {
  root: Spelling
  isCustom: boolean
  presetIndex: number
  customIntervals: number[]
}

export interface AppState {
  instrumentConfig: InstrumentConfig
  displayMode: DisplayMode
  scaleTool: ScaleToolState
}

export type AppAction =
  | { type: 'setInstrumentConfig'; config: InstrumentConfig }
  | { type: 'setDisplayMode'; displayMode: DisplayMode }
  | { type: 'setScaleRoot'; root: Spelling }
  | { type: 'selectScalePreset'; presetIndex: number }
  | { type: 'setCustomScaleMode' }
  | { type: 'toggleCustomScaleInterval'; interval: number }

function initScaleToolState(): ScaleToolState {
  return {
    root: { letter: 'C', accidental: 0 },
    isCustom: false,
    presetIndex: 0,
    customIntervals: [0],
  }
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'setInstrumentConfig':
      return { ...state, instrumentConfig: action.config }
    case 'setDisplayMode':
      return { ...state, displayMode: action.displayMode }
    case 'setScaleRoot':
      return { ...state, scaleTool: { ...state.scaleTool, root: action.root } }
    case 'selectScalePreset':
      return { ...state, scaleTool: { ...state.scaleTool, isCustom: false, presetIndex: action.presetIndex } }
    case 'setCustomScaleMode':
      return { ...state, scaleTool: { ...state.scaleTool, isCustom: true } }
    case 'toggleCustomScaleInterval': {
      const { interval } = action
      if (interval === 0) return state // root is always locked on
      const current = state.scaleTool.customIntervals
      const customIntervals = current.includes(interval)
        ? current.filter((value) => value !== interval)
        : [...current, interval].sort((a, b) => a - b)
      return { ...state, scaleTool: { ...state.scaleTool, customIntervals } }
    }
    default:
      return state
  }
}

export function initAppState(): AppState {
  return {
    instrumentConfig: loadInstrumentConfig(),
    displayMode: 'names',
    scaleTool: initScaleToolState(),
  }
}

export const AppStateContext = createContext<AppState | undefined>(undefined)
export const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined)
