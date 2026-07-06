import type { Marker } from '../../theory/notes'
import type { InstrumentConfig } from '../../theory/tunings'
import './Fretboard.css'

interface FretboardProps {
  config: InstrumentConfig
  markers: Marker[]
}

const VIEWBOX_WIDTH = 900
const VIEWBOX_HEIGHT = 260
const MARGIN_X = 28
const MARGIN_Y = 24

function fretPosition(fret: number): number {
  return 1 - Math.pow(2, -fret / 12)
}

function fretXFraction(fret: number, fretCount: number): number {
  const total = fretPosition(fretCount)
  if (total <= 0) {
    return fretCount > 0 ? fret / fretCount : 0
  }
  return fretPosition(fret) / total
}

function markerKey(stringIndex: number, fret: number): string {
  return `${stringIndex}:${fret}`
}

export function Fretboard({ config, markers }: FretboardProps) {
  const stringCount = config.strings.length
  const boardWidth = VIEWBOX_WIDTH - MARGIN_X * 2
  const boardHeight = VIEWBOX_HEIGHT - MARGIN_Y * 2
  const stringSpacing = stringCount > 1 ? boardHeight / (stringCount - 1) : 0

  const stringY = (stringIndex: number) => MARGIN_Y + boardHeight - stringIndex * stringSpacing
  const fretX = (fret: number) => MARGIN_X + fretXFraction(fret, config.fretCount) * boardWidth

  const markerByPosition = new Map<string, Marker>()
  markers.forEach((marker) => {
    markerByPosition.set(markerKey(marker.string, marker.fret), marker)
  })

  const frets = Array.from({ length: config.fretCount }, (_, i) => i + 1)

  return (
    <svg className="fretboard" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} role="img" aria-label="Fretboard">
      <line x1={fretX(0)} y1={MARGIN_Y} x2={fretX(0)} y2={MARGIN_Y + boardHeight} className="fretboard__nut" />

      {frets.map((fret) => (
        <line
          key={fret}
          x1={fretX(fret)}
          y1={MARGIN_Y}
          x2={fretX(fret)}
          y2={MARGIN_Y + boardHeight}
          className="fretboard__fret"
        />
      ))}

      {config.strings.map((_, stringIndex) => (
        <line
          key={stringIndex}
          x1={fretX(0)}
          y1={stringY(stringIndex)}
          x2={fretX(config.fretCount)}
          y2={stringY(stringIndex)}
          className="fretboard__string"
        />
      ))}

      {config.strings.map((_, stringIndex) =>
        [0, ...frets].map((fret) => {
          const marker = markerByPosition.get(markerKey(stringIndex, fret))
          if (!marker) return null
          const x = fret === 0 ? fretX(0) + 12 : (fretX(fret) + fretX(fret - 1)) / 2
          const y = stringY(stringIndex)
          const className = [
            'fretboard__marker',
            marker.emphasis && 'fretboard__marker--emphasis',
            marker.pulsing && 'fretboard__marker--pulsing',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <g key={markerKey(stringIndex, fret)} className={className}>
              <circle cx={x} cy={y} r={12} />
              <text x={x} y={y}>
                {marker.label}
              </text>
            </g>
          )
        }),
      )}
    </svg>
  )
}
