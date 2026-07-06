import { STANDARD_SPELLINGS, spellingToLabel, type Spelling } from '../../theory/notes'
import { GUITAR_STANDARD, UKULELE_STANDARD, type InstrumentConfig, type StringConfig } from '../../theory/tunings'
import './InstrumentPanel.css'

interface InstrumentPanelProps {
  config: InstrumentConfig
  onChange: (config: InstrumentConfig) => void
}

function spellingKey(spelling: Spelling): string {
  return `${spelling.letter}${spelling.accidental}`
}

function findSpelling(key: string): Spelling {
  const match = STANDARD_SPELLINGS.find((spelling) => spellingKey(spelling) === key)
  if (!match) throw new Error(`Unknown spelling key: ${key}`)
  return match
}

const DEFAULT_NEW_STRING: StringConfig = { spelling: { letter: 'E', accidental: 0 }, octave: 3 }

export function InstrumentPanel({ config, onChange }: InstrumentPanelProps) {
  function updateString(index: number, patch: Partial<StringConfig>) {
    const strings = config.strings.map((stringConfig, i) => (i === index ? { ...stringConfig, ...patch } : stringConfig))
    onChange({ ...config, strings })
  }

  function addString() {
    onChange({ ...config, strings: [...config.strings, DEFAULT_NEW_STRING] })
  }

  function removeString(index: number) {
    if (config.strings.length <= 1) return
    onChange({ ...config, strings: config.strings.filter((_, i) => i !== index) })
  }

  return (
    <div className="instrument-panel">
      <h2>Instrument</h2>

      <div className="instrument-panel__presets">
        <button type="button" onClick={() => onChange(GUITAR_STANDARD)}>
          Guitar
        </button>
        <button type="button" onClick={() => onChange(UKULELE_STANDARD)}>
          Ukulele
        </button>
      </div>

      <label className="instrument-panel__field">
        Frets
        <input
          type="number"
          min={1}
          max={36}
          value={config.fretCount}
          onChange={(e) => onChange({ ...config, fretCount: Number(e.target.value) })}
        />
      </label>

      <fieldset className="instrument-panel__strings">
        <legend>Strings (1 = bottom)</legend>
        {config.strings.map((stringConfig, index) => (
          <div key={index} className="instrument-panel__string-row">
            <span>{index + 1}</span>
            <select
              value={spellingKey(stringConfig.spelling)}
              onChange={(e) => updateString(index, { spelling: findSpelling(e.target.value) })}
            >
              {STANDARD_SPELLINGS.map((spelling) => (
                <option key={spellingKey(spelling)} value={spellingKey(spelling)}>
                  {spellingToLabel(spelling)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={8}
              value={stringConfig.octave}
              onChange={(e) => updateString(index, { octave: Number(e.target.value) })}
            />
            <button
              type="button"
              onClick={() => removeString(index)}
              disabled={config.strings.length <= 1}
              aria-label={`Remove string ${index + 1}`}
            >
              &times;
            </button>
          </div>
        ))}
        <button type="button" onClick={addString}>
          Add string
        </button>
      </fieldset>
    </div>
  )
}
