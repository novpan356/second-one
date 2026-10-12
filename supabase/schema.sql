-- TEKKEN ATLAS / Supabase community schema
-- Run once in Supabase SQL Editor. Safe to re-run; existing data is preserved.
begin;
create table if not exists public.fighters (id text primary key);
insert into public.fighters(id) values
('jin'),
('kazuya'),
('reina'),
('alisa'),
('asuka'),
('azucena'),
('bryan'),
('claudio'),
('devil_jin'),
('feng'),
('hwoarang'),
('jack8'),
('jun'),
('king'),
('kuma'),
('lars'),
('lee'),
('leo'),
('leroy'),
('lili'),
('xiaoyu'),
('law'),
('nina'),
('panda'),
('paul'),
('raven'),
('dragunov'),
('shaheen'),
('steve'),
('victor'),
('yoshimitsu'),
('zafina'),
('clive'),
('eddy'),
('heihachi'),
('lidia'),
('anna'),
('armor_king'),
('fahkumram'),
('miary_zo'),
('kunimitsu') on conflict do nothing;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(char_length(btrim(display_name)) between 1 and 24)
);
create table if not exists public.favorites (
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('fighter','move')),
 target text not null check(char_length(target) between 1 and 300),
 details jsonb not null default '{}'::jsonb check(jsonb_typeof(details)='object' and octet_length(details::text)<=4096),
 primary key(user_id,kind,target)
);
create table if not exists public.evaluations (
 user_id uuid not null references auth.users(id) on delete cascade,
 fighter_id text not null references public.fighters(id),
 vote smallint not null default 0 check(vote in (-1,0,1)),
 stars smallint check(stars between 1 and 5),
 check(vote<>0 or stars is not null),
 primary key(user_id,fighter_id)
);
create table if not exists public.comments (
 user_id uuid not null references public.profiles(id) on delete cascade,
 fighter_id text not null references public.fighters(id),
 content text not null check(char_length(content) between 1 and 15 and content=btrim(content) and content !~ '[[:cntrl:]]'),
 updated_at timestamptz not null default now(),
 primary key(user_id,fighter_id)
);
create index if not exists comments_fighter_time on public.comments(fighter_id,updated_at desc);
create index if not exists evaluations_fighter on public.evaluations(fighter_id);
create or replace function public.create_profile()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,display_name) values(new.id,
  case when char_length(btrim(new.raw_user_meta_data->>'display_name')) between 1 and 24
   then btrim(new.raw_user_meta_data->>'display_name') else 'FIGHTER' end
 ) on conflict(id) do nothing;
 return new;
end;$$;
drop trigger if exists atlas_profile_created on auth.users;
create trigger atlas_profile_created after insert on auth.users for each row execute function public.create_profile();
insert into public.profiles(id,display_name)
select id,case when char_length(btrim(raw_user_meta_data->>'display_name')) between 1 and 24 then btrim(raw_user_meta_data->>'display_name') else 'FIGHTER' end from auth.users on conflict do nothing;
create or replace function public.comment_timestamp()
returns trigger language plpgsql set search_path='' as $$begin new.updated_at=now(); return new; end;$$;
drop trigger if exists atlas_comment_timestamp on public.comments;
create trigger atlas_comment_timestamp before insert or update on public.comments for each row execute function public.comment_timestamp();
alter table public.fighters enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.evaluations enable row level security;
alter table public.comments enable row level security;
drop policy if exists fighters_read on public.fighters;
create policy fighters_read on public.fighters for select to anon,authenticated using(true);
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to anon,authenticated using(true);
drop policy if exists favorites_owner on public.favorites;
create policy favorites_owner on public.favorites for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
drop policy if exists evaluations_owner on public.evaluations;
create policy evaluations_owner on public.evaluations for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments for select to anon,authenticated using(true);
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert to authenticated with check((select auth.uid())=user_id);
drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete to authenticated using((select auth.uid())=user_id);
revoke all on public.fighters,public.profiles,public.favorites,public.evaluations,public.comments from anon,authenticated;
grant select on public.fighters,public.profiles,public.comments to anon,authenticated;
grant select,insert,update,delete on public.favorites,public.evaluations to authenticated;
grant insert(user_id,fighter_id,content),update(content),delete on public.comments to authenticated;
-- PostgREST upsert also writes fighter_id/user_id; these remain protected by RLS.
grant update(user_id,fighter_id) on public.comments to authenticated;
create or replace function public.character_standings()
returns table(fighter_id text, likes bigint, dislikes bigint, average numeric, rating_count bigint, star_sum bigint)
language sql stable security definer set search_path='' as $$
 select fighter_id,count(*) filter(where vote=1),count(*) filter(where vote=-1),
 round(avg(stars)::numeric,2),count(stars),coalesce(sum(stars),0)::bigint
 from public.evaluations group by fighter_id;
$$;
revoke all on function public.character_standings() from public;
grant execute on function public.character_standings() to anon,authenticated;
revoke all on function public.create_profile(),public.comment_timestamp() from public,anon,authenticated;
commit;
