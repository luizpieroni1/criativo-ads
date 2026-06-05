import type { Step1Data } from '@/lib/wizard-types'
import Field from './Field'
import AutocompleteInput from './AutocompleteInput'

export default function Step1({ data, onChange }: { data: Step1Data; onChange: (v: Partial<Step1Data>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Sobre a empresa</h2>
        <p className="text-gray-400 text-sm mt-1">Conte-nos sobre o negócio que será anunciado</p>
      </div>

      <Field label="Nome da empresa / produto anunciado" required>
        <AutocompleteInput
          fieldName="companyName"
          value={data.companyName}
          onChange={v => onChange({ companyName: v })}
          placeholder="Ex: Clínica Bella Vita, Curso de Tráfego Pro..."
        />
      </Field>

      <Field label="Nicho de atuação" required>
        <AutocompleteInput
          fieldName="niche"
          value={data.niche}
          onChange={v => onChange({ niche: v })}
          placeholder="Ex: Estética, Educação, Imóveis, Saúde..."
        />
      </Field>

      <Field label="Produtos ou serviços oferecidos" required>
        <AutocompleteInput
          fieldName="products"
          value={data.products}
          onChange={v => onChange({ products: v })}
          placeholder="Descreva os principais produtos ou serviços..."
          multiline
          rows={3}
        />
      </Field>

      <Field label="Região de atendimento" required>
        <AutocompleteInput
          fieldName="region"
          value={data.region}
          onChange={v => onChange({ region: v })}
          placeholder="Ex: São Paulo - SP, Brasil inteiro, Online..."
        />
      </Field>

      <Field label="Público-alvo detalhado" required>
        <AutocompleteInput
          fieldName="targetAudience"
          value={data.targetAudience}
          onChange={v => onChange({ targetAudience: v })}
          placeholder="Idade, gênero, interesses, dores, nível socioeconômico..."
          multiline
          rows={3}
        />
      </Field>
    </div>
  )
}
