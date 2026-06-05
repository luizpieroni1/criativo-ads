import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import ResultadoClient from '@/components/ResultadoClient'

export default async function ResultadoPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: creative } = await supabase
    .from('creatives')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (!creative) notFound()

  return <ResultadoClient creative={creative} />
}
