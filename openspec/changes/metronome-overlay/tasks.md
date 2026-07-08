# Tasks: metronome-overlay

## 1. Overlay presentation

- [x] 1.1 Wrap `MetronomePanel` in a `position: relative` container and move the expanded body into an overlay-styled element
- [x] 1.2 Style the overlay in `MetronomePanel.css` as a floating card (absolute anchor to trigger, shadow, background, radius, z-index, max-width)
- [x] 1.3 Verify expanding/collapsing does not reflow the tabs, control panel, or fretboard

## 2. Dismissal

- [x] 2.1 Add an effect (active only while expanded) that closes the overlay on Escape via `onToggleCollapsed`
- [x] 2.2 Add click-outside dismissal using a ref-contains check on the panel container, excluding the trigger
- [x] 2.3 Clean up listeners on collapse/unmount

## 3. Verification

- [x] 3.1 Check narrow-width behavior; fall back to fixed corner anchoring if the card clips at the viewport edge
- [x] 3.2 Verify `npm run lint` and `npm run build` pass
