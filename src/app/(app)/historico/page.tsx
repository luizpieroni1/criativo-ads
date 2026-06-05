import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'

const FORMAT_LABELS: Record<string, string> = {
  imagem: 'Imagem Única',
  carrossel: 'Carrossel',
  video: 'Vídeo',
}

const FORMAT_COLORS: Record<string, string> = {
  imagem: 'text-blue-400 bg-blue-400/10',
  carrossel: 'text-purple-400 bg-purple-400/10',
  video: 'text-green-400 bg-green-400/10',
}

export default async function HistoricoPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: creativesRaw } = await supabase
    .from('creatives')
    .select('id, created_at, format, company_name')
    .eq('user_id', session!.user.id)
    .order('created_at', { ascending: false })
  type CreativeRow = { id: string; created_at: string; format: string; company_name: string }
  const creatives = creativesRaw as CreativeRow[] | null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Histórico</h1>
          <p className="text-gray-400 text-sm mt-1">
            {creatives?.length ?? 0} criativo{(creatives?.length ?? 0) !== 1 ? 's' : ''} gerado{(creatives?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/novo"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
        >
          Novo criativo
        </Link>
      </div>

      {(!creatives || creatives.length === 0) ? (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-16 text-center">
          <p className="text-gray-400 text-lg">Nenhum criativo gerado ainda</p>
          <p className="text-gray-600 text-sm mt-2">Crie seu primeiro anúncio agora</p>
          <Link
            href="/novo"
            className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Começar
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {creatives.map(c => (
            <Link
              key={c.id}
              href={`/resultado/${c.id}`}
              className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-4 hover:border-orange-500/30 transition group"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold group-hover:text-orange-400 transition">{c.company_name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(c.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${FORMAT_COLORS[c.format] ?? 'text-gray-400 bg-white/5'}`}>
                  {FORMAT_LABELS[c.format] ?? c.format}
                </span>
                <svg className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
