import type { Step3Data } from '@/lib/wizard-types'
import { OBJECTIVES, CTA_OPTIONS, TONE_OPTIONS } from '@/lib/wizard-types'
import Field from './Field'

export default function Step3({ data, onChange }: { data: Step3Data; onChange: (v: Partial<Step3Data>) => void }) {
  function toggleObjective(obj: string) {
    const current = data.objectives
    onChange({
      objectives: current.includes(obj) ? current.filter(o => o !== obj) : [...current, obj],
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Sobre o anúncio</h2>
        <p className="text-gray-400 text-sm mt-1">Objetivos, call-to-action e tom de comunicação</p>
      </div>

      <Field label="Objetivo do anúncio (selecione todos que se aplicam)" required>
        <div className="flex flex-wrap gap-2 mt-1">
          {OBJECTIVES.map(obj => (
            <button
              key={obj}
              type="button"
              onClick={() => toggleObjective(obj)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                data.objectives.includes(obj)
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {obj}
            </button>
          ))}
        </div>
      </Field>

      <Field label="CTA desejado" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CTA_OPTIONS.map(cta => (
            <RadioCard
              key={cta}
              label={cta}
              checked={data.cta === cta}
              onChange={() => onChange({ cta })}
            />
          ))}
        </div>
      </Field>

      <Field label="Tom de comunicação" required>
        <div className="space-y-2">
          {TONE_OPTIONS.map(tone => (
            <RadioCard
              key={tone}
              label={tone}
              checked={data.tone === tone}
              onChange={() => onChange({ tone })}
            />
          ))}
        </div>
      </Field>
    </div>
  )
}

function RadioCard({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${
        checked
          ? 'bg-orange-500/10 border-orange-500/40 text-white'
          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
      }`}
    >
      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
        checked ? 'border-orange-500' : 'border-gray-600'
      }`}>
        {checked && <div className="w-2 h-2 rounded-full bg-orange-500" />}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
