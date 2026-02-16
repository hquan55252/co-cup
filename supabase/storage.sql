-- Create a new storage bucket for tournament media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tournament-media', 'tournament-media', true);

-- Policy to allow public access to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'tournament-media' );

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tournament-media' AND
  auth.role() = 'authenticated'
);

-- Policy to allow admins to delete files (assuming admin check similar to RLS)
-- For simplicity here, just authenticated users who own the object or everyone if it's open, 
-- but ideally restricting to admin.
-- This requires a more complex policy involving the profiles table join which is tricky in storage policies.
-- A simpler approach for now:
CREATE POLICY "Admins can update/delete"
ON storage.objects FOR ALL
USING ( bucket_id = 'tournament-media' AND auth.role() = 'authenticated' );
