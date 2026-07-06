# Tasks: add-arpeggio-visualization

## 1. Chord theory

- [ ] 1.1 Define chord quality shape `{ suffixes, intervals }` and catalog (maj through power chord) in `src/theory/chords.ts`
- [ ] 1.2 Implement pitch-class folding for extended chords (9/11/13) that preserves true-interval degree labels
- [ ] 1.3 Implement the hand-written chord-symbol parser in `src/theory/chordParser.ts` (root + longest-suffix match, synonyms, typed ok/error result)

## 2. Arpeggio tool UI

- [ ] 2.1 Implement `ArpeggioPanel` chord-symbol input wired through the parser and `buildMarkers`
- [ ] 2.2 Implement the note-by-note fallback builder (17 standard spellings, first pick is root), triggered on parse error and pre-seeded with any parsed root
- [ ] 2.3 Reuse the shared display mode toggle for note-name/degree labels

## 3. Shell tool switching

- [ ] 3.1 Add Scales | Arpeggios tab navigation to `AppShell`
- [ ] 3.2 Persist each tool's state independently across tab switches

## 4. Verification

- [ ] 4.1 Add Vitest coverage for the chord catalog, pitch-class folding, and the parser (including synonyms, longest-match, and error cases)
- [ ] 4.2 Verify `npm test`, `npm run lint`, and `npm run build` all pass
