import { AppShell } from './components/AppShell/AppShell'
import { AppStateProvider } from './state/AppStateProvider'

function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  )
}

export default App
