## Why

The current scale picker is a flat list of 17 presets that mixes scale families with their modes (e.g., Major/Ionian, Dorian, Phrygian are separate entries with no visible relationship). This makes it hard to explore a scale family across its modes and obscures the music theory connection between them.

## What Changes

- Replace the single flat "Scale" dropdown with two linked dropdowns: **Scale Family** and **Mode**
- Scale families group related scales; the Mode dropdown updates to show only the modes available for the selected family
- Add the Augmented scale family (not currently in presets)
- Remove orphaned presets from the flat list (Dorian, Phrygian, Lydian, Mixolydian, Locrian become modes of Major; Natural Minor becomes Aeolian mode of Major)
- The custom scale editor remains available as a standalone option
- Root and Direction selectors stay as-is

**Scale families and their modes:**

| Family | Modes |
|---|---|
| Major | Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian |
| Harmonic Minor | Harmonic Minor, Locrian #6, Ionian #5, Dorian #4, Phrygian Dominant, Lydian #2, Super Locrian bb7 |
| Melodic Minor | Melodic Minor, Dorian b2, Lydian Augmented, Lydian Dominant, Mixolydian b6, Locrian #2, Altered |
| Pentatonic | Major Pentatonic, Minor Pentatonic, Blues |
| Diminished | Whole-Half, Half-Whole |
| Augmented | Augmented, Inverted Augmented |
| Symmetrical | Whole Tone, Chromatic |
| Other | Miyako Bushi |

## Capabilities

### New Capabilities

- `scale-family-selector`: Two linked dropdowns (Scale Family + Mode) that replace the flat preset list. Selecting a family resets the mode to the first mode of that family. The full set of scale intervals and degree labels is derived from the selected family + mode combination.

### Modified Capabilities

- `scale-visualization`: The requirement "Select a root and scale" changes - the user now selects root + family + mode instead of root + flat preset. The preset catalog requirement is replaced by the family/mode catalog. Custom scale editor and `buildMarkers` remain unchanged.

## Impact

- `src/theory/scales.ts`: Restructure `SCALE_PRESETS` into a `SCALE_FAMILIES` data structure (family name -> array of modes, each with name, intervals, degreeLabels)
- `src/components/ScalePanel/ScalePanel.tsx`: Add a second `<select>` for Mode; wire family change to reset mode to index 0
- `src/state/appStateStore.ts`: Replace `presetIndex: number` with `familyIndex: number` and `modeIndex: number`
- Existing tests in `scales.test.ts` that reference `SCALE_PRESETS` will need updating
