import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/field-history?field=companyName
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const field = req.nextUrl.searchParams.get('field')
  if (!field) return NextResponse.json([])

  const { data } = await supabase
    .from('user_field_history')
    .select('value')
    .eq('user_id', session.user.id)
    .eq('field_name', field)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json((data ?? []).map((r: { value: string }) => r.value))
}

// POST /api/field-history  body: { entries: { field_name, value }[] }
export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ ok: false }, { status: 401 })

  const { entries } = await req.json() as {
    entries: { field_name: string; value: string }[]
  }

  const rows = entries
    .filter(e => e.value && e.value.trim().length > 0)
    .map(e => ({
      user_id: session.user.id,
      field_name: e.field_name,
      value: e.value.trim(),
    }))

  if (rows.length === 0) return NextResponse.json({ ok: true })

  // upsert — ignora se já existe (unique constraint)
  await supabase.from('user_field_history').upsert(rows, {
    onConflict: 'user_id,field_name,value',
    ignoreDuplicates: true,
  })

  return NextResponse.json({ ok: true })
}
