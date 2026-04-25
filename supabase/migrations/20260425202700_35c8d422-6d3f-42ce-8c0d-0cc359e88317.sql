DROP POLICY IF EXISTS "Public can view media files" ON storage.objects;
DROP POLICY IF EXISTS "Public read media files" ON storage.objects;

CREATE POLICY "Public can view media by url"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media' AND owner IS NULL);

CREATE POLICY "Authenticated admins can view media files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid())
);