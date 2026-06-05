'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Creative = Database['public']['Tables']['creatives']['Row']

const FORMAT_LABELS: Record<string, string> = {
  imagem: 'Imagem Única',
  carrossel: 'Carrossel',
  video: 'Vídeo',
}

export default function ResultadoClient({ creative }: { creative: Creative }) {
  const router = useRouter()
  const supabase = createClient()
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function copyAll() {
    await navigator.clipboard.writeText(creative.result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function saveToHistory() {
    setSaving(true)
    await supabase
      .from('creatives')
      .update({ result: creative.result })
      .eq('id', creative.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const lines = creative.result.split('\n')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{creative.company_name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-medium bg-orange-500/15 text-orange-400 px-2.5 py-1 rounded-full">
              {FORMAT_LABELS[creative.format] ?? creative.format}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(creative.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAll}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-4 py-2 rounded-xl transition"
          >
            {copied ? '✓ Copiado!' : 'Copiar tudo'}
          </button>
          <button
            onClick={saveToHistory}
            disabled={saving || saved}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-50"
          >
            {saved ? '✓ Salvo' : saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
        <div className="prose prose-invert prose-sm max-w-none">
          <ResultContent result={creative.result} />
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/novo"
          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Gerar novo criativo
        </Link>
        <Link
          href="/historico"
          className="flex-1 text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl transition"
        >
          Ver histórico
        </Link>
      </div>
    </div>
  )
}

function ResultContent({ result }: { result: string }) {
  const lines = result.split('\n')

  return (
    <div className="space-y-1 font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-lg font-bold text-orange-400 mt-6 mb-2 first:mt-0 not-prose">
              {line.replace('## ', '')}
            </h2>
          )
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="text-base font-semibold text-white mt-4 mb-1 not-prose">
              {line.replace('### ', '')}
            </h3>
          )
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-bold text-white not-prose">
              {line.replace(/\*\*/g, '')}
            </p>
          )
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <p key={i} className="text-gray-300 pl-4 not-prose">
              {line}
            </p>
          )
        }
        if (line.trim() === '') {
          return <div key={i} className="h-2" />
        }
        return (
          <p key={i} className="text-gray-300 not-prose">
            {line}
          </p>
        )
      })}
    </div>
  )
}
