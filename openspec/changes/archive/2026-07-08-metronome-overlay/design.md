# Design: metronome-overlay

## Context

`MetronomePanel` renders inside `app-shell__global-controls`. When `metronome.collapsed` is false, the `metronome-panel__body` renders in normal document flow, so it pushes the tabs, control panel, and fretboard down. The `collapsed` flag already exists in `AppState` and persists behavior is unchanged; this is a presentation-only change.

## Goals / Non-Goals

**Goals:**
- Expanded panel floats above content; opening/closing never reflows the page.
- Keep the collapsed trigger inline and compact as it is now.
- Add Escape and click-outside dismissal, reusing the existing collapse toggle.

**Non-Goals:**
- No draggable/resizable/movable overlay - a fixed anchored card is enough.
- No modal backdrop that blocks interaction with the rest of the app (it stays a non-modal control).
- No change to audio, tempo/meter/accent/gap logic, or the persisted `collapsed` state.

## Decisions

- **Positioning**: render `metronome-panel__body` as a floating card taken out of flow. Anchor it to the trigger via a `position: relative` wrapper on the panel and `position: absolute` on the body (dropping below/right of the trigger), with elevation (`box-shadow`, background, `z-index`) and a sensible `max-width`. This keeps it near its trigger and avoids covering the fretboard. Use `position: fixed` only if absolute anchoring clips at the viewport edge.
- **Dismissal**: when expanded, attach a `keydown` (Escape) and a pointerdown/click-outside listener (guarded by a ref on the panel) that call the existing `onToggleCollapsed`. Register listeners only while expanded and clean them up on collapse/unmount. No new state - dismissal is just the existing toggle.
- **Non-modal**: no backdrop overlay intercepting clicks; the rest of the UI stays interactive. Click-outside detection uses a ref-contains check.
- **Accessibility**: keep the trigger as the labelled control; the floating body keeps its existing controls. Escape-to-close is the standard expectation for a transient popover.

## Directory layout

- `MetronomePanel.tsx`: wrap panel in a ref'd container; move body into an overlay-styled container; add an effect that wires Escape + click-outside to `onToggleCollapsed` while expanded.
- `MetronomePanel.css`: overlay card styles (absolute positioning, shadow, background, radius, z-index, max-width).
- `AppShell.css`: only if needed to give the panel a positioning context or spacing.

## Risks / Trade-offs

- **Overlay clipping at viewport edges** on small screens → fall back to `position: fixed` with a corner anchor if absolute anchoring overflows; verify at narrow widths.
- **Click-outside vs the trigger button**: the toggle handler must not immediately re-close on the same click that opened it → scope the outside-click listener to the expanded state and exclude the panel container (which includes the trigger) via ref-contains.
