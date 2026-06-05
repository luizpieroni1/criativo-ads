-- Tabela de histórico de campos do formulário (para autocomplete)
create table public.user_field_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  field_name  text not null,
  value       text not null,
  created_at  timestamptz not null default now(),
  -- Garante que o mesmo usuário não salve o mesmo valor duas vezes no mesmo campo
  unique (user_id, field_name, value)
);

-- Row Level Security
alter table public.user_field_history enable row level security;

create policy "Users can select own field history"
  on public.user_field_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own field history"
  on public.user_field_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own field history"
  on public.user_field_history for delete
  using (auth.uid() = user_id);

-- Índices
create index user_field_history_user_field_idx
  on public.user_field_history(user_id, field_name);
