import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Verifica se as variáveis de ambiente estão disponíveis
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Sem env vars, deixa passar sem verificar sessão
    return res
  }

  const isPublic = PUBLIC_PATHS.some(p => req.nextUrl.pathname.startsWith(p))

  try {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session && !isPublic) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    if (session && isPublic) {
      const dashboardUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(dashboardUrl)
    }
  } catch {
    // Em caso de erro no Supabase, redireciona rotas protegidas para login
    if (!isPublic) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
}
