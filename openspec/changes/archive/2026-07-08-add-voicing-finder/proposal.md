## Why

The CAGED tool teaches the five shapes you already know on standard tuning. It does nothing for the situation this whole app is built to help with: sitting with an unfamiliar chord (B13, Cm7b5, Fmaj7#11) in an unfamiliar tuning (DADGAD, drop-D, open-G, 7-string) and having no idea what grips exist. Full extended chords have more notes than a guitar can hold, so the real skill is knowing which notes to drop and which surprising, tuning-specific shapes still voice the chord - especially the ones that exploit open strings. This tool generates those shapes so the user can discover forms they would never have found by hand, and it labels every note by scale degree so the transferable idea ("b7 on top, 3 in the bass") is visible, not the fret coordinates.

This is the "advanced chords tab" that the CAGED change explicitly deferred.

## What Changes

- Add a new **Voicings** study tool (fourth tab, alongside Scales, Arpeggios, Chords) with its own control panel and independent state.
- The user enters a chord symbol; the tool works on the active tuning (any instrument config, standard or alternative). It computes the chord's full tone set, then searches the fretboard for playable subsets that still function as the chord.
- **Degree-only display**: every note on the fretboard is labeled by its scale degree (1, 3, b7, 13, ...), never by note name. This tool forces degree display regardless of the global toggle.
- **Drop-order engine**: each chord tone is tagged with a harmonic role; the tool drops the "obvious" notes first (perfect 5th, then avoid-11, then root, then unnamed lower extensions) while never dropping guide tones (3, 7), the named extension, or any altered tone (b5, #5, b9, #9, #11, b13). How many notes get dropped is decided by what each fretboard slice can physically hold.
- **Open strings are first-class**: each string is searched as mute / open / fretted-in-window. Open strings are "free" (excluded from the hand-stretch budget) and enable spread voicings impossible with an all-fretted hand. Open-string voicings are surfaced as a featured category, since they are the tuning-specific shapes players rarely find on their own.
- **Stretch tiers** (fretted-hand span, open strings excluded): span up to 5 frets shown plainly; 6-7 frets shown with a stretch/YMMV badge; 8+ discarded. Default behavior prefers dropping a note and staying compact over stretching for it - unless the note is essential or creates a rewarded adjacency.
- **Adjacency as a signal**: voicings that sound two step-apart degrees together (e.g. the b7 and 13 of a 13 chord) are rewarded, because that "crunch" is often the defining color of extended chords; the reward is weighted by register (rewarded higher, penalized as mud low).
- **Discovery-oriented output, not a single "best"**: found voicings are de-duplicated by shape (identical moveable shapes collapse into one entry; open-string shapes never collapse), tagged by character (open-strings, spread, close, rootless, no-fifth, string-skip, stretch), and browsable via filters. The user selects one from the list and it projects onto the app's full-neck fretboard with degree labels and muted-string marks.
- Voicings are annotated transparently with what they kept and dropped ("rootless - implies B", "no 5th"), keeping the tool honest and pedagogical.
- The app shell's tool navigation grows from three tabs to four.

Non-goals: audio playback of voicings; finger-number assignment and precise fingering diagrams; automatic voice-leading between successive chords (a progression comper); MIDI/export. These are candidates for later changes.

## Capabilities

### New Capabilities
- `chord-voicings`: chord-voicing discovery - role-tagged drop-order model, fretboard voicing search (mute/open/fretted-in-window) on any tuning, playability scoring with stretch tiers, adjacency and open-string rewards, shape de-duplication, character tagging/filtering, and degree-labeled projection onto the fretboard.

### Modified Capabilities
- `app-shell`: the tool navigation region gains a fourth tab (Scales | Arpeggios | Chords | Voicings); the base-layout requirement is updated to describe four tools.
- `arpeggio-visualization`: the multi-tab tool-navigation requirement is extended to cover the fourth Voicings tab so tab state still persists independently across all tools.
- `fretboard-rendering`: gains muted-string (x) and open-string (o) indicators at the nut, needed to render a voicing (which strings are not played is half the information).

## Impact

- New theory module (e.g. `src/theory/voicings.ts`): chord-tone role model + per-quality drop-order, the voicing search over an `InstrumentConfig`, playability/stretch evaluation, adjacency and open-string scoring, shape-signature de-duplication, and character tagging. This is the center of gravity and needs strong Vitest coverage ("does this subset really voice a B13", "is this grip really playable", "do identical moveable shapes collapse").
- Reuses `chordParser` (parse symbol), `positionsForPitchClasses` (candidate tone positions), the `Marker` model in degrees mode, and `InstrumentConfig` (tuning-agnostic).
- `Fretboard.tsx` / `Fretboard.css`: new muted/open-string indicators; markers already support degree labels.
- New `VoicingsPanel` component and CSS: chord input, filter chips, and the browsable shape list.
- `appStateStore.ts`: new `ActiveTool` value `'voicings'`, a `VoicingsToolState` slice (chord symbol, active filters, selected voicing index), and reducer actions; playback-interruption effect updated.
- `AppShell.tsx`: fourth tab, mounting `VoicingsPanel`, projecting the selected voicing's markers onto the fretboard.
- No new dependencies; pure client-side. The search is bounded (pitch-class pruning per fret window) and runs in milliseconds per query.

## Open Design Questions

Deferred to design.md rather than resolved here:
- Adjacency reward: register-weighted or flat?
- Hard fretted-span cap: 7 frets or 6?
- Should the tool hide shapes the user already knows (standard barre / CAGED grips), so the list is purely surprising?
- Shape de-duplication signature strictness - the knob that decides whether output feels curated or like a phone book; worth validating by hand on 2-3 chords before coding.
