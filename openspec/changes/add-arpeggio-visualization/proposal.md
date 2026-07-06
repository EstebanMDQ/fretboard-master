# Proposal: add-arpeggio-visualization

## Why

Guitarists and other fretted-instrument players study chord tones as much as scales. This change adds chord theory, a chord-symbol parser, and an arpeggio tool that highlights all chord tones on the fretboard, alongside tool-switching in the shell so users can move between Scales and Arpeggios.

## What Changes

- Add chord theory data: `{ suffixes: string[], intervals: number[] }` per quality, covering maj, min, dim, aug, sus2, sus4, 7, maj7, m7, m7b5, dim7, 6, m6, 9, maj9, m9, add9, 11, 13, and power chord. Extended chords (9/11/13) store true intervals beyond 12 (9th=14, 11th=17, 13th=21), folded to pitch classes only at render time
- Add a hand-written chord-symbol parser (not a grammar library): matches root (letter + accidental) then the longest known suffix, tolerant of common synonyms (maj7/M7, m/min/-), with a typed `ok`/`error` result - unparsed input never renders a guess
- Add a note-by-note chord builder as a fallback: pick notes from the 17 standard spellings as absolute notes (first picked note is the root), pre-seeded with any root the parser did manage to extract
- Add `ArpeggioPanel`: chord symbol input plus the note-by-note fallback builder, reusing `buildMarkers` and the shared display toggle from `add-scale-visualization`
- Add a two-tab shell navigation (Scales | Arpeggios); each tool's state persists independently so switching tabs restores prior selections

## Capabilities

### New Capabilities

- `chord-parsing`: parse chord symbols into root + intervals, or a typed error
- `arpeggio-visualization`: highlight a chord's tones on the fretboard, via symbol entry or note-by-note building

### Modified Capabilities

- `app-shell`: adds Scales | Arpeggios tool navigation

## Impact

- New files: `src/theory/chords.ts`, `src/theory/chordParser.ts`, `src/components/ArpeggioPanel/`
- Depends on: `add-fretboard-rendering` (`Marker` API) and `add-scale-visualization` (`buildMarkers`, display toggle)
- Non-goal: slash-chord bass notes are parsed but ignored for tone-set purposes; no chord audio in this change (see `add-arpeggio-playback`)
