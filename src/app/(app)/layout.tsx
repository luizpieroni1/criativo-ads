export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import AppNav from '@/components/AppNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AppNav user={session.user} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
