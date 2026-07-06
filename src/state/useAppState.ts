import { useContext, type Dispatch } from 'react'
import { AppDispatchContext, AppStateContext, type AppAction, type AppState } from './appStateStore'

export function useAppState(): AppState {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}

export function useAppDispatch(): Dispatch<AppAction> {
  const context = useContext(AppDispatchContext)
  if (!context) throw new Error('useAppDispatch must be used within AppStateProvider')
  return context
}
