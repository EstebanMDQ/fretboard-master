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
  type Subdivision,
} from '../audio/metronome'
import type { PlaybackDirection } from '../audio/notes'

export type ActiveTool = 'scale' | 'arpeggio' | 'chords' | 'voicings'

export type VoicingFilter = 'open-strings' | 'spread' | 'close' | 'rootless' | 'no-fifth' | 'string-skip' | 'stretch'

export interface ScaleToolState {
  root: Spelling
  isCustom: boolean
  familyIndex: number
  modeIndex: number
  customIntervals: number[]
  playbackDirection: PlaybackDirection
}

export interface ArpeggioToolState {
  symbolInput: string
  noteByNote: Spelling[]
  playbackDirection: PlaybackDirection
}

export interface ChordsToolState {
  symbolInput: string
  positionIndex: number
}

export interface VoicingsToolState {
  symbolInput: string
  filters: VoicingFilter[]
  selectedIndex: number
}

export interface MetronomeToolState {
  numerator: number
  denominator: 2 | 4 | 8 | 16
  pattern: BeatAccent[]
  gapTraining: GapTrainingSettings | null
  subdivision: Subdivision
  collapsed: boolean
}

export interface AppState {
  instrumentConfig: InstrumentConfig
  displayMode: DisplayMode
  activeTool: ActiveTool
  scaleTool: ScaleToolState
  arpeggioTool: ArpeggioToolState
  chordsTool: ChordsToolState
  voicingsTool: VoicingsToolState
  tempoBpm: number
  metronome: MetronomeToolState
}

export type AppAction =
  | { type: 'setInstrumentConfig'; config: InstrumentConfig }
  | { type: 'setDisplayMode'; displayMode: DisplayMode }
  | { type: 'setActiveTool'; tool: ActiveTool }
  | { type: 'setScaleRoot'; root: Spelling }
  | { type: 'selectScaleFamily'; familyIndex: number }
  | { type: 'selectScaleMode'; modeIndex: number }
  | { type: 'setCustomScaleMode' }
  | { type: 'toggleCustomScaleInterval'; interval: number }
  | { type: 'setScalePlaybackDirection'; direction: PlaybackDirection }
  | { type: 'setArpeggioSymbol'; symbol: string }
  | { type: 'addNoteByNote'; spelling: Spelling }
  | { type: 'clearNoteByNote' }
  | { type: 'setArpeggioPlaybackDirection'; direction: PlaybackDirection }
  | { type: 'setChordSymbol'; symbol: string }
  | { type: 'setChordPosition'; positionIndex: number }
  | { type: 'setVoicingSymbol'; symbol: string }
  | { type: 'toggleVoicingFilter'; filter: VoicingFilter }
  | { type: 'setVoicingSelection'; selectedIndex: number }
  | { type: 'setTempoBpm'; tempoBpm: number }
  | { type: 'setMeter'; numerator: number; denominator: 2 | 4 | 8 | 16 }
  | { type: 'cycleBeatAccent'; index: number }
  | { type: 'setBeatPattern'; pattern: BeatAccent[] }
  | { type: 'setGapTraining'; gapTraining: GapTrainingSettings | null }
  | { type: 'setSubdivision'; subdivision: Subdivision }
  | { type: 'toggleMetronomeCollapsed' }

function initScaleToolState(): ScaleToolState {
  return {
    root: { letter: 'C', accidental: 0 },
    isCustom: false,
    familyIndex: 0,
    modeIndex: 0,
    customIntervals: [0],
    playbackDirection: 'ascending',
  }
}

function initArpeggioToolState(): ArpeggioToolState {
  return { symbolInput: '', noteByNote: [], playbackDirection: 'ascending' }
}

function initChordsToolState(): ChordsToolState {
  return { symbolInput: '', positionIndex: 0 }
}

function initVoicingsToolState(): VoicingsToolState {
  return { symbolInput: '', filters: [], selectedIndex: 0 }
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
    case 'selectScaleFamily':
      return { ...state, scaleTool: { ...state.scaleTool, isCustom: false, familyIndex: action.familyIndex, modeIndex: 0 } }
    case 'selectScaleMode':
      return { ...state, scaleTool: { ...state.scaleTool, isCustom: false, modeIndex: action.modeIndex } }
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
    case 'setArpeggioPlaybackDirection':
      return { ...state, arpeggioTool: { ...state.arpeggioTool, playbackDirection: action.direction } }
    case 'setChordSymbol':
      // Changing the chord invalidates the current position, so reset to the first shape.
      return { ...state, chordsTool: { symbolInput: action.symbol, positionIndex: 0 } }
    case 'setChordPosition':
      return { ...state, chordsTool: { ...state.chordsTool, positionIndex: action.positionIndex } }
    case 'setVoicingSymbol':
      // Changing the chord invalidates the current selection.
      return { ...state, voicingsTool: { ...state.voicingsTool, symbolInput: action.symbol, selectedIndex: 0 } }
    case 'toggleVoicingFilter': {
      const { filter } = action
      const filters = state.voicingsTool.filters.includes(filter)
        ? state.voicingsTool.filters.filter((value) => value !== filter)
        : [...state.voicingsTool.filters, filter]
      // Changing the visible set invalidates the current selection.
      return { ...state, voicingsTool: { ...state.voicingsTool, filters, selectedIndex: 0 } }
    }
    case 'setVoicingSelection':
      return { ...state, voicingsTool: { ...state.voicingsTool, selectedIndex: action.selectedIndex } }
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
    case 'setBeatPattern':
      return { ...state, metronome: { ...state.metronome, pattern: action.pattern } }
    case 'setGapTraining':
      return { ...state, metronome: { ...state.metronome, gapTraining: action.gapTraining } }
    case 'setSubdivision':
      return { ...state, metronome: { ...state.metronome, subdivision: action.subdivision } }
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
    chordsTool: initChordsToolState(),
    voicingsTool: initVoicingsToolState(),
    tempoBpm: storedMetronome.tempoBpm,
    metronome: {
      numerator: storedMetronome.numerator,
      denominator: storedMetronome.denominator,
      pattern: storedMetronome.pattern,
      gapTraining: storedMetronome.gapTraining,
      subdivision: storedMetronome.subdivision,
      collapsed: true,
    },
  }
}

export const AppStateContext = createContext<AppState | undefined>(undefined)
export const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined)
