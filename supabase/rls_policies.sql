-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Profiles: 
-- Everyone can read profiles (or just basic info, but for simplicity public read)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
-- Users can insert their own profile (usually handled by trigger on auth.users, but good to have)
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- Users can update own profile
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid()::text = user_id);

-- Tournaments:
-- Public Read
CREATE POLICY "Tournaments are viewable by everyone" ON tournaments FOR SELECT USING (true);
-- Admin Full Access (Insert/Update/Delete)
-- Assuming 'admin' check is done via a claim or looking up the profile table. 
-- For simplicity, using a subquery to check role in profiles table.
CREATE POLICY "Admins can insert tournaments" ON tournaments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admins can update tournaments" ON tournaments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admins can delete tournaments" ON tournaments FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);

-- Registrations:
-- Public Read (to see who is playing)
CREATE POLICY "Registrations are viewable by everyone" ON registrations FOR SELECT USING (true);
-- Auth Insert (Users can register themselves)
CREATE POLICY "Users can register themselves" ON registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- Admin Update (Approve/Reject)
CREATE POLICY "Admins can update registrations" ON registrations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);

-- Matches:
-- Public Read
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);
-- Admin Full Access (Update scores, etc.)
CREATE POLICY "Admins can insert matches" ON matches FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admins can update matches" ON matches FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admins can delete matches" ON matches FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);

-- Media:
-- Public Read
CREATE POLICY "Media is viewable by everyone" ON media FOR SELECT USING (true);
-- Admin Full Access (Upload/Delete)
CREATE POLICY "Admins can insert media" ON media FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);
CREATE POLICY "Admins can delete media" ON media FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid()::text AND role = 'admin')
);
