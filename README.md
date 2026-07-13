# fretboard-master

A client-side webapp for studying fretted instruments by visualizing notes on a
fretboard: scales, arpeggios, and custom tunings.

Live app: https://estebanmdq.github.io/fretboard-master/

## Development

```bash
npm install
npm run dev     # start the dev server
npm run build   # type-check and build for production
npm test        # run the theory unit tests
npm run lint    # lint the source
```

## Project structure

```
src/
  components/   # React components (AppShell, Fretboard, panels)
  theory/       # pure music-theory logic (notes, intervals, scales, chords)
  state/        # app state context + reducer
```
