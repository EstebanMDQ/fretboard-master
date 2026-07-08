## 1. Add the presets

- [x] 1.1 Append "Diminished (Whole-Half)" to `SCALE_PRESETS` in `src/theory/scales.ts`: intervals `[0, 2, 3, 5, 6, 8, 9, 11]`, degreeLabels `['1', '2', 'b3', '4', 'b5', 'b6', '6', '7']`
- [x] 1.2 Append "Diminished (Half-Whole)": intervals `[0, 1, 3, 4, 6, 7, 9, 10]`, degreeLabels `['1', 'b2', '#2', '3', '#4', '5', '6', 'b7']`

## 2. Tests

- [x] 2.1 Update the preset-count assertion in `src/theory/scales.test.ts` from 15 to 17
- [x] 2.2 Add a test asserting both diminished scales' intervals and that each degree label spells back to its interval (labels valid for `spellDegree`)

## 3. Verification

- [x] 3.1 `npm test` passes (existing preset invariants still hold for the new 8-note scales)
- [x] 3.2 `npm run lint` clean; `npm run build` succeeds
- [x] 3.3 Manual check: both diminished scales appear in the picker and highlight correctly in names and degrees modes
- [x] 3.4 Run `openspec validate add-diminished-scales` and confirm it passes
