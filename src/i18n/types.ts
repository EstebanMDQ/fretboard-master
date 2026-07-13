export interface Translations {
  // AppShell - tabs
  tabScales: string
  tabArpeggios: string
  tabChords: string
  tabVoicings: string
  // AppShell - display toggle
  labelsLabel: string
  labelNoteNames: string
  labelScaleDegrees: string
  // AppShell - language toggle
  langEn: string
  langEs: string

  // ScalePanel
  scalePanelTitle: string
  scaleRoot: string
  scaleFamily: string
  scaleMode: string
  scaleCustomTones: string
  scaleDirection: string
  directionAscending: string
  directionDescending: string
  directionBoth: string
  playBtn: string
  restartBtn: string

  // ArpeggioPanel
  arpeggioPanelTitle: string
  chordSymbolLabel: string
  chordSymbolPlaceholderArpeggio: string
  arpeggioHint: string
  addNotePlaceholder: string
  clearBtn: string

  // ChordsPanel
  chordsPanelTitle: string
  chordSymbolPlaceholderChords: string
  chordsHint: string
  chordsNotSupported: string
  chordsNoShapes: string
  chordsPositionOf: (current: number, total: number) => string

  // VoicingsPanel
  voicingsPanelTitle: string
  chordSymbolPlaceholderVoicings: string
  voicingsHint: string
  voicingsNoVoicing: string
  voicingsNoMatch: string
  voicingsShapeCount: (count: number) => string
  // filter chip labels
  filterOpenStrings: string
  filterSpread: string
  filterClose: string
  filterRootless: string
  filterNoFifth: string
  filterStringSkip: string
  filterStretch: string
  // tag labels
  tagOpen: string
  tagSpread: string
  tagClose: string
  tagRootless: string
  tagNoFifth: string
  tagSkip: string
  tagStretch: string

  // InstrumentPanel
  instrumentPanelTitle: string
  tuningNamePlaceholder: string
  saveBtn: string
  fretsLabel: string
  stringsLegend: string
  addStringBtn: string
  deleteTuningLabel: (name: string) => string
  removeStringLabel: (index: number) => string

  // MetronomePanel
  metronomeToggle: string
  tempoLabel: string
  beatsLabel: string
  noteValueLabel: string
  feelLabel: string
  subdivisionQuarter: string
  subdivisionEighth: string
  subdivisionTriplet: string
  subdivisionSwing: string
  beatPatternAllBeats: string
  beatPatternBackbeat: string
  beatPatternDownbeat: string
  gapTrainingLabel: string
  gapPlayLabel: string
  gapMuteLabel: string
  metronomeBeatHint: string
  metronomePlayBtn: string
  metronomeStopBtn: string
}
