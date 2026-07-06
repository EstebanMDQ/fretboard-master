# Proposal: add-arpeggio-playback

## Why

Just as scales benefit from playback, arpeggios do too. This change adds a play button to the arpeggio tool that plays the current chord's tones in sequence at the shared tempo, with extended chord tones sounding in their true register rather than folded down.

## What Changes

- Reuse the note voice, one-note-per-beat scheduling, direction options, degree-based fretboard pulsing, and interruption rules from `add-scale-playback` unchanged
- Extend the shared sequence builder with a "cap at octave only if within an octave" flag: sort chord intervals ascending from root (octave 3); if the largest interval is less than 12, append the octave root to cap the run (e.g. C E G C); if the chord already exceeds an octave (9/11/13 chords, true intervals 14/17/21), play the true intervals as-is without folding (e.g. C9 plays C3 E3 G3 Bb3 D4, not a folded-down 2nd)
- Disable the play button until a valid chord exists (parsed successfully, or a root plus at least one interval in the note-by-note builder); playing an empty/incomplete state is a no-op

## Capabilities

### New Capabilities

- `arpeggio-playback`: play the current chord's tones in sequence at the shared tempo

### Modified Capabilities

None (reuses `audio-engine` as-is).

## Impact

- No new files beyond play controls in `src/components/ArpeggioPanel/`; the sequence builder from `add-scale-playback` is shared/extended
- Depends on: `add-scale-playback` (note voice, sequence builder) and `add-arpeggio-visualization` (chord state)
