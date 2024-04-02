create table if not exists games (
    id uuid not null default uuid_generate_v4(),
    primary key (id),
    title text,
    purpose text,
    setup text[],
    rules text[],
    how_to_win text,
    how_to_play text,
    additional_info text,
    is_published boolean default false,
    created_by uuid,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    foreign key (created_by) references profiles(id) on delete cascade
);

alter table "public"."games" enable row level security;

create policy "public games are viewable by everyone who is logged in."
on "public"."games"
as permissive
for select
to public
using (auth.uid() is not null);

create policy "users can insert their own games."
on "public"."games"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "users can update own games."
on "public"."games"
as permissive
for update
to public
using ((auth.uid() = id));


