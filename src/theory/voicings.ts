import { pitchClassOfSpelling, type Marker } from './notes'
import type { InstrumentConfig } from './tunings'
import { parseChordSymbol } from './chordParser'

export type ChordToneRole =
  | 'root'
  | 'third'
  | 'sus'
  | 'fifth'
  | 'alteredFifth'
  | 'seventh'
  | 'sixth'
  | 'extension'
  | 'alteredExtension'

export interface ChordTone {
  interval: number // true (unfolded) interval, e.g. 14 for a 9th
  pitchClass: number // (root + interval) mod 12
  degreeLabel: string // e.g. "1", "b3", "b7", "13"
  degreeNumber: number // 1, 3, 5, 7, 9, 11, 13, ...
  accidental: number // -2..2 relative to the major-scale degree
  role: ChordToneRole
  essential: boolean
  named: boolean // is this the chord's named extension (the 6/9/11/13 it is named after)
}

export type VoicingTag = 'open-strings' | 'spread' | 'close' | 'rootless' | 'no-fifth' | 'string-skip' | 'stretch'

export interface VoicingNote {
  string: number
  fret: number
  degree: number // folded interval 0-11
  label: string // degree label
  isRoot: boolean
  open: boolean
  midi: number // relative pitch for register/ordering comparisons
}

export interface Voicing {
  notes: VoicingNote[] // sounding notes, lowest string index first
  mutedStrings: number[]
  frettedSpan: number
  tags: VoicingTag[]
  annotations: string[]
  score: number
  positions: number[] // fret positions (lowest fretted fret) of octave-equivalent placements of this shape
  markers: Marker[]
}

export type FindVoicingsResult =
  | { supported: true; voicings: Voicing[] }
  | { supported: false; reason: string; voicings: [] }

const DEGREE_LABEL_PATTERN = /^(b{1,2}|#{1,2})?(\d{1,2})$/
const HARD_SPAN_CAP = 7
const MAX_FINGERS = 4
const MIN_SOUNDING = 3
const MAX_RESULTS = 50
/** Search frets only within this reach; higher positions are octave duplicates the de-dup collapses. */
const FRET_SEARCH_MAX = 16

function mod12(value: number): number {
  return ((value % 12) + 12) % 12
}

function accidentalOffset(prefix: string | undefined): number {
  switch (prefix) {
    case '#':
      return 1
    case '##':
      return 2
    case 'b':
      return -1
    case 'bb':
      return -2
    default:
      return 0
  }
}

function roleOf(degreeNumber: number, accidental: number): ChordToneRole {
  switch (degreeNumber) {
    case 1:
      return 'root'
    case 2:
    case 4:
      return 'sus'
    case 3:
      return 'third'
    case 5:
      return accidental === 0 ? 'fifth' : 'alteredFifth'
    case 6:
      return 'sixth'
    case 7:
      return 'seventh'
    default:
      return accidental === 0 ? 'extension' : 'alteredExtension'
  }
}

/**
 * Tags each chord tone with a harmonic role and marks which are essential (never dropped) and which is
 * the chord's named extension. Rootless voicings are only allowed when the chord has a seventh.
 */
export function chordToneRoles(rootPitchClass: number, intervals: number[], degreeLabels: string[]): ChordTone[] {
  const parsed = intervals.map((interval, index) => {
    const label = degreeLabels[index] ?? String(interval)
    const match = DEGREE_LABEL_PATTERN.exec(label)
    const accidental = match ? accidentalOffset(match[1]) : 0
    const degreeNumber = match ? Number(match[2]) : 1
    return {
      interval,
      pitchClass: mod12(rootPitchClass + interval),
      degreeLabel: label,
      degreeNumber,
      accidental,
      role: roleOf(degreeNumber, accidental),
    }
  })

  const hasThird = parsed.some((tone) => tone.role === 'third')
  const hasSeventh = parsed.some((tone) => tone.role === 'seventh')
  const hasSus = parsed.some((tone) => tone.role === 'sus')

  // The chord's named tone: the highest of the 6/9/11/13 family present.
  const nameableNumbers = [13, 11, 9, 6]
  const namedNumber = nameableNumbers.find((num) => parsed.some((tone) => tone.degreeNumber === num))

  return parsed.map((tone): ChordTone => {
    const named = tone.degreeNumber === namedNumber
    let essential = false
    if (tone.role === 'third' || tone.role === 'sus') essential = true
    else if (tone.role === 'seventh') essential = true
    else if (tone.role === 'alteredFifth' || tone.role === 'alteredExtension') essential = true
    else if (named) essential = true
    else if (tone.role === 'fifth' && !hasThird && !hasSus) essential = true // power chord
    else if (tone.role === 'root' && !hasSeventh) essential = true // rootless only for seventh chords
    return { ...tone, essential, named }
  })
}

/** A natural 11 over a major third that is not the named extension is an avoid note - excluded from voicings. */
function isAvoidEleventh(tone: ChordTone, hasMajorThird: boolean): boolean {
  return tone.degreeNumber === 11 && tone.accidental === 0 && hasMajorThird && !tone.named
}

interface StringCandidate {
  fret: number // -1 = muted
  pitchClass: number
  open: boolean
}

function openMidi(config: InstrumentConfig, stringIndex: number): number {
  const string = config.strings[stringIndex]
  return string.octave * 12 + pitchClassOfSpelling(string.spelling)
}

/**
 * Reward for step-apart (minor/major 2nd) pairs among the sounding notes, weighted by register:
 * a 2nd rubs pleasantly high on the neck and turns to mud in the bass, so higher pairs score more.
 */
export function adjacencyReward(config: InstrumentConfig, midis: number[]): number {
  const lowRef = Math.min(...config.strings.map((_, i) => openMidi(config, i)))
  const highRef = Math.max(...config.strings.map((_, i) => openMidi(config, i))) + config.fretCount
  const span = Math.max(1, highRef - lowRef)
  let reward = 0
  for (let i = 0; i < midis.length; i++) {
    for (let j = i + 1; j < midis.length; j++) {
      const diff = Math.abs(midis[i] - midis[j])
      if (diff === 1 || diff === 2) {
        const avg = (midis[i] + midis[j]) / 2
        reward += Math.max(0, (avg - lowRef) / span)
      }
    }
  }
  return reward
}

function fingersNeeded(fretted: { fret: number }[]): number {
  if (fretted.length === 0) return 0
  const byFret = new Map<number, number>()
  fretted.forEach(({ fret }) => byFret.set(fret, (byFret.get(fret) ?? 0) + 1))
  // Allow one barre: the lowest fret that carries 2+ notes becomes a single finger.
  let barreSaving = 0
  const barreFret = [...byFret.entries()].filter(([, count]) => count >= 2).map(([fret]) => fret).sort((a, b) => a - b)[0]
  if (barreFret !== undefined) barreSaving = (byFret.get(barreFret) ?? 0) - 1
  return fretted.length - barreSaving
}

export function findVoicings(config: InstrumentConfig, symbolInput: string): FindVoicingsResult {
  const trimmed = symbolInput.trim()
  if (trimmed === '') return { supported: true, voicings: [] }

  const parsed = parseChordSymbol(trimmed)
  if (!parsed.ok) return { supported: false, reason: parsed.error, voicings: [] }

  const rootPitchClass = pitchClassOfSpelling(parsed.root)
  const tones = chordToneRoles(rootPitchClass, parsed.quality.intervals, parsed.quality.degreeLabels)
  const hasMajorThird = tones.some((tone) => tone.degreeNumber === 3 && tone.accidental === 0)
  const hasPerfectFifth = tones.some((tone) => tone.role === 'fifth')

  // Candidate tones exclude the avoid eleventh; map pitch class -> tone for labeling.
  const candidateTones = tones.filter((tone) => !isAvoidEleventh(tone, hasMajorThird))
  const toneByPitchClass = new Map<number, ChordTone>()
  candidateTones.forEach((tone) => toneByPitchClass.set(tone.pitchClass, tone))
  const candidatePitchClasses = new Set(candidateTones.map((tone) => tone.pitchClass))
  const essentialPitchClasses = new Set(candidateTones.filter((tone) => tone.essential).map((tone) => tone.pitchClass))

  const fretMax = Math.min(config.fretCount, FRET_SEARCH_MAX)
  const numStrings = config.strings.length

  // Per-string candidates: muted, plus every fret 0..fretMax whose pitch class is a chord tone.
  const perString: StringCandidate[][] = config.strings.map((_, stringIndex) => {
    const openPc = mod12(openMidi(config, stringIndex))
    const options: StringCandidate[] = [{ fret: -1, pitchClass: -1, open: false }]
    for (let fret = 0; fret <= fretMax; fret++) {
      const pc = mod12(openPc + fret)
      if (candidatePitchClasses.has(pc)) options.push({ fret, pitchClass: pc, open: fret === 0 })
    }
    return options
  })

  const raw: Voicing[] = []
  const chosen: StringCandidate[] = []

  const evaluate = () => {
    const sounding = chosen
      .map((candidate, stringIndex) => ({ candidate, stringIndex }))
      .filter((entry) => entry.candidate.fret >= 0)
    if (sounding.length < MIN_SOUNDING) return

    const soundingPcs = new Set(sounding.map((entry) => entry.candidate.pitchClass))
    for (const pc of essentialPitchClasses) if (!soundingPcs.has(pc)) return

    const fretted = sounding.filter((entry) => entry.candidate.fret >= 1)
    if (fingersNeeded(fretted.map((entry) => ({ fret: entry.candidate.fret }))) > MAX_FINGERS) return
    const frettedFrets = fretted.map((entry) => entry.candidate.fret)
    const frettedSpan = frettedFrets.length > 0 ? Math.max(...frettedFrets) - Math.min(...frettedFrets) : 0
    if (frettedSpan > HARD_SPAN_CAP) return

    const notes: VoicingNote[] = sounding.map((entry) => {
      const tone = toneByPitchClass.get(entry.candidate.pitchClass)!
      return {
        string: entry.stringIndex,
        fret: entry.candidate.fret,
        degree: mod12(tone.interval),
        label: tone.degreeLabel,
        isRoot: tone.role === 'root',
        open: entry.candidate.open,
        midi: openMidi(config, entry.stringIndex) + entry.candidate.fret,
      }
    })

    raw.push(buildVoicing(config, notes, frettedSpan, hasPerfectFifth))
  }

  const dfs = (stringIndex: number, frettedMin: number, frettedMax: number) => {
    if (stringIndex === numStrings) {
      evaluate()
      return
    }
    for (const candidate of perString[stringIndex]) {
      let nextMin = frettedMin
      let nextMax = frettedMax
      if (candidate.fret >= 1) {
        nextMin = Math.min(frettedMin, candidate.fret)
        nextMax = Math.max(frettedMax, candidate.fret)
        if (nextMax - nextMin > HARD_SPAN_CAP) continue // prune impossible stretches early
      }
      chosen.push(candidate)
      dfs(stringIndex + 1, nextMin, nextMax)
      chosen.pop()
    }
  }

  dfs(0, Infinity, -Infinity)

  return { supported: true, voicings: dedupeByShape(raw).slice(0, MAX_RESULTS) }
}

function buildVoicing(
  config: InstrumentConfig,
  notes: VoicingNote[],
  frettedSpan: number,
  hasPerfectFifth: boolean,
): Voicing {
  const sorted = [...notes].sort((a, b) => a.string - b.string)
  const soundingStrings = new Set(sorted.map((note) => note.string))
  const mutedStrings = config.strings
    .map((_, index) => index)
    .filter((index) => !soundingStrings.has(index))

  const midis = sorted.map((note) => note.midi)
  const minMidi = Math.min(...midis)
  const maxMidi = Math.max(...midis)
  const bass = sorted.reduce((lowest, note) => (note.midi < lowest.midi ? note : lowest), sorted[0])
  const rootInBass = bass.isRoot

  const adjacency = adjacencyReward(config, sorted.map((note) => note.midi))

  const openCount = sorted.filter((note) => note.open).length
  const hasRoot = sorted.some((note) => note.isRoot)
  const totalSpan = maxMidi - minMidi

  // Detect a muted string sitting between two sounding strings.
  const soundingIndices = sorted.map((note) => note.string)
  const stringSkip = mutedStrings.some(
    (index) => index > Math.min(...soundingIndices) && index < Math.max(...soundingIndices),
  )

  const tags: VoicingTag[] = []
  if (openCount > 0) tags.push('open-strings')
  if (totalSpan >= 17) tags.push('spread')
  if (totalSpan <= 12) tags.push('close')
  if (!hasRoot) tags.push('rootless')
  if (hasPerfectFifth && !sorted.some((note) => note.degree === mod12(7))) tags.push('no-fifth')
  if (stringSkip) tags.push('string-skip')
  if (frettedSpan >= 6) tags.push('stretch')

  const annotations: string[] = []
  if (!hasRoot) annotations.push('rootless')
  if (hasPerfectFifth && !sorted.some((note) => note.degree === mod12(7))) annotations.push('no 5th')

  const score =
    adjacency * 3 +
    openCount * 2 +
    (rootInBass ? 2 : 0) -
    (frettedSpan >= 6 ? 2 : 0) -
    frettedSpan * 0.2

  const markers: Marker[] = sorted.map((note) => ({
    string: note.string,
    fret: note.fret,
    label: note.label,
    emphasis: note.isRoot,
    degree: note.degree,
  }))

  const lowestFretted = sorted.filter((note) => note.fret >= 1).map((note) => note.fret)
  const position = lowestFretted.length > 0 ? Math.min(...lowestFretted) : 0

  return { notes: sorted, mutedStrings, frettedSpan, tags, annotations, score, positions: [position], markers }
}

/** Signature groups octave-equivalent moveable shapes; open-string voicings stay distinct. */
export function shapeSignature(voicing: Voicing): string {
  const fretted = voicing.notes.filter((note) => note.fret >= 1)
  const lowestFretted = fretted.length > 0 ? Math.min(...fretted.map((note) => note.fret)) : 0
  const soundingKey = voicing.notes
    .map((note) => `${note.string}:${note.open ? 'o' : note.fret - lowestFretted}:${note.degree}`)
    .sort()
    .join('|')
  const mutedKey = [...voicing.mutedStrings].sort((a, b) => a - b).join(',')
  return `${soundingKey}#${mutedKey}`
}

function dedupeByShape(voicings: Voicing[]): Voicing[] {
  const groups = new Map<string, Voicing[]>()
  for (const voicing of voicings) {
    const key = shapeSignature(voicing)
    const group = groups.get(key)
    if (group) group.push(voicing)
    else groups.set(key, [voicing])
  }

  const representatives: Voicing[] = []
  for (const group of groups.values()) {
    const byPosition = [...group].sort((a, b) => a.positions[0] - b.positions[0])
    const rep = byPosition[0]
    const positions = [...new Set(byPosition.map((voicing) => voicing.positions[0]))].sort((a, b) => a - b)
    representatives.push({ ...rep, positions })
  }

  representatives.sort(
    (a, b) => b.score - a.score || a.positions[0] - b.positions[0] || shapeSignature(a).localeCompare(shapeSignature(b)),
  )
  return representatives
}
