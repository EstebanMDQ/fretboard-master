import { createContext, type Dispatch } from 'react'
import type { Spelling } from '../theory/notes'
import { loadInstrumentConfig, type InstrumentConfig } from '../theory/tunings'
import type { DisplayMode } from '../theory/scales'
import {
  cycleAccent,
  defaultPattern,
  loadMetronomeSettings,
  type BeatAccent,
  type GapTrainingSettings,
} from '../audio/metronome'
import type { PlaybackDirection } from '../audio/notes'

export type ActiveTool = 'scale' | 'arpeggio'

export interface ScaleToolState {
  root: Spelling
  isCustom: boolean
  presetIndex: number
  customIntervals: number[]
  playbackDirection: PlaybackDirection
}

export interface ArpeggioToolState {
  symbolInput: string
  noteByNote: Spelling[]
}

export interface MetronomeToolState {
  numerator: number
  denominator: 2 | 4 | 8 | 16
  pattern: BeatAccent[]
  gapTraining: GapTrainingSettings | null
  collapsed: boolean
}

export interface AppState {
  instrumentConfig: InstrumentConfig
  displayMode: DisplayMode
  activeTool: ActiveTool
  scaleTool: ScaleToolState
  arpeggioTool: ArpeggioToolState
  tempoBpm: number
  metronome: MetronomeToolState
}

export type AppAction =
  | { type: 'setInstrumentConfig'; config: InstrumentConfig }
  | { type: 'setDisplayMode'; displayMode: DisplayMode }
  | { type: 'setActiveTool'; tool: ActiveTool }
  | { type: 'setScaleRoot'; root: Spelling }
  | { type: 'selectScalePreset'; presetIndex: number }
  | { type: 'setCustomScaleMode' }
  | { type: 'toggleCustomScaleInterval'; interval: number }
  | { type: 'setScalePlaybackDirection'; direction: PlaybackDirection }
  | { type: 'setArpeggioSymbol'; symbol: string }
  | { type: 'addNoteByNote'; spelling: Spelling }
  | { type: 'clearNoteByNote' }
  | { type: 'setTempoBpm'; tempoBpm: number }
  | { type: 'setMeter'; numerator: number; denominator: 2 | 4 | 8 | 16 }
  | { type: 'cycleBeatAccent'; index: number }
  | { type: 'setGapTraining'; gapTraining: GapTrainingSettings | null }
  | { type: 'toggleMetronomeCollapsed' }

function initScaleToolState(): ScaleToolState {
  return {
    root: { letter: 'C', accidental: 0 },
    isCustom: false,
    presetIndex: 0,
    customIntervals: [0],
    playbackDirection: 'ascending',
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
    case 'setScalePlaybackDirection':
      return { ...state, scaleTool: { ...state.scaleTool, playbackDirection: action.direction } }
    case 'setArpeggioSymbol':
      return { ...state, arpeggioTool: { ...state.arpeggioTool, symbolInput: action.symbol } }
    case 'addNoteByNote':
      return {
        ...state,
        arpeggioTool: { ...state.arpeggioTool, noteByNote: [...state.arpeggioTool.noteByNote, action.spelling] },
      }
    case 'clearNoteByNote':
      return { ...state, arpeggioTool: { ...state.arpeggioTool, noteByNote: [] } }
    case 'setTempoBpm':
      return { ...state, tempoBpm: Math.min(300, Math.max(30, action.tempoBpm)) }
    case 'setMeter':
      return {
        ...state,
        metronome: {
          ...state.metronome,
          numerator: action.numerator,
          denominator: action.denominator,
          pattern: defaultPattern(action.numerator, action.denominator),
        },
      }
    case 'cycleBeatAccent': {
      const pattern = state.metronome.pattern.map((accent, index) =>
        index === action.index ? cycleAccent(accent) : accent,
      )
      return { ...state, metronome: { ...state.metronome, pattern } }
    }
    case 'setGapTraining':
      return { ...state, metronome: { ...state.metronome, gapTraining: action.gapTraining } }
    case 'toggleMetronomeCollapsed':
      return { ...state, metronome: { ...state.metronome, collapsed: !state.metronome.collapsed } }
    default:
      return state
  }
}

export function initAppState(): AppState {
  const storedMetronome = loadMetronomeSettings()
  return {
    instrumentConfig: loadInstrumentConfig(),
    displayMode: 'names',
    activeTool: 'scale',
    scaleTool: initScaleToolState(),
    arpeggioTool: initArpeggioToolState(),
    tempoBpm: storedMetronome.tempoBpm,
    metronome: {
      numerator: storedMetronome.numerator,
      denominator: storedMetronome.denominator,
      pattern: storedMetronome.pattern,
      gapTraining: storedMetronome.gapTraining,
      collapsed: true,
    },
  }
}

export const AppStateContext = createContext<AppState | undefined>(undefined)
export const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined)
