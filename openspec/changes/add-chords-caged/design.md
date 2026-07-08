## Context

The app already parses chord symbols (`theory/chordParser.ts`) and renders pitch-class markers on an SVG fretboard via the shared `buildMarkers` pipeline. The arpeggio tool uses this to light up *every* occurrence of a chord's tones. The new Chords tool needs the opposite emphasis: instead of all tones everywhere, show one compact, fingerable **shape** at a time and let the user walk it up the neck.

The CAGED system is the pedagogical frame: five movable shapes (C, A, G, E, D) derived from the open major-chord grips, each of which can be slid to any root. It is intrinsically defined on standard 6-string guitar tuning (E A D G B E). The app supports other tunings, so the tool must be gated.

Constraints: TypeScript strict, no `any`, no new deps, pure client-side, reuse the existing marker rendering and chord parser. Theory logic lives in `src/theory/` with Vitest coverage.

## Goals / Non-Goals

**Goals:**
- Given a chord symbol on standard guitar tuning, compute the five CAGED shapes for its underlying major or minor triad and let the user step between them.
- Render only the selected shape's fretted notes (root emphasized), reusing the existing `Marker` model and `Fretboard`.
- For chords richer than a triad, additionally mark the extra chord tones (b7, 7, 9, ...) that fall within the shape's fret window, styled as optional extensions.
- Gate the tool to standard guitar tuning with a clear message on other instruments.
- Keep all theory logic pure and unit-tested.

**Non-Goals:**
- Voicing generation for arbitrary tunings (ukulele/bass/7-string/custom).
- Ergonomic, hand-authored CAGED shapes for diminished and augmented chords. These use **basic shapes derived mechanically** from the major templates (see Decision 1); a voicing-aware treatment is deferred to a future advanced chords tab.
- Thirdless chords (sus2, sus4, power) have no CAGED triad and are reported as unsupported.
- Audio playback of shapes (the shared playback engine stays wired to Scales/Arpeggios only for now).
- Finger-number / fingering annotations and barre indicators.
- A future **advanced chords tab** for visualizing arbitrary chords/voicings is out of scope for this change.

## Decisions

### 1. Shape templates as pitch-class-relative offsets, non-major triads derived by altering degrees

Each CAGED shape is stored as a template: an anchor string plus, per fretted string, a `degree` (1/3/5) and a `fretOffset` relative to the root fret on the anchor string. Templates are authored for the **major** triad only. The other three triad qualities are derived mechanically by shifting the offset of specific degrees:

- **minor**: every 3rd-degree note lowered one fret (`3 → offset - 1`)
- **diminished**: 3rd lowered one fret AND 5th lowered one fret (`3 → offset - 1`, `5 → offset - 1`)
- **augmented**: every 5th-degree note raised one fret (`5 → offset + 1`)

Diminished and augmented shapes are therefore "basic" - geometrically valid grips, not necessarily the most ergonomic real-world voicings. That is intentional per the proposal; the future advanced chords tab will own voicing-aware diagrams.

Rationale: authoring only 5 major templates and deriving the rest keeps the data small and guarantees every quality stays consistent with its major parent - minor genuinely is "major with a flat 3rd," diminished "with a flat 3rd and flat 5th," augmented "with a sharp 5th." Alternative considered - hand-authoring all 20 shapes - is far more data to keep correct with no benefit for basic shapes. A single `alterDegrees(template, quality)` step produces all four qualities.

Template data (string index 0 = high E, 5 = low E; offsets relative to the anchor-string root fret; these are the **major** offsets, altered per quality as above):

| Shape | Anchor | Per-string (idx: degree @ offset) |
|-------|--------|-----------------------------------|
| E | 5 (low E) | 5:1@0, 4:5@+2, 3:1@+2, 2:3@+1, 1:5@0, 0:1@0 |
| A | 4 (A) | 4:1@0, 3:5@+2, 2:1@+2, 1:3@+2, 0:5@0 |
| D | 3 (D) | 3:1@0, 2:5@+2, 1:1@+3, 0:3@+2 |
| C | 4 (A) | 4:1@0, 3:3@-1, 2:5@-3, 1:1@-2, 0:3@-3 |
| G | 5 (low E) | 5:1@0, 4:3@-1, 3:5@-3, 2:1@-3, 1:3@-3, 0:1@0 |

### 2. Placement: every position that fits on the neck (the "same chord, different positions" list)

For each shape and a given root pitch class, enumerate **all** anchor-string frets where the anchor root sounds that pitch class: `base = (rootPC - openPC) mod 12`, then `base, base + 12, base + 24, ...`. For each candidate, apply the template's (possibly quality-altered) offsets and keep the placement only if every resulting fret lies in `[0, fretCount]`. Collect the valid placements across all five shapes and order them by lowest fret. This is the set the stepper walks - the same chord shown in different neck positions, naturally including octave repeats (e.g. for A major the A-shape lands at fret 0 and again at fret 12 on a 15-fret neck).

Rationale: the whole point of the tool is "the same chord in different positions," so enumerating every fitting placement - rather than one per shape - gives the fullest view up the neck. Requiring the entire grip to fall within `[0, fretCount]` keeps each rendered position fully playable rather than a truncated shape. Negative offsets (C and G shapes reach below their anchor root) are handled naturally: their low-fret candidates simply fail the `>= 0` check and the next octave up is used. Alternative - one lowest placement per shape (max 5) - was rejected because it hides valid higher-neck positions the user explicitly wants to see. Alternative - clamping a shape into range - was rejected because a clamped shape is no longer the real CAGED grip.

### 3. Triad extraction and the "extra tones" rule

The parser yields `intervals` and `degreeLabels`. Triad base is decided by pitch-class content (all mod 12):

- major 3rd (4) + perfect 5th (7) → **major**
- minor 3rd (3) + perfect 5th (7) → **minor**
- minor 3rd (3) + diminished 5th (6) → **diminished**
- major 3rd (4) + augmented 5th (8) → **augmented**

This makes dim, dim7, m7b5, aug, and aug7 supported (their triad plus extensions). Any chord with no 3rd (sus2, sus4, power 5) is **unsupported**: the tool renders no shapes and shows "CAGED shapes cover major, minor, diminished, and augmented triads." The chosen triad's 3rd and 5th intervals are recorded so the extra-tones step knows what to exclude.

Extra tones are the chord's remaining intervals (everything not folding to 0, the chosen 3rd, or the chosen 5th). After a shape is placed, its fret window is `[minFret, maxFret]`. For each string, any fret in `[max(0, minFret - 1), maxFret + 1]` whose pitch class matches an extra tone is added as an extension marker, labeled with the parser's honest degree label (b7, 7, 9, ...) and flagged so the UI can render it in a subdued/outlined style distinct from the core triad tones.

Rationale: this keeps the tool "CAGED-anchored" (the grip is always the triad) while making richer chords useful - the user sees where to reach for the 7th or 9th relative to the shape. Widening the window by one fret on each side catches extensions that sit just outside the barre but are still reachable.

### 4. New `Marker` flag for extension tones

`Marker` gains an optional `extension?: boolean`. Core triad tones leave it unset; extra-tone markers set it. `Fretboard` renders `extension` markers with a distinct class (e.g. hollow/dashed). This is additive and does not affect Scales/Arpeggios, which never set it.

Rationale: reusing the single `Marker` type and `Fretboard` avoids a parallel rendering path. Alternative - a separate marker array/prop - was rejected as duplicative.

### 5. UI: new tab + panel, stepper for positions

Add `ActiveTool = 'scale' | 'arpeggio' | 'chords'`. `ChordsToolState = { symbolInput: string; positionIndex: number }`. New `ChordsPanel` reuses the chord-symbol text input pattern from `ArpeggioPanel`, shows the current shape's name (e.g. "E shape, fret 5") and prev/next controls plus a direct selector over the available positions. Changing the symbol resets `positionIndex` to 0; `positionIndex` is clamped to the number of valid placements. `AppShell` builds markers for the active shape and mounts the panel. The Scales | Arpeggios nav becomes Scales | Arpeggios | Chords.

Rationale: mirrors the existing two-tab structure and `ArpeggioPanel` conventions, minimizing new patterns.

### 6. Standard-tuning gate by pitch-class pattern

`isStandardGuitarTuning(config)` returns true when the config has exactly 6 strings whose open pitch classes are `[4, 11, 7, 2, 9, 4]` (E B G D A E, high-to-low) in order. Octave is ignored because CAGED geometry is pitch-class based. When false, `ChordsPanel` shows the not-supported message and no shapes render.

Rationale: down-tuned-but-still-standard-interval tunings (e.g. Eb standard) share the same shapes, but matching exact pitch classes is the simplest correct MVP; relative-interval matching can come later if needed.

## Risks / Trade-offs

- **Extra-tone window is heuristic** → A fixed +/-1 fret window may occasionally surface an extension that is an awkward stretch, or miss one a player would actually use. Mitigation: keep extensions visually subordinate (clearly optional), and unit-test the window rule so behavior is predictable and adjustable.
- **Placement count varies with neck length** → Enumerating every fitting position means a long neck shows octave repeats while a short `fretCount` shows fewer; the count is not a fixed 5. Mitigation: the stepper labels each position with its shape and fret, so what is shown is always real and self-explanatory; default guitar `fretCount` (15) shows the standard low-neck set plus a couple of octave repeats.
- **Basic dim/aug shapes are awkward** → Mechanically lowering/raising the 5th (and 3rd) can produce grips that are geometrically valid but hard to finger. Mitigation: this is an accepted, documented limitation for now; the future advanced chords tab will own ergonomic voicings. Thirdless chords (sus/power) remain unsupported with an explicit message, and the Arpeggios tab still visualizes any chord's tones.
- **Enharmonic labels for extensions** → Extension degree labels must follow the parser's `degreeLabels` (root-relative), consistent with the app's degree-driven spelling rule, not a global sharp/flat default. Mitigation: reuse `buildMarkers`' existing degree-label matching rather than re-deriving spellings.
