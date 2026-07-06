# Design: add-arpeggio-playback

## Context

Scale playback established the note voice, scheduler reuse, and interruption rules. This change reuses all of that for chords, with one musical difference: extended chords must not be folded to fit in an octave.

## Goals / Non-Goals

**Goals:**
- Reuse everything from `add-scale-playback` that isn't chord-specific
- Play extended chord tones (9/11/13) in their true register, not folded into one octave

**Non-Goals:**
- A new audio engine or voice - this change adds no `audio-engine` changes
- New fretboard sync behavior - degree-based pulsing is reused unchanged

## Decisions

- **Key divergence from scale playback**: sort the chord's intervals ascending from the root (octave 3). If the largest interval is less than 12 (a triad or simple 7th chord), append the octave root to cap the run - e.g. a C major triad plays C E G C. If the chord already exceeds an octave in true intervals (9th=14, 11th=17, 13th=21), play the true intervals as-is without folding - e.g. C9 plays C3 E3 G3 Bb3 D4, not a folded-down major 2nd.
- This requires the shared sequence builder (from `add-scale-playback`) to gain a "cap at octave only if the chord is within an octave" flag, rather than duplicating the builder.
- Everything else is reused unchanged: note voice, one note per beat at `tempoBpm`, direction options, degree-based fretboard pulsing, and all interruption rules.
- **Play button disabled until a valid chord exists**: either the parser produced a valid chord, or the note-by-note builder has a root plus at least one additional interval. Pressing play in an empty/incomplete state is a no-op.

## Directory layout

No new files besides play controls in `src/components/ArpeggioPanel/`; the sequence builder in `src/audio/notes.ts` (from `add-scale-playback`) is extended with the octave-capping flag.

## Risks / Trade-offs

- [Extending the shared sequence builder could regress scale playback] → the new flag defaults to the scale-playback behavior (always cap at one octave) so scale playback's call site is unaffected
