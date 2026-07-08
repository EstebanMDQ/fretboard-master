## Context

The app renders pitch-class markers on an SVG fretboard via `positionsForPitchClasses` and the shared `Marker` model. The CAGED tool teaches five named shapes on standard tuning; this tool does the opposite - it *generates* unfamiliar, tuning-specific grips for any chord on any tuning, labels them by scale degree, and lets the user browse the space of valid shapes. It is a learning/discovery tool, not a practical "give me one grip" chord dictionary.

Constraints: TypeScript strict, no `any`, no new deps, pure client-side, reuse the parser, position math, `Marker` model, and tuning-agnostic `InstrumentConfig`. Theory logic lives in `src/theory/` with Vitest coverage.

## Goals / Non-Goals

**Goals:**
- Given a chord symbol and the active tuning, generate the playable fretboard voicings that still function as the chord.
- Decide which notes to drop via a harmonic role model (drop the obvious ones first), bounded by what each fretboard slice can physically hold.
- Treat open strings as first-class and free (excluded from the stretch budget); surface open-string voicings as their own category.
- Score for discovery: reward adjacency (step-apart degrees) and open-string use; de-duplicate by shape so the list reads as a curated space, not a phone book.
- Label every note by scale degree; project the selected voicing onto the full-neck fretboard with muted-string marks.
- Keep the theory pure and unit-tested.

**Non-Goals:**
- Audio playback of voicings.
- Finger-number assignment / precise fingering diagrams (we show the grid + degrees, like CAGED).
- Automatic voice-leading between successive chords.
- A "hide the shapes you already know" filter (see Decision 6 - deferred).
- MIDI / export.

## Decisions

### 1. Chord-tone role model and drop-order

Each interval in the parsed chord is tagged with a role from its degree label: `root` (1), `third` (3/b3), `fifth` (5) or `alteredFifth` (b5/#5), `seventh` (b7/maj7/bb7), `extension` (unaltered 9/11/13) or `alteredExtension` (b9/#9/#11/b13). The chord's *named* extension - the highest unaltered extension implied by the symbol - is tagged `namedExtension`.

Essential (never dropped): `third` (or the sus 2nd/4th when there is no third), `seventh` (when present), `namedExtension`, and every altered tone (`alteredFifth`, `alteredExtension`). Droppable, in this fixed order (dropped first -> last): perfect `fifth`, then a perfect `eleventh` that is not the `namedExtension` when a major third is present (the avoid note - so the 11 inside a 13 chord, not the 11 of an 11 chord), then `root`, then remaining unnamed lower `extension`s. Because `namedExtension` is essential, an 11 chord (whose named 11 sits over a major third) keeps that eleventh; the avoid-note drop only applies to a perfect eleventh that some higher extension has already named past. Rationale: this matches standard voicing practice ("drop the 5th first, keep the guide tones and the color") and makes "smart enough to drop the obvious notes" concrete and testable. Alternative considered - a per-quality hand-authored keep-set - was rejected as more data to maintain with no gain over a role-derived rule.

Chords with no third (sus2, sus4, power) keep the sus/5 tone as essential instead.

### 2. Search: ternary per-string, brute force with pitch-class pruning

For a chord's kept pitch-class set on a given `InstrumentConfig`, each string has candidates: `muted`, `open` (fret 0, if its open pitch class is kept), and each fretted fret `1..fretCount` whose pitch class is kept. Because a pitch class recurs about every 12 frets, each string yields only ~2-5 candidates, so the full Cartesian product across strings is a few thousand to ~50k combinations - trivial to brute-force client-side in a few milliseconds. No windowing loop is needed; the span constraint (Decision 3) is applied as a per-combination filter. Rationale: brute force with pruning is simpler and less bug-prone than a sliding-window search and is easily fast enough.

A combination is a candidate voicing when: it has >= 3 sounding strings; its sounding pitch classes cover all essential degrees; and it passes the playability filter (Decision 3).

### 3. Playability: stretch tiers and a simple finger budget

Fretted-hand span = highest fretted fret - lowest fretted fret (open strings excluded). Tiers: span <= 5 -> plain; span 6-7 -> emitted with a `stretch` (YMMV) badge; span >= 8 -> discarded (hard cap 7). Finger budget: group fretted notes by fret; the lowest fret carrying >= 2 notes may be a single barre finger; `fingers = (fretted notes not on the barre fret) + (1 if a barre is used)`. `fingers > 4` -> discarded. Rationale for the hard cap at 7 (not 6): a discovery tool should show ambitious grips, and 6-7 fret spans are reachable high on the neck; the badge keeps it honest. Open strings never count toward span or fingers, which is what lets open-string voicings be wildly spread yet easy.

Default preference: prefer dropping a droppable note and staying compact (span <= 5) over stretching to include it. A wider (badged) voicing that only adds a droppable note is kept only when that note earns the stretch - it is essential, or it forms a rewarded adjacency (Decision 4). This is enforced during scoring/pruning, not by refusing to generate the compact variant.

### 4. Scoring: discovery-oriented, adjacency and open strings rewarded

Voicings are scored (higher = surfaced earlier), never hard-ranked to a single "best":

- `+` contains an adjacent-degree pair (two sounding notes a minor/major 2nd apart), **register-weighted**: full reward when the pair sits in the upper register, tapering toward zero (and never negative) in the bass. Rationale for register-weighting (Decision resolving open question 1): a 2nd rubs pleasantly up high and turns to mud down low, so a flat reward would recommend growling low clusters.
- `+` uses open strings (novelty, tuning-specific).
- `+` compact fretted span; `-` for the 6-7 stretch tier.
- `+` root (or a user-pinned bass) is the lowest sounding note.
- Character tags drive filtering, which for a learning tool matters more than the numeric score: `open-strings`, `spread`, `close`, `rootless`, `no-fifth`, `string-skip`, `stretch`.

### 5. Shape de-duplication signature

Signature of a voicing = the multiset of `(stringIndex, fret - lowestFrettedFret, degree)` for fretted strings, plus the set of open string indices and the set of muted string indices. Two voicings with the same signature are the same shape; they are collapsed into one list entry that records every absolute position (root fret) at which the shape occurs. Because degree is part of the signature, only octave-equivalent placements (12-fret multiples, same degree layout) collapse; genuinely different degree layouts stay distinct. Open-string voicings never collapse across positions (the open string's relative fret shifts with `lowestFrettedFret`), so they remain unique - which is desirable, since they are the pinned, non-moveable, discovery-worthy shapes. Rationale (resolving open question 4): including degree in the signature is what prevents both over-collapsing (hiding real variants) and under-collapsing (12 copies of one barre).

### 6. Deferred: hiding known shapes

The proposal floated hiding standard barre/CAGED grips so the list is purely surprising. Deferred: reliably classifying a grip as "already known" is fuzzy (known to whom?), and getting it wrong would hide useful shapes. Instead, the character tags + open-string featuring already push novel shapes to the top. A "hide common shapes" filter can be a later change once the tagging proves out. (Resolving open question 3.)

### 7. UI: fourth tab, browsable list + full-neck projection

Add `ActiveTool = ... | 'voicings'`. `VoicingsToolState = { symbolInput: string; filters: VoicingFilter[]; selectedIndex: number }`. New `VoicingsPanel`: chord-symbol input, filter chips, and a scrollable list of found shapes (each a one-line degree signature + tags + fret position). Selecting one projects its markers - degree-labeled, root emphasized, muted strings marked - onto the app's existing full-neck `Fretboard`. Degree display is forced for this tool regardless of the global names/degrees toggle. Rationale: mirrors the existing tab pattern and reuses the signature full-neck view, while a list (not a stepper) fits browsing a large space.

### 8. Fretboard gains muted/open indicators

`Fretboard` accepts an optional `mutedStrings?: number[]`, rendering an "x" left of the nut for those strings. Open strings are already expressible as a `Marker` at fret 0 (rendered at the nut) carrying its degree label, so no separate "o" glyph is required - the degree at the nut conveys it. This is additive and unused by Scales/Arpeggios/Chords. Rationale: "which strings you don't play" is half a voicing's information; without it a projected voicing is ambiguous.

## Risks / Trade-offs

- **"Functions as the chord" is subjective** -> The role model encodes one defensible convention (jazz/functional). Mitigation: essentials are conservative (guide tones + named/altered tones), voicings are annotated with what they kept/dropped, and everything is degree-labeled so the user judges for themselves.
- **Scoring/tag tuning is a taste knob** -> Register-weighting, span penalties, and adjacency reward are heuristics that may need tuning. Mitigation: expose behavior through filters (not a hidden ranking), and unit-test the tag classification so behavior is predictable.
- **De-dup signature strictness** -> Too strict hides variants, too loose clutters. Mitigation: degree-in-signature (Decision 5) plus hand-validated tests on 2-3 chords (e.g. B13 on standard and DADGAD) before it hardens.
- **Combinatorial blow-up on many-tone chords / long necks** -> A 6-tone chord on a 24-fret 7-string widens the product. Mitigation: pitch-class pruning keeps per-string candidates small; if needed, cap fretted candidates per string to the lowest two octaves. Log/guard rather than hang.
- **No fingering shown** -> Users must infer fingering. Accepted for v1 (consistent with the CAGED tool); the finger budget still rejects unfingerable grips.
