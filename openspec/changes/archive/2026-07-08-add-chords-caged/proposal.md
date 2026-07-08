## Why

The arpeggio tool highlights *every* occurrence of a chord's tones across the whole neck, which is great for seeing note locations but does not teach how to actually grab the chord as a shape. Guitarists learn the fretboard through the CAGED system: five movable shapes (C, A, G, E, D) that let any chord be played in five positions up the neck. A dedicated Chords tool that steps through these positions turns the app from a note map into a practical chord-vocabulary trainer.

## What Changes

- Add a new **Chords** study tool (third tab, alongside Scales and Arpeggios) with its own control panel and independent state.
- The user enters a chord symbol (reusing the existing chord parser). The tool computes the CAGED shapes for the chord's underlying triad and lets the user step through **every position that fits on the neck** one at a time - the same chord visualized in different places, including octave repeats (e.g. the A-shape for A major at fret 0 and again at fret 12).
- Supported triads: **major, minor, diminished, and augmented**. Minor is the major shape with the 3rd lowered; diminished lowers the 3rd and 5th; augmented raises the 5th - all derived mechanically from the five major templates. Diminished and augmented use basic derived shapes only (a richer, voicing-aware treatment is deferred to the future advanced chords tab).
- Each shape highlights the fretted triad tones (root emphasized) and, for richer input (7ths, 9ths, etc.), additionally marks the extra chord tones that fall within the shape's fret window so the user can see how to extend the grip.
- CAGED requires standard 6-string guitar tuning. On any other instrument/tuning the tool shows a clear message that CAGED positions need standard guitar tuning, and renders no shapes.
- The app shell's tool navigation grows from two tabs to three.

Non-goals: generalized voicing generation for arbitrary tunings; ergonomic/voicing-aware diminished and augmented grips (basic derived shapes only for now); support for thirdless chords (sus2, sus4, power) which have no CAGED triad; audio playback of shapes. A future **advanced chords tab** will visualize arbitrary chords/voicings and is out of scope here.

## Capabilities

### New Capabilities
- `chord-shapes`: CAGED-based positional chord display - computing the movable shapes for a major/minor/diminished/augmented triad on standard guitar tuning, stepping between every position that fits on the neck, and marking extra chord tones within a shape.

### Modified Capabilities
- `app-shell`: the tool navigation region gains a third tab (Scales | Arpeggios | Chords); the base-layout requirement is updated to describe three tools rather than two.
- `arpeggio-visualization`: the "two-tab tool navigation with independent state" requirement is generalized to cover the third Chords tab so tab state still persists independently across all three tools.

## Impact

- New theory module (e.g. `src/theory/cagedShapes.ts`) with CAGED shape templates and a function to place them for a given root/quality on standard guitar tuning, plus tests.
- New `ChordsPanel` component and CSS.
- `appStateStore.ts`: new `ActiveTool` value `'chords'`, a `ChordsToolState` slice (chord symbol input, selected position index), and reducer actions.
- `AppShell.tsx`: third tab, mounting `ChordsPanel`, and building shape markers when the Chords tool is active; playback-interruption effect updated for the new state.
- `theory/tunings.ts`: a helper to detect standard 6-string guitar tuning (to gate the tool).
- No new dependencies; pure client-side, reuses existing marker rendering and chord parsing.
