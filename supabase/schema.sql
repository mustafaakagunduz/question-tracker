-- TABLES

create table if not exists public.questions (
  id bigint generated always as identity primary key,
  title text not null,
  site text not null,
  link text not null,
  solved_date date,
  difficulty text not null,
  review_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.question_review_status (
  id bigint generated always as identity primary key,
  question_id bigint not null references public.questions(id) on delete cascade,
  review_date date not null,
  is_reviewed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (question_id, review_date)
);

-- RLS ENABLE

alter table public.questions enable row level security;
alter table public.question_review_status enable row level security;

-- POLICIES (IDEMPOTENT)

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Allow anon full access on questions'
      and tablename = 'questions'
  ) then
    create policy "Allow anon full access on questions"
      on public.questions
      for all
      to anon
      using (true)
      with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Allow anon full access on question_review_status'
      and tablename = 'question_review_status'
  ) then
    create policy "Allow anon full access on question_review_status"
      on public.question_review_status
      for all
      to anon
      using (true)
      with check (true);
  end if;
end
$$;