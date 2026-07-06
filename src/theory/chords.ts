export interface ChordQuality {
  suffixes: string[]
  intervals: number[]
  degreeLabels: string[]
}

export const CHORD_QUALITIES: ChordQuality[] = [
  { suffixes: [''], intervals: [0, 4, 7], degreeLabels: ['1', '3', '5'] },
  { suffixes: ['m', 'min', '-'], intervals: [0, 3, 7], degreeLabels: ['1', 'b3', '5'] },
  { suffixes: ['dim'], intervals: [0, 3, 6], degreeLabels: ['1', 'b3', 'b5'] },
  { suffixes: ['aug', '+'], intervals: [0, 4, 8], degreeLabels: ['1', '3', '#5'] },
  { suffixes: ['sus2'], intervals: [0, 2, 7], degreeLabels: ['1', '2', '5'] },
  { suffixes: ['sus4'], intervals: [0, 5, 7], degreeLabels: ['1', '4', '5'] },
  { suffixes: ['7'], intervals: [0, 4, 7, 10], degreeLabels: ['1', '3', '5', 'b7'] },
  { suffixes: ['maj7', 'M7'], intervals: [0, 4, 7, 11], degreeLabels: ['1', '3', '5', '7'] },
  { suffixes: ['m7', 'min7'], intervals: [0, 3, 7, 10], degreeLabels: ['1', 'b3', '5', 'b7'] },
  { suffixes: ['m7b5', 'min7b5', 'm7-5'], intervals: [0, 3, 6, 10], degreeLabels: ['1', 'b3', 'b5', 'b7'] },
  { suffixes: ['dim7'], intervals: [0, 3, 6, 9], degreeLabels: ['1', 'b3', 'b5', 'bb7'] },
  { suffixes: ['6'], intervals: [0, 4, 7, 9], degreeLabels: ['1', '3', '5', '6'] },
  { suffixes: ['m6', 'min6'], intervals: [0, 3, 7, 9], degreeLabels: ['1', 'b3', '5', '6'] },
  { suffixes: ['9'], intervals: [0, 4, 7, 10, 14], degreeLabels: ['1', '3', '5', 'b7', '9'] },
  { suffixes: ['maj9', 'M9'], intervals: [0, 4, 7, 11, 14], degreeLabels: ['1', '3', '5', '7', '9'] },
  { suffixes: ['m9', 'min9'], intervals: [0, 3, 7, 10, 14], degreeLabels: ['1', 'b3', '5', 'b7', '9'] },
  { suffixes: ['add9'], intervals: [0, 4, 7, 14], degreeLabels: ['1', '3', '5', '9'] },
  { suffixes: ['11'], intervals: [0, 4, 7, 10, 14, 17], degreeLabels: ['1', '3', '5', 'b7', '9', '11'] },
  { suffixes: ['13'], intervals: [0, 4, 7, 10, 14, 17, 21], degreeLabels: ['1', '3', '5', 'b7', '9', '11', '13'] },
  { suffixes: ['5'], intervals: [0, 7], degreeLabels: ['1', '5'] },
]
