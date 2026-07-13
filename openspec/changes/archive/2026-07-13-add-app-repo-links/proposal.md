## Why

The README has no link to the live app, and the live app has no link back to its source code. Anyone landing on either needs to hunt for the other.

## What Changes

- Add a "Live app" link to `README.md` pointing to `https://estebanmdq.github.io/fretboard-master/`
- Add a small GitHub icon link in the app footer (or header) pointing to `https://github.com/EstebanMDQ/fretboard-master`

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-shell`: The base layout requirement gains a footer (or header link) with a link to the GitHub repository. This is a spec-level change because it adds a permanent visible element to the shell layout.

## Impact

- `README.md` - one new line
- `src/components/AppShell/AppShell.tsx` - add a repo link element to the header or as a new footer
- `src/components/AppShell/AppShell.css` - minimal styling for the link
