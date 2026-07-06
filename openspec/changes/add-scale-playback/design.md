# Design: add-scale-playback

## Context

The metronome's scheduler and `tempoBpm` already exist. This change adds a musical note voice and reuses the scheduler to play the currently selected scale.

## Goals / Non-Goals

**Goals:**
- A simple, pleasant note voice good enough for study purposes, not a realistic instrument model
- Reuse of the existing scheduler and tempo rather than a second timing system
- Fretboard sync that reinforces degree recognition, not a specific fingering

**Non-Goals:**
- Arpeggio/chord playback (own change: `add-arpeggio-playback`)
- Realistic instrument synthesis (samples, physical modeling)

## Decisions

- **Note voice**: two detuned triangle oscillators through an exponential-decay gain envelope (fast attack ~5ms, decay over ~90% of the beat duration). Explicitly rejects Karplus-Strong pluck synthesis and sample playback as unnecessary complexity for a study tool.
- **Frequency formula**: `440 * 2^((midi - 69) / 12)`, implemented in `src/audio/notes.ts`.
- **Root register fixed at octave 3**, regardless of the current tuning, so playback pitch is predictable across instrument configs.
- **One note per beat at `tempoBpm`**, scheduled through the metronome's existing lookahead scheduler (`schedule(events)`) - this is reused, not reimplemented, giving sample-accurate timing and UI sync "for free."
- **Fretboard sync is by degree, not specific position**: all markers sharing the currently-sounding degree pulse together. This deliberately avoids choosing a single fingering/position to highlight.
- **Interruption rules**: changing scale, root, tuning, or switching tools stops playback. Pressing play while already playing restarts from the top. The metronome and scale playback can run simultaneously - both are independent scheduler clients sharing a master gain node.

## Directory layout

```
src/audio/notes.ts   # frequency formula, note voice, sequence builder
```
Play controls are added directly to `src/components/ScalePanel/`.

## Risks / Trade-offs

- [Simultaneous metronome + scale playback could clip or sum too loud] → shared master gain node keeps overall output in range
- [Stopping mid-sequence could leave a note hanging] → interruption immediately releases the envelope rather than letting notes ring out
