-- 1. Create function to handle new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public."profiles" (id, user_id, full_name, avatar_url, role, created_at, updated_at)
  values (
    new.id, 
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    'user',
    now(),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Bind trigger to auth.users
-- Drop if exists to avoid errors on repeated runs
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
