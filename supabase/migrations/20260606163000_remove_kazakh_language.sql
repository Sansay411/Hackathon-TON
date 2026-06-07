do $$
begin
  if exists (select 1 from pg_type where typname = 'profile_language') then
    alter table public.profiles alter column language drop default;
    alter table public.profiles alter column language type text using language::text;

    update public.profiles
    set language = 'en'
    where language not in ('en', 'ru');

    drop type public.profile_language;
    create type public.profile_language as enum ('en', 'ru');

    alter table public.profiles
      alter column language type public.profile_language using language::public.profile_language,
      alter column language set default 'en',
      alter column language set not null;
  end if;
end $$;
