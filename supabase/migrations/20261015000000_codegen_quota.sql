-- Reserve one of twenty daily generations per authenticated user atomically.
create table if not exists public.codegen_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  requests integer not null check (requests between 1 and 20),
  primary key (user_id, usage_day)
);
alter table public.codegen_usage enable row level security;
revoke all on table public.codegen_usage from public, anon, authenticated;

create or replace function public.consume_codegen_quota()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare used integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  insert into public.codegen_usage (user_id, usage_day, requests)
  values (auth.uid(), (now() at time zone 'UTC')::date, 1)
  on conflict (user_id, usage_day) do update
    set requests = public.codegen_usage.requests + 1
    where public.codegen_usage.requests < 20
  returning requests into used;
  return used is not null;
end;
$$;
revoke all on function public.consume_codegen_quota() from public, anon;
grant execute on function public.consume_codegen_quota() to authenticated;
