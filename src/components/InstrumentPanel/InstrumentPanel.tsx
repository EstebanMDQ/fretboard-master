import { useState } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import { STANDARD_SPELLINGS, spellingToLabel, type Spelling } from '../../theory/notes'
import {
  BUILT_IN_TUNINGS,
  deleteTuning,
  loadSavedTunings,
  saveSavedTunings,
  upsertTuning,
  type InstrumentConfig,
  type NamedTuning,
  type StringConfig,
} from '../../theory/tunings'
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
  const t = useTranslation()
  const [savedTunings, setSavedTunings] = useState<NamedTuning[]>(() => loadSavedTunings())
  const [newName, setNewName] = useState('')

  function persist(next: NamedTuning[]) {
    setSavedTunings(next)
    saveSavedTunings(next)
  }

  function saveCurrent() {
    const name = newName.trim()
    if (!name) return
    persist(upsertTuning(savedTunings, { name, config }))
    setNewName('')
  }

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
      <h2>{t.instrumentPanelTitle}</h2>

      <div className="instrument-panel__presets">
        {BUILT_IN_TUNINGS.map((tuning) => (
          <button key={tuning.name} type="button" onClick={() => onChange(tuning.config)}>
            {tuning.name}
          </button>
        ))}
      </div>

      <div className="instrument-panel__library">
        <div className="instrument-panel__save-row">
          <input
            type="text"
            placeholder={t.tuningNamePlaceholder}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveCurrent()
            }}
          />
          <button type="button" onClick={saveCurrent} disabled={newName.trim() === ''}>
            {t.saveBtn}
          </button>
        </div>
        {savedTunings.length > 0 && (
          <ul className="instrument-panel__saved">
            {savedTunings.map((tuning) => (
              <li key={tuning.name} className="instrument-panel__saved-row">
                <button
                  type="button"
                  className="instrument-panel__saved-load"
                  onClick={() => onChange(tuning.config)}
                >
                  {tuning.name}
                </button>
                <button
                  type="button"
                  onClick={() => persist(deleteTuning(savedTunings, tuning.name))}
                  aria-label={t.deleteTuningLabel(tuning.name)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="instrument-panel__field">
        {t.fretsLabel}
        <input
          type="number"
          min={1}
          max={36}
          value={config.fretCount}
          onChange={(e) => onChange({ ...config, fretCount: Number(e.target.value) })}
        />
      </label>

      <fieldset className="instrument-panel__strings">
        <legend>{t.stringsLegend}</legend>
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
              aria-label={t.removeStringLabel(index + 1)}
            >
              &times;
            </button>
          </div>
        ))}
        <button type="button" onClick={addString}>
          {t.addStringBtn}
        </button>
      </fieldset>
    </div>
  )
}
