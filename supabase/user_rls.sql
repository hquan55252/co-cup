-- Enable RLS on tournaments table
alter table "tournaments" enable row level security;

-- 1. Allow authenticated users to create tournaments
create policy "Authenticated users can create tournaments"
on "tournaments" for insert
to authenticated
with check (
  auth.uid()::text = creator_id
);

-- 2. Allow creators to update their own tournaments
create policy "Creators can update their own tournaments"
on "tournaments" for update
using (
  auth.uid()::text = creator_id
);

-- 3. Allow creators to delete their own tournaments
create policy "Creators can delete their own tournaments"
on "tournaments" for delete
using (
  auth.uid()::text = creator_id
);

-- 4. Allow everyone to read confirmed/active tournaments (Public Access)
create policy "Public can view tournaments"
on "tournaments" for select
using (true);
