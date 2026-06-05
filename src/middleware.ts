import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register']

export function middleware(req: NextRequest) {
  const isPublic = PUBLIC_PATHS.some(p => req.nextUrl.pathname.startsWith(p))

  // Extrai o project ref da URL do Supabase para montar o nome do cookie
  // Ex: https://kxrkcyujmbagyboetrbt.supabase.co → kxrkcyujmbagyboetrbt
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ''
  const cookieName = projectRef ? `sb-${projectRef}-auth-token` : ''

  // Verifica se existe cookie de sessão ativo
  const hasSession = cookieName
    ? req.cookies.has(cookieName)
    : false

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
}
