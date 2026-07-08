## 1. Theory: CAGED shapes

- [x] 1.1 Add `extension?: boolean` to the `Marker` interface in `theory/notes.ts`
- [x] 1.2 Add `isStandardGuitarTuning(config)` to `theory/tunings.ts` (6 strings, open pitch classes E B G D A E)
- [x] 1.3 Create `theory/cagedShapes.ts` with the 5 major shape templates (anchor string + per-string degree/fretOffset), an `alterDegrees(template, quality)` deriving minor (3rd -1), diminished (3rd -1, 5th -1), and augmented (5th +1), and a `triadFromIntervals` helper returning 'major' | 'minor' | 'diminished' | 'augmented' | null with the chosen 3rd/5th intervals
- [x] 1.4 Implement placement: for a root pitch class + triad type, enumerate every anchor fret (base, base+12, ...) whose whole grip fits in `[0, fretCount]` across all 5 shapes; return placements (including octave repeats) ordered by ascending fret, each with shape name, fret window, and triad markers
- [x] 1.5 Implement extension-tone marking: given a placement's fret window and the chord's extra intervals, produce `extension` markers (window +/-1 fret) with honest degree labels
- [x] 1.6 Expose a top-level `buildCagedPositions(config, chordSymbolOrParse)` returning `{ supported: boolean; reason?: string; positions: [...] }`, gating on tuning and triad support

## 2. Theory tests

- [x] 2.1 Test shape geometry for a known chord (e.g. C major, A minor): correct strings/frets/degrees per shape
- [x] 2.2 Test derivations: minor = 3rd lowered; diminished = 3rd and 5th lowered; augmented = 5th raised
- [x] 2.3 Test placement enumeration: octave repeats included (e.g. A major A-shape at fret 0 and 12), C/G shapes with negative offsets skip their below-neck octave, and placements overflowing `fretCount` are excluded
- [x] 2.4 Test triad extraction: maj/min/6/m6/7/maj7/m7/9/11/13/dim/dim7/m7b5/aug supported; sus2/sus4/5 unsupported
- [x] 2.5 Test extension marking: G7 marks b7 in-window; Cmaj9 labels "9" not "2"
- [x] 2.6 Test `isStandardGuitarTuning` accepts standard guitar, rejects ukulele/bass/7-string/custom

## 3. State

- [x] 3.1 Add `'chords'` to `ActiveTool` and a `ChordsToolState { symbolInput: string; positionIndex: number }` slice in `appStateStore.ts` with an initializer
- [x] 3.2 Add reducer actions: `setChordSymbol` (resets `positionIndex` to 0) and `setChordPosition`
- [x] 3.3 Wire the new state into `initAppState`

## 4. UI: ChordsPanel

- [x] 4.1 Create `components/ChordsPanel/ChordsPanel.tsx`: chord symbol input, position stepper (prev/next + selector showing shape name and fret), and the not-supported/tuning messages
- [x] 4.2 Create `components/ChordsPanel/ChordsPanel.css`, matching existing panel styling
- [x] 4.3 Render `extension` markers distinctly (hollow/dashed) in `Fretboard.tsx` and `Fretboard.css`

## 5. Integration

- [x] 5.1 Add the Chords tab to the tool navigation in `AppShell.tsx`
- [x] 5.2 Compute CAGED positions when the Chords tool is active and pass the selected shape's markers to `Fretboard`
- [x] 5.3 Mount `ChordsPanel` when the Chords tool is active; extend the playback-interruption effect to the chords state
- [x] 5.4 Update the stale "two tabs" label/assumptions if any exist in shell tests or copy

## 6. Verification

- [x] 6.1 `npm test` passes (new theory tests green)
- [x] 6.2 `npm run lint` clean; `npm run build` succeeds (strict TS, no `any`)
- [x] 6.3 Manual check: enter A, step through positions including the octave-repeated A-shape; try Bdim and Caug shapes; switch to ukulele and confirm the tuning message; confirm Dsus4 shows the thirdless-unsupported message; enter Cmaj9 and confirm the 9th shows as an extension
- [x] 6.4 Run `openspec validate add-chords-caged` and confirm it passes
