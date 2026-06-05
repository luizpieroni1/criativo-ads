'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { WizardData } from '@/lib/wizard-types'
import Step1 from '@/components/wizard/Step1'
import Step2 from '@/components/wizard/Step2'
import Step3 from '@/components/wizard/Step3'
import Step4 from '@/components/wizard/Step4'

const STEPS = ['Empresa', 'Oferta', 'Anúncio', 'Formato']

const emptyData: WizardData = {
  step1: { companyName: '', niche: '', products: '', region: '', targetAudience: '' },
  step2: { advertised: '', price: '', mainPromise: '', differentials: '', socialProof: '' },
  step3: { objectives: [], cta: '', tone: '' },
  step4: { format: 'imagem', brandColors: 'nao' },
}

export default function NovoPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>(emptyData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateStep1(v: Partial<WizardData['step1']>) {
    setData(d => ({ ...d, step1: { ...d.step1, ...v } }))
  }
  function updateStep2(v: Partial<WizardData['step2']>) {
    setData(d => ({ ...d, step2: { ...d.step2, ...v } }))
  }
  function updateStep3(v: Partial<WizardData['step3']>) {
    setData(d => ({ ...d, step3: { ...d.step3, ...v } }))
  }
  function updateStep4(v: Partial<WizardData['step4']>) {
    setData(d => ({ ...d, step4: { ...d.step4, ...v } }))
  }

  async function handleFinish() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erro ao gerar criativo')
      const { result } = await res.json()

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Não autenticado')

      const { data: saved, error: dbError } = await supabase.from('creatives').insert({
        user_id: session.user.id,
        format: data.step4.format,
        company_name: data.step1.companyName,
        form_data: data as unknown as Record<string, unknown>,
        result,
      }).select('id').single()

      if (dbError) throw dbError

      // Salvar histórico de campos para autocomplete
      const historyEntries = [
        { field_name: 'companyName',   value: data.step1.companyName },
        { field_name: 'niche',         value: data.step1.niche },
        { field_name: 'products',      value: data.step1.products },
        { field_name: 'region',        value: data.step1.region },
        { field_name: 'targetAudience',value: data.step1.targetAudience },
        { field_name: 'advertised',    value: data.step2.advertised },
      ].filter(e => e.value.trim())
      fetch('/api/field-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: historyEntries }),
      }).catch(() => {}) // fire-and-forget

      router.push(`/resultado/${saved.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro inesperado')
      setLoading(false)
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">Novo Criativo</h1>
          <span className="text-sm text-gray-400">Etapa {step + 1} de {STEPS.length}</span>
        </div>

        <div className="flex gap-2 mb-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${i <= step ? 'bg-orange-500' : 'bg-white/10'}`} />
              <p className={`text-xs mt-1.5 ${i === step ? 'text-orange-400 font-medium' : 'text-gray-600'}`}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8">
        {step === 0 && <Step1 data={data.step1} onChange={updateStep1} />}
        {step === 1 && <Step2 data={data.step2} onChange={updateStep2} />}
        {step === 2 && <Step3 data={data.step3} onChange={updateStep3} />}
        {step === 3 && <Step4 data={data.step4} onChange={updateStep4} />}

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={loading}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition"
            >
              Voltar
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
            >
              Próxima etapa
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Gerando criativo...
                </span>
              ) : 'Gerar criativo'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
