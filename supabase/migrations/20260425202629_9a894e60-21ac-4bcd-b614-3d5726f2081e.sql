CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT gallery_items_media_type_check CHECK (media_type IN ('image', 'video')),
  CONSTRAINT gallery_items_file_size_check CHECK (file_size IS NULL OR file_size <= 10485760)
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible gallery items"
ON public.gallery_items
FOR SELECT
TO anon, authenticated
USING (is_visible = true);

CREATE POLICY "Admin manage gallery items"
ON public.gallery_items
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

CREATE TRIGGER update_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_gallery_items_visible_order ON public.gallery_items (is_visible, display_order, created_at DESC);