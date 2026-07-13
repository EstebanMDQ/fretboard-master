import type { Translations } from './types'

export const en: Translations = {
  // AppShell - tabs
  tabScales: 'Scales',
  tabArpeggios: 'Arpeggios',
  tabChords: 'Chords',
  tabVoicings: 'Voicings',
  // AppShell - display toggle
  labelsLabel: 'Labels',
  labelNoteNames: 'Note names',
  labelScaleDegrees: 'Scale degrees',
  // AppShell - language toggle
  langEn: 'EN',
  langEs: 'ES',

  // ScalePanel
  scalePanelTitle: 'Scale',
  scaleRoot: 'Root',
  scaleFamily: 'Family',
  scaleMode: 'Mode',
  scaleCustomTones: 'Custom scale tones',
  scaleDirection: 'Direction',
  directionAscending: 'Ascending',
  directionDescending: 'Descending',
  directionBoth: 'Both',
  playBtn: 'Play',
  restartBtn: 'Restart',

  // ArpeggioPanel
  arpeggioPanelTitle: 'Arpeggio',
  chordSymbolLabel: 'Chord symbol',
  chordSymbolPlaceholderArpeggio: 'e.g. Cmaj7',
  arpeggioHint: 'Or build the chord one note at a time (first pick is the root):',
  addNotePlaceholder: 'Add note...',
  clearBtn: 'Clear',

  // ChordsPanel
  chordsPanelTitle: 'Chords (CAGED)',
  chordSymbolPlaceholderChords: 'e.g. Am, G7, Cmaj9',
  chordsHint: 'Enter a chord to see its CAGED positions up the neck.',
  chordsNotSupported: '',
  chordsNoShapes: 'No CAGED shapes fit on this neck.',
  chordsPositionOf: (current, total) => `Position ${current} of ${total}`,

  // VoicingsPanel
  voicingsPanelTitle: 'Voicings',
  chordSymbolPlaceholderVoicings: 'e.g. B13, Cm7b5',
  voicingsHint: 'Enter a chord to discover playable voicings on the current tuning.',
  voicingsNoVoicing: 'No playable voicing found for this chord on this tuning.',
  voicingsNoMatch: 'No voicings match the active filters.',
  voicingsShapeCount: (count) => `${count} shapes`,
  filterOpenStrings: 'Open strings',
  filterSpread: 'Spread',
  filterClose: 'Close',
  filterRootless: 'Rootless',
  filterNoFifth: 'No 5th',
  filterStringSkip: 'String skip',
  filterStretch: 'Stretch',
  tagOpen: 'open',
  tagSpread: 'spread',
  tagClose: 'close',
  tagRootless: 'rootless',
  tagNoFifth: 'no 5th',
  tagSkip: 'skip',
  tagStretch: 'stretch',

  // InstrumentPanel
  instrumentPanelTitle: 'Instrument',
  tuningNamePlaceholder: 'Name this tuning',
  saveBtn: 'Save',
  fretsLabel: 'Frets',
  stringsLegend: 'Strings (1 = top)',
  addStringBtn: 'Add string',
  deleteTuningLabel: (name) => `Delete tuning ${name}`,
  removeStringLabel: (index) => `Remove string ${index}`,

  // MetronomePanel
  metronomeToggle: 'Metronome',
  tempoLabel: 'Tempo',
  beatsLabel: 'Beats',
  noteValueLabel: 'Note value',
  feelLabel: 'Feel',
  subdivisionQuarter: 'Quarter',
  subdivisionEighth: 'Straight 8ths',
  subdivisionTriplet: 'Triplets',
  subdivisionSwing: 'Swing 8ths',
  beatPatternAllBeats: 'All beats',
  beatPatternBackbeat: 'Backbeat',
  beatPatternDownbeat: 'Downbeat only',
  gapTrainingLabel: 'Gap training',
  gapPlayLabel: 'Play',
  gapMuteLabel: 'Mute',
  metronomeBeatHint: 'Tap a beat: accent → normal → mute',
  metronomePlayBtn: 'Play',
  metronomeStopBtn: 'Stop',
}
