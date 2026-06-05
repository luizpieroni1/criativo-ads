import type { Step2Data } from '@/lib/wizard-types'
import Field from './Field'
import AutocompleteInput from './AutocompleteInput'

export default function Step2({ data, onChange }: { data: Step2Data; onChange: (v: Partial<Step2Data>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Sobre a oferta</h2>
        <p className="text-gray-400 text-sm mt-1">O que exatamente será anunciado e como se destaca</p>
      </div>

      <Field label="Qual produto/serviço será anunciado" required>
        <AutocompleteInput
          fieldName="advertised"
          value={data.advertised}
          onChange={v => onChange({ advertised: v })}
          placeholder="Ex: Pacote de limpeza de pele + hidratação..."
        />
      </Field>

      <Field label="Preço ou faixa de preço" required>
        <input
          type="text"
          value={data.price}
          onChange={e => onChange({ price: e.target.value })}
          placeholder="Ex: R$ 197, A partir de R$ 500, Grátis..."
          className="input"
        />
      </Field>

      <Field label="Principal promessa ou resultado" required>
        <textarea
          value={data.mainPromise}
          onChange={e => onChange({ mainPromise: e.target.value })}
          rows={3}
          placeholder="Qual transformação ou benefício o cliente terá?"
          className="input resize-none"
        />
      </Field>

      <Field label="Diferencial frente à concorrência" required>
        <textarea
          value={data.differentials}
          onChange={e => onChange({ differentials: e.target.value })}
          rows={3}
          placeholder="O que torna sua oferta única ou superior?"
          className="input resize-none"
        />
      </Field>

      <Field label="Prova social ou números (opcional)">
        <textarea
          value={data.socialProof}
          onChange={e => onChange({ socialProof: e.target.value })}
          rows={2}
          placeholder="Ex: +500 clientes atendidos, 4.9★ no Google, 98% de satisfação..."
          className="input resize-none"
        />
      </Field>
    </div>
  )
}
