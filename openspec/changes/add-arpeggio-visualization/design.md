# Design: add-arpeggio-visualization

## Context

`ScalePanel` established the pattern of root + interval-set selection feeding `buildMarkers`. This change reuses that pattern for chords and adds the shell navigation needed to host a second tool.

## Goals / Non-Goals

**Goals:**
- Chord theory data that keeps extended-chord degree labels honest (a 9th is "9", not "2")
- A robust chord-symbol parser with no silent guessing on unparseable input
- A note-by-note fallback for chords the parser can't handle or that the user wants to build manually
- Tool-switching in the shell with independent per-tool state

**Non-Goals:**
- Chord audio playback (own change: `add-arpeggio-playback`)
- A general chord-grammar/music-notation parsing library

## Decisions

- **Chord quality shape**: `{ suffixes: string[], intervals: number[] }`, the same shape family as scales, but extended chords (9, 11, 13) store true intervals beyond 12 (9th=14, 11th=17, 13th=21) and are folded to pitch classes only at render time. This keeps degree labels honest as "9" rather than "2".
- **Hand-written parser, not a grammar library**: explicitly rejects adding a chord-grammar dependency for this scope. The parser matches root (letter + accidental) then the longest known suffix ("m7b5" before "m7" before "m"); an empty suffix means major triad; common synonyms are tolerated (maj7/M7, m/min/-).
- **Typed parse result**: `{ ok: true, root, intervals }` or `{ ok: false, error }`. Unparsed input never renders a guessed chord; a parse error triggers the note-by-note fallback, pre-seeded with any root the parser did extract.
- **Note-by-note builder** picks absolute notes from the 17 standard spellings (not root-relative toggles like the custom scale editor) - the first picked note becomes the root.
- **Tool switching**: a two-tab shell nav (Scales | Arpeggios). Each tool's state persists independently in app state so switching back restores prior selections.
- **Chord qualities covered**: maj, min, dim, aug, sus2, sus4, 7, maj7, m7, m7b5, dim7, 6, m6, 9, maj9, m9, add9, 11, 13, power chord (5).
- **Non-goal**: slash-chord bass notes are parsed (so the parser doesn't choke on them) but ignored for tone-set purposes; no chord audio in this change.

## Directory layout

```
src/theory/chords.ts       # chord quality shape, catalog, pitch-class folding
src/theory/chordParser.ts  # chord symbol parser
src/components/ArpeggioPanel/
```

## Risks / Trade-offs

- [Hand-written parser may not cover every real-world chord symbol variant] → typed error result plus note-by-note fallback means unsupported symbols degrade gracefully instead of silently misrendering
