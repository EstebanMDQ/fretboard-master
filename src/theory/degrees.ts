/** Flat-leaning semitone-to-degree-label fallback, used for custom scales that have no diatonic degree position to anchor to. */
const FLAT_LEANING_DEGREE_LABELS = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']

export function fallbackDegreeLabel(interval: number): string {
  return FLAT_LEANING_DEGREE_LABELS[((interval % 12) + 12) % 12]
}
