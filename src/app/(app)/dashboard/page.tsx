import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  const { data: creativesRaw } = await supabase
    .from('creatives')
    .select('id, created_at, format, company_name')
    .order('created_at', { ascending: false })
    .limit(5)
  const creatives = creativesRaw as Array<{ id: string; created_at: string; format: string; company_name: string }> | null

  const name = (session?.user?.user_metadata?.name as string) || 'Usuário'
  const total = creatives?.length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Olá, {name}! 👋</h1>
        <p className="text-gray-400 mt-1">Pronto para criar anúncios que vendem?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Criativos gerados" value={String(total)} />
        <StatCard label="Formatos disponíveis" value="3" />
        <StatCard label="Powered by" value="Claude AI" highlight />
      </div>

      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Gerar novo criativo</h2>
        <p className="text-gray-400 mb-6">Preencha o formulário em 4 etapas e receba seu criativo personalizado</p>
        <Link
          href="/novo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Começar agora
        </Link>
      </div>

      {creatives && creatives.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Últimos criativos</h2>
            <Link href="/historico" className="text-orange-500 hover:text-orange-400 text-sm">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {creatives.map(c => (
              <CreativeRow key={c.id} id={c.id} format={c.format} company={c.company_name} date={c.created_at} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 border ${highlight ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/10 bg-[#1a1a1a]'}`}>
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-orange-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function CreativeRow({ id, format, company, date }: { id: string; format: string; company: string; date: string }) {
  const fmt: Record<string, string> = { imagem: 'Imagem', carrossel: 'Carrossel', video: 'Vídeo' }
  return (
    <Link
      href={`/resultado/${id}`}
      className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-4 hover:border-orange-500/30 transition group"
    >
      <div>
        <p className="font-medium group-hover:text-orange-400 transition">{company}</p>
        <p className="text-sm text-gray-500 mt-0.5">{fmt[format] ?? format}</p>
      </div>
      <p className="text-sm text-gray-500">{new Date(date).toLocaleDateString('pt-BR')}</p>
    </Link>
  )
}
