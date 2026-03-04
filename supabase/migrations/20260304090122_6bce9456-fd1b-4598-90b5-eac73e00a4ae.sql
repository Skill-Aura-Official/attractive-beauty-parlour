
-- Fix all RLS policies: drop RESTRICTIVE and recreate as PERMISSIVE

-- SERVICES
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- OFFERS
DROP POLICY IF EXISTS "Public can view active offers" ON public.offers;
DROP POLICY IF EXISTS "Admins can manage offers" ON public.offers;
CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage offers" ON public.offers FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- TESTIMONIALS
DROP POLICY IF EXISTS "Public can view visible testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Public can view visible testimonials" ON public.testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- BLOG POSTS
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- CONTACT SETTINGS
DROP POLICY IF EXISTS "Public can view contact settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Admins can manage contact settings" ON public.contact_settings;
CREATE POLICY "Public can view contact settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage contact settings" ON public.contact_settings FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- MEDIA
DROP POLICY IF EXISTS "Public can view media" ON public.media;
DROP POLICY IF EXISTS "Admins can manage media" ON public.media;
CREATE POLICY "Public can view media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Admins can manage media" ON public.media FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- ADMIN USERS
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view own record" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ============================================
-- NEW TABLES: hero_slides, faq_items, page_sections
-- ============================================

-- HERO SLIDES
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  highlight TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active hero slides" ON public.hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage hero slides" ON public.hero_slides FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- FAQ ITEMS
CREATE TABLE public.faq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'General',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible faq items" ON public.faq_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage faq items" ON public.faq_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- PAGE SECTIONS (for About page, etc.)
CREATE TABLE public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL DEFAULT 'about',
  section_key TEXT NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible page sections" ON public.page_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage page sections" ON public.page_sections FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- Add updated_at triggers for new tables
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
CREATE POLICY "Public can view media files" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
CREATE POLICY "Admins can delete media files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));
