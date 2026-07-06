import { createContext, type Dispatch } from 'react'
import type { Spelling } from '../theory/notes'
import { loadInstrumentConfig, type InstrumentConfig } from '../theory/tunings'
import type { DisplayMode } from '../theory/scales'

export type ActiveTool = 'scale' | 'arpeggio'

export interface ScaleToolState {
  root: Spelling
  isCustom: boolean
  presetIndex: number
  customIntervals: number[]
}

export interface ArpeggioToolState {
  symbolInput: string
  noteByNote: Spelling[]
}

export interface AppState {
  instrumentConfig: InstrumentConfig
  displayMode: DisplayMode
  activeTool: ActiveTool
  scaleTool: ScaleToolState
  arpeggioTool: ArpeggioToolState
}

export type AppAction =
  | { type: 'setInstrumentConfig'; config: InstrumentConfig }
  | { type: 'setDisplayMode'; displayMode: DisplayMode }
  | { type: 'setActiveTool'; tool: ActiveTool }
  | { type: 'setScaleRoot'; root: Spelling }
  | { type: 'selectScalePreset'; presetIndex: number }
  | { type: 'setCustomScaleMode' }
  | { type: 'toggleCustomScaleInterval'; interval: number }
  | { type: 'setArpeggioSymbol'; symbol: string }
  | { type: 'addNoteByNote'; spelling: Spelling }
  | { type: 'clearNoteByNote' }

function initScaleToolState(): ScaleToolState {
  return {
    root: { letter: 'C', accidental: 0 },
    isCustom: false,
    presetIndex: 0,
    customIntervals: [0],
  }
}

function initArpeggioToolState(): ArpeggioToolState {
  return { symbolInput: '', noteByNote: [] }
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'setInstrumentConfig':
      return { ...state, instrumentConfig: action.config }
    case 'setDisplayMode':
      return { ...state, displayMode: action.displayMode }
    case 'setActiveTool':
      return { ...state, activeTool: action.tool }
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
    case 'setArpeggioSymbol':
      return { ...state, arpeggioTool: { ...state.arpeggioTool, symbolInput: action.symbol } }
    case 'addNoteByNote':
      return {
        ...state,
        arpeggioTool: { ...state.arpeggioTool, noteByNote: [...state.arpeggioTool.noteByNote, action.spelling] },
      }
    case 'clearNoteByNote':
      return { ...state, arpeggioTool: { ...state.arpeggioTool, noteByNote: [] } }
    default:
      return state
  }
}

export function initAppState(): AppState {
  return {
    instrumentConfig: loadInstrumentConfig(),
    displayMode: 'names',
    activeTool: 'scale',
    scaleTool: initScaleToolState(),
    arpeggioTool: initArpeggioToolState(),
  }
}

export const AppStateContext = createContext<AppState | undefined>(undefined)
export const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined)
