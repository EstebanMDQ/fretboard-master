## 1. Theory: role model and drop-order

- [x] 1.1 In `theory/voicings.ts`, define a `ChordToneRole` model that tags each parsed interval by role (root, third, fifth, alteredFifth, seventh, extension, alteredExtension) from its degree label, and identifies the named extension
- [x] 1.2 Implement `keptTones(intervals, degreeLabels, maxNotes?)`: returns the essential set plus droppable tones in drop-order (fifth, avoid-11, root, unnamed extensions), never dropping third/sus, seventh, named extension, or altered tones
- [x] 1.3 Handle thirdless chords (sus2, sus4, power): keep the sus/5 tone as essential

## 2. Theory: voicing search

- [x] 2.1 Implement per-string candidate generation over an `InstrumentConfig`: muted, open (if open pitch class is kept), and each fretted fret whose pitch class is kept
- [x] 2.2 Enumerate combinations (Cartesian product with pitch-class pruning), keeping candidates with >= 3 sounding strings that cover all essential tones
- [x] 2.3 Apply playability filter: fretted-hand span (open strings excluded), finger budget with one-barre allowance, hard span cap 7
- [x] 2.4 Compute per-voicing metadata: markers (degree-labeled, root emphasized, open strings at fret 0), muted string list, lowest sounding note, fretted-hand span

## 3. Theory: scoring, tags, de-dup

- [x] 3.1 Compute character tags: open-strings, spread, close, rootless, no-fifth, string-skip, stretch (span 6-7)
- [x] 3.2 Compute discovery score: register-weighted adjacency reward, open-string bonus, compactness, root-in-bass bonus; prefer compact over stretched-for-a-droppable-note
- [x] 3.3 De-duplicate by shape signature `(stringIndex, fret - lowestFretted, degree)` + open/muted string sets; collapse octave-equivalent placements, keep open-string voicings distinct; record all positions
- [x] 3.4 Expose `findVoicings(config, symbolInput, options?)` returning `{ supported: boolean; reason?: string; voicings: [...] }`, sorted by score then position

## 4. Theory tests

- [x] 4.1 Test role tagging and drop-order: fifth dropped before guide tones; altered tones never dropped; thirdless chords keep the sus/5
- [x] 4.2 Test essential coverage: every generated voicing contains third/seventh/named-extension/altered tones
- [x] 4.3 Test playability: span cap 7 excludes 8+; finger budget rejects >4 without a barre; open strings excluded from span
- [x] 4.4 Test open strings: DADGAD yields open-string voicings for a D-family chord that standard tuning does not; open strings labeled by degree at fret 0
- [x] 4.5 Test de-dup: octave-equivalent moveable shape collapses to one entry with both positions; open-string voicings stay distinct
- [x] 4.6 Test tags and adjacency: register-weighted adjacency (upper pair scores higher than bass pair); rootless/no-fifth tags correct

## 5. State

- [x] 5.1 Add `'voicings'` to `ActiveTool` and a `VoicingsToolState { symbolInput, filters, selectedIndex }` slice with an initializer in `appStateStore.ts`
- [x] 5.2 Add reducer actions: `setVoicingSymbol` (resets selection), `toggleVoicingFilter`, `setVoicingSelection`; wire into `initAppState`

## 6. Fretboard: muted/open indicators

- [x] 6.1 Add optional `mutedStrings?: number[]` prop to `Fretboard`; render an "x" left of the nut for those strings
- [x] 6.2 Confirm open-string markers (fret 0) render at the nut with their degree label; add CSS as needed

## 7. UI: VoicingsPanel

- [x] 7.1 Create `components/VoicingsPanel/VoicingsPanel.tsx`: chord-symbol input, filter chips, scrollable list of shape entries (degree signature + tags + position), and unsupported/empty messages
- [x] 7.2 Create `components/VoicingsPanel/VoicingsPanel.css` matching existing panel styling

## 8. Integration

- [x] 8.1 Add the Voicings tab to the tool navigation in `AppShell.tsx`
- [x] 8.2 Compute `findVoicings` when the Voicings tool is active, force degree display for its markers, and project the selected voicing (markers + mutedStrings) onto `Fretboard`
- [x] 8.3 Mount `VoicingsPanel`; extend the playback-interruption effect to the voicings state

## 9. Verification

- [x] 9.1 `npm test` passes (new theory tests green)
- [x] 9.2 `npm run lint` clean; `npm run build` succeeds (strict TS, no `any`)
- [x] 9.3 Manual check: B13 on standard vs DADGAD (open-string voicings appear on DADGAD); filter by open-strings; confirm rootless/stretch annotations; confirm degree labels and muted-string marks project onto the fretboard
- [x] 9.4 Run `openspec validate add-voicing-finder` and confirm it passes
