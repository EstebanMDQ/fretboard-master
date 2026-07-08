## ADDED Requirements

### Requirement: Generate playable voicings for a chord on any tuning
The system SHALL, given a chord symbol and the active instrument configuration (any tuning), generate the set of playable voicings whose sounding notes still function as the chord. A generated voicing SHALL sound at least three strings, SHALL cover every essential chord tone, and SHALL be physically playable per the stretch and finger constraints.

#### Scenario: Voicings found on an alternative tuning
- **WHEN** the user enters a chord symbol while the active tuning is an alternative tuning (e.g. DADGAD)
- **THEN** the generated voicings are computed from that tuning's open string pitch classes, so a string is played open or fretted only where its resulting pitch class is a kept chord tone

#### Scenario: Every voicing covers the essential tones
- **WHEN** the tool generates a voicing for a chord
- **THEN** the voicing's sounding notes include all of the chord's essential tones (the third or its sus substitute, the seventh when present, the named extension, and every altered tone)

#### Scenario: Unplayable candidates are excluded
- **WHEN** a candidate voicing would require more than four fingers (after allowing one barre) or a fretted-hand span of eight frets or more
- **THEN** that candidate is excluded from the results

### Requirement: Drop the obvious notes first
The system SHALL decide which chord tones to omit using a fixed drop-order: the perfect fifth first, then a perfect eleventh that is not the chord's named extension when a major third is present (the avoid note), then the root, then any remaining unnamed lower extensions. It SHALL NOT drop the third (or its sus substitute), the seventh when present, the named extension, or any altered tone; when the named extension is itself a perfect eleventh over a major third (an 11 chord) that eleventh SHALL be kept. How many notes are dropped SHALL be determined by what each voicing can physically hold.

#### Scenario: Perfect fifth dropped before guide tones
- **WHEN** a chord with a perfect fifth cannot fit all of its tones in a voicing
- **THEN** the perfect fifth is dropped before the third, seventh, or named extension

#### Scenario: Avoid eleventh dropped before the root
- **WHEN** a chord has a major third and a perfect eleventh that is not its named extension (e.g. the 11 inside a 13 chord) and cannot fit all of its tones in a voicing
- **THEN** that eleventh is dropped before the root, while the third, seventh, and named extension are kept

#### Scenario: Named eleventh is kept
- **WHEN** the chord's named extension is a perfect eleventh over a major third (an 11 chord)
- **THEN** no generated voicing omits that eleventh

#### Scenario: Altered tones are never dropped
- **WHEN** a chord contains an altered tone (e.g. b5, #5, b9, #9, #11, b13)
- **THEN** no generated voicing omits that altered tone

### Requirement: Open strings are first-class and free
The system SHALL treat each string as one of muted, open, or fretted. Open strings SHALL be usable only when their open pitch class is a kept chord tone, and SHALL be excluded from the fretted-hand span and finger-count constraints. Voicings that use open strings SHALL be tagged so they can be surfaced as a category.

#### Scenario: Open string included as a chord tone
- **WHEN** a string's open pitch class is one of the chord's kept tones
- **THEN** that open string may be included in a voicing and is labeled with its scale degree at the nut

#### Scenario: Open strings do not count toward stretch
- **WHEN** a voicing combines open strings with fretted notes
- **THEN** the fretted-hand span is measured only across the fretted notes, so open strings may extend the voicing's pitch range without adding stretch

### Requirement: Stretch tiers
The system SHALL classify a voicing by its fretted-hand span: a span of five frets or fewer is unmarked; a span of six or seven frets is emitted with a stretch (YMMV) badge; a span of eight frets or more is discarded.

#### Scenario: Compact voicing is unmarked
- **WHEN** a voicing has a fretted-hand span of five frets or fewer
- **THEN** it appears in the results without a stretch badge

#### Scenario: Wide-but-reachable voicing is badged, not hidden
- **WHEN** a voicing has a fretted-hand span of six or seven frets
- **THEN** it appears in the results carrying a stretch badge

#### Scenario: Over-cap span is discarded
- **WHEN** a voicing has a fretted-hand span of eight frets or more
- **THEN** it does not appear in the results

### Requirement: Discovery-oriented scoring and character tags
The system SHALL order voicings to favor discovery rather than a single best grip, rewarding adjacency (two sounding notes a second apart, weighted by register) and open-string use, and SHALL tag each voicing by character (open-strings, spread, close, rootless, no-fifth, string-skip, stretch) so the user can filter the results.

#### Scenario: Adjacency reward is register-weighted
- **WHEN** two voicings each contain a step-apart degree pair, one in the upper register and one in the bass
- **THEN** the upper-register voicing receives the greater adjacency reward

#### Scenario: Filter by character
- **WHEN** the user enables a character filter (e.g. open-strings)
- **THEN** only voicings carrying that tag are shown

#### Scenario: Compact voicing preferred over stretching for a droppable note
- **WHEN** including a droppable note would push a voicing into the stretch tier and that note forms no rewarded adjacency
- **THEN** the compact voicing that drops the note is scored above the stretched voicing that keeps it

### Requirement: De-duplicate by shape
The system SHALL collapse voicings that share a shape signature - the same relative fretted pattern, degree layout, and set of open and muted strings - into a single result that records every fret position at which the shape occurs. Voicings using open strings SHALL NOT collapse across positions.

#### Scenario: Octave-equivalent moveable shape collapses
- **WHEN** a fretted-only shape voices the chord at two positions an octave apart
- **THEN** the results show one shape entry listing both fret positions

#### Scenario: Open-string voicings stay distinct
- **WHEN** two voicings use open strings at different neck positions
- **THEN** they appear as separate shape entries

### Requirement: Degree-labeled display with kept/dropped annotation
The system SHALL label every note of a voicing by its scale degree (never by note name) regardless of the global display toggle, emphasize the root when present, and annotate each voicing with which tones it kept or dropped (e.g. "rootless", "no 5th").

#### Scenario: Notes shown as degrees
- **WHEN** a voicing is displayed
- **THEN** each sounding note is labeled by its scale degree (1, 3, b7, 13, ...), independent of the global names/degrees setting

#### Scenario: Rootless voicing is annotated
- **WHEN** a generated voicing omits the root
- **THEN** it is annotated as rootless

### Requirement: Handle unparseable input and empty results
The system SHALL show a diagnostic message and generate no voicings when the entered chord symbol cannot be parsed. When the symbol parses but no combination on the active tuning satisfies the essential-tone and playability constraints, the system SHALL show an explicit empty state rather than a blank or error, and SHALL leave the fretboard projection clear.

#### Scenario: Unparseable chord symbol
- **WHEN** the user enters a chord symbol the parser cannot resolve
- **THEN** no voicings are generated and a message explaining that the symbol could not be parsed is shown

#### Scenario: Parseable chord with no playable voicing
- **WHEN** the chord parses but no combination on the active tuning covers all essential tones within the playability constraints
- **THEN** the results are empty and an explicit "no playable voicing found" state is shown
