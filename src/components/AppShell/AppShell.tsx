import './AppShell.css'

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>fretboard-master</h1>
      </header>
      <aside className="app-shell__panel" aria-label="Controls">
        <p className="app-shell__placeholder">Controls will appear here.</p>
      </aside>
      <main className="app-shell__main" aria-label="Fretboard">
        <p className="app-shell__placeholder">The fretboard will appear here.</p>
      </main>
    </div>
  )
}
