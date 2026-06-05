'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AppNav({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const name = (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'Usuário'

  return (
    <nav className="border-b border-white/10 bg-[#141414]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg" />
            <span className="font-bold text-white hidden sm:block">Anúncios que Vendem</span>
          </Link>
          <div className="flex items-center gap-1">
            <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
            <NavLink href="/novo" active={pathname.startsWith('/novo')}>Novo Criativo</NavLink>
            <NavLink href="/historico" active={pathname.startsWith('/historico')}>Histórico</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">{name}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
        active ? 'bg-orange-500/15 text-orange-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  )
}
