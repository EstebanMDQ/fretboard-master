import type { Translations } from './types'

export const es: Translations = {
  // AppShell - tabs
  tabScales: 'Escalas',
  tabArpeggios: 'Arpegios',
  tabChords: 'Acordes',
  tabVoicings: 'Voicings',
  // AppShell - display toggle
  labelsLabel: 'Etiquetas',
  labelNoteNames: 'Nombres de notas',
  labelScaleDegrees: 'Grados de escala',
  // AppShell - language toggle
  langEn: 'EN',
  langEs: 'ES',

  // ScalePanel
  scalePanelTitle: 'Escala',
  scaleRoot: 'Tonica',
  scaleFamily: 'Familia',
  scaleMode: 'Modo',
  scaleCustomTones: 'Notas personalizadas',
  scaleDirection: 'Direccion',
  directionAscending: 'Ascendente',
  directionDescending: 'Descendente',
  directionBoth: 'Ambas',
  playBtn: 'Reproducir',
  restartBtn: 'Reiniciar',

  // ArpeggioPanel
  arpeggioPanelTitle: 'Arpegio',
  chordSymbolLabel: 'Simbolo de acorde',
  chordSymbolPlaceholderArpeggio: 'ej. Cmaj7',
  arpeggioHint: 'O construye el acorde nota por nota (la primera es la tonica):',
  addNotePlaceholder: 'Agregar nota...',
  clearBtn: 'Limpiar',

  // ChordsPanel
  chordsPanelTitle: 'Acordes (CAGED)',
  chordSymbolPlaceholderChords: 'ej. Am, G7, Cmaj9',
  chordsHint: 'Ingresa un acorde para ver sus posiciones CAGED en el mastil.',
  chordsNotSupported: '',
  chordsNoShapes: 'No hay formas CAGED en este mastil.',
  chordsPositionOf: (current, total) => `Posicion ${current} de ${total}`,

  // VoicingsPanel
  voicingsPanelTitle: 'Voicings',
  chordSymbolPlaceholderVoicings: 'ej. B13, Cm7b5',
  voicingsHint: 'Ingresa un acorde para descubrir voicings en la afinacion actual.',
  voicingsNoVoicing: 'No se encontro ningun voicing para este acorde en esta afinacion.',
  voicingsNoMatch: 'Ningun voicing coincide con los filtros activos.',
  voicingsShapeCount: (count) => `${count} formas`,
  filterOpenStrings: 'Cuerdas al aire',
  filterSpread: 'Abierto',
  filterClose: 'Cerrado',
  filterRootless: 'Sin fundamental',
  filterNoFifth: 'Sin 5ta',
  filterStringSkip: 'Salto de cuerda',
  filterStretch: 'Estiramiento',
  tagOpen: 'aire',
  tagSpread: 'abierto',
  tagClose: 'cerrado',
  tagRootless: 'sin fund.',
  tagNoFifth: 'sin 5ta',
  tagSkip: 'salto',
  tagStretch: 'estir.',

  // InstrumentPanel
  instrumentPanelTitle: 'Instrumento',
  tuningNamePlaceholder: 'Nombre de la afinacion',
  saveBtn: 'Guardar',
  fretsLabel: 'Trastes',
  stringsLegend: 'Cuerdas (1 = superior)',
  addStringBtn: 'Agregar cuerda',
  deleteTuningLabel: (name) => `Eliminar afinacion ${name}`,
  removeStringLabel: (index) => `Eliminar cuerda ${index}`,

  // MetronomePanel
  metronomeToggle: 'Metronomo',
  tempoLabel: 'Tempo',
  beatsLabel: 'Tiempos',
  noteValueLabel: 'Figura',
  feelLabel: 'Ritmo',
  subdivisionQuarter: 'Negra',
  subdivisionEighth: 'Corcheas',
  subdivisionTriplet: 'Tresillos',
  subdivisionSwing: 'Swing',
  beatPatternAllBeats: 'Todos los tiempos',
  beatPatternBackbeat: 'Contratiempo',
  beatPatternDownbeat: 'Solo primer tiempo',
  gapTrainingLabel: 'Entrenamiento con silencios',
  gapPlayLabel: 'Sonar',
  gapMuteLabel: 'Silencio',
  metronomeBeatHint: 'Toca un tiempo: acento → normal → silencio',
  metronomePlayBtn: 'Reproducir',
  metronomeStopBtn: 'Detener',
}
