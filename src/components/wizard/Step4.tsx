import type { Step4Data } from '@/lib/wizard-types'
import Field from './Field'

const FORMATS = [
  { value: 'imagem', label: 'Imagem única', desc: '3 variações de copy com direção visual' },
  { value: 'carrossel', label: 'Carrossel', desc: 'Slides com gancho, desenvolvimento e CTA' },
  { value: 'video', label: 'Vídeo', desc: 'Roteiro completo com marcação de tempo' },
] as const

export default function Step4({ data, onChange }: { data: Step4Data; onChange: (v: Partial<Step4Data>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Formato do criativo</h2>
        <p className="text-gray-400 text-sm mt-1">Escolha como seu anúncio será apresentado</p>
      </div>

      <Field label="Formato" required>
        <div className="space-y-3">
          {FORMATS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange({ format: f.value })}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition ${
                data.format === f.value
                  ? 'bg-orange-500/10 border-orange-500/40'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                data.format === f.value ? 'border-orange-500' : 'border-gray-600'
              }`}>
                {data.format === f.value && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
              </div>
              <div>
                <p className="font-semibold text-white">{f.label}</p>
                <p className="text-sm text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Field>

      {data.format === 'carrossel' && (
        <Field label="Quantas fatias (slides)?" required>
          <input
            type="number"
            min={3}
            max={20}
            value={data.carouselSlides ?? 5}
            onChange={e => onChange({ carouselSlides: Number(e.target.value) })}
            className="input w-32"
          />
        </Field>
      )}

      {data.format === 'video' && (
        <Field label="Duração do vídeo (segundos)?" required>
          <input
            type="number"
            min={15}
            max={90}
            value={data.videoDuration ?? 30}
            onChange={e => onChange({ videoDuration: Number(e.target.value) })}
            className="input w-32"
          />
        </Field>
      )}

      <Field label="Cores / identidade visual" required>
        <div className="space-y-2">
          {[
            { value: 'sim', label: 'Sim, tenho identidade visual' },
            { value: 'nao', label: 'Não tenho ainda' },
            { value: 'sugestao', label: 'Prefiro sugestão da IA' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ brandColors: opt.value as Step4Data['brandColors'] })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${
                data.brandColors === opt.value
                  ? 'bg-orange-500/10 border-orange-500/40 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                data.brandColors === opt.value ? 'border-orange-500' : 'border-gray-600'
              }`}>
                {data.brandColors === opt.value && <div className="w-2 h-2 rounded-full bg-orange-500" />}
              </div>
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        {data.brandColors === 'sim' && (
          <input
            value={data.brandColorsValue ?? ''}
            onChange={e => onChange({ brandColorsValue: e.target.value })}
            placeholder="Ex: Laranja #f97316 e preto, estilo minimalista..."
            className="input mt-3"
          />
        )}
      </Field>

      <Field label="Frase ou slogan da marca (opcional)">
        <input
          value={data.slogan ?? ''}
          onChange={e => onChange({ slogan: e.target.value })}
          placeholder="Ex: Transformando vidas, um sorriso por vez"
          className="input"
        />
      </Field>
    </div>
  )
}
