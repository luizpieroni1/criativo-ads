-- Habilitar extensão UUID
create extension if not exists "pgcrypto";

-- Tabela de criativos
create table public.creatives (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  format      text not null check (format in ('imagem', 'carrossel', 'video')),
  company_name text not null,
  form_data   jsonb not null default '{}',
  result      text not null default ''
);

-- Row Level Security
alter table public.creatives enable row level security;

-- Políticas: usuário só acessa os próprios registros
create policy "Users can select own creatives"
  on public.creatives for select
  using (auth.uid() = user_id);

create policy "Users can insert own creatives"
  on public.creatives for insert
  with check (auth.uid() = user_id);

create policy "Users can update own creatives"
  on public.creatives for update
  using (auth.uid() = user_id);

create policy "Users can delete own creatives"
  on public.creatives for delete
  using (auth.uid() = user_id);

-- Índice para queries por usuário
create index creatives_user_id_idx on public.creatives(user_id);
create index creatives_created_at_idx on public.creatives(created_at desc);
