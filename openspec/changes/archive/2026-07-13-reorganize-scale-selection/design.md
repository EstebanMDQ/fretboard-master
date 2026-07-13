## Context

The current `ScalePanel` presents all 17 scale presets in a single flat `<select>`. Modes of the same parent scale (e.g. Dorian, Phrygian, Lydian as modes of Major) appear as unrelated entries. There is no way to browse "all modes of harmonic minor" without knowing to look for them.

State currently tracks `presetIndex: number` (index into `SCALE_PRESETS`). The UI component reads this index and maps it to the preset array.

## Goals / Non-Goals

**Goals:**
- Group presets into families with modes; surface this grouping in the UI via two linked dropdowns
- Keep `buildMarkers` and custom scale editor unchanged
- Expand the preset catalog with Augmented and full Harmonic/Melodic Minor modes
- State remains a plain discriminated union - no external libraries

**Non-Goals:**
- Reordering or animating the dropdowns
- Persisting the selection to localStorage
- Changing the playback engine or marker builder

## Decisions

### 1. New data shape in `scales.ts`

Replace the flat `SCALE_PRESETS: Scale[]` with:

```ts
export interface ScaleFamily {
  name: string
  modes: Scale[]   // Scale = { name, intervals, degreeLabels } - unchanged
}

export const SCALE_FAMILIES: ScaleFamily[]
```

Each family's `modes[0]` is the "root" mode (e.g. Ionian for Major, Harmonic Minor for Harmonic Minor). This is the default when a family is selected.

**Why not keep SCALE_PRESETS?** A flat array is still derivable (`SCALE_FAMILIES.flatMap(f => f.modes)`) if anything else needs it, but the family structure can't be derived from a flat list without extra metadata. The source of truth should be the richer structure.

### 2. State shape change

Replace `presetIndex: number` with `familyIndex: number` and `modeIndex: number` in `ScaleToolState`. Both default to 0.

Replace the `selectScalePreset` action with two actions:
- `selectScaleFamily(familyIndex)` - resets `modeIndex` to 0
- `selectScaleMode(modeIndex)`

**Why two actions instead of one?** Selecting a family is always followed by a mode reset, which is better expressed explicitly in the reducer than handled in the component. Keeps the reducer as the single source of truth.

### 3. UI: two linked `<select>` elements

`ScalePanel` renders:
1. Family dropdown - maps `SCALE_FAMILIES` by index
2. Mode dropdown - maps `SCALE_FAMILIES[familyIndex].modes` by index; re-renders when family changes

Changing the family dropdown dispatches `selectScaleFamily`, which resets `modeIndex` to 0 in the reducer. The mode dropdown reads the updated state.

**Why index-based rather than name-based?** Consistent with the existing `presetIndex` approach; avoids string comparison; names can be renamed without breaking state.

### 4. Scale catalog

Families and mode counts:

| Family | Modes |
|---|---|
| Major | 7 (Ionian through Locrian) |
| Harmonic Minor | 7 |
| Melodic Minor | 7 |
| Pentatonic | 3 (Major, Minor, Blues) |
| Diminished | 2 (Whole-Half, Half-Whole) |
| Augmented | 2 (Augmented, Inverted Augmented) |
| Symmetrical | 2 (Whole Tone, Chromatic) |
| Other | 1 (Miyako Bushi) |

Blues and Miyako Bushi don't have traditional "mode" families but are grouped to avoid orphaned entries.

## Risks / Trade-offs

- **Existing test references to `SCALE_PRESETS`** will break. `scales.test.ts` must be updated. Low risk - tests are unit tests against known intervals.
- **Renaming Natural Minor to Aeolian** and folding it into Major modes may surprise users familiar with the old name. Mitigation: keep "Natural Minor (Aeolian)" as the display name for the Major mode 6.
- **Augmented modes** are less common in guitar education. Including "Inverted Augmented" may confuse beginners. Accepted trade-off for completeness; can be removed later.
- **Harmonic/Melodic Minor mode names** (e.g. "Locrian #6", "Lydian Augmented") are theory-heavy. Acceptable for this educational tool's target audience.
