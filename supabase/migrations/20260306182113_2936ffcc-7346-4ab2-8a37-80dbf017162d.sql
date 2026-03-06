
-- ============================================
-- STEP 1: Drop ALL existing RESTRICTIVE policies
-- ============================================

-- services
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;

-- offers
DROP POLICY IF EXISTS "Admins can manage offers" ON public.offers;
DROP POLICY IF EXISTS "Public can view active offers" ON public.offers;

-- testimonials
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public can view visible testimonials" ON public.testimonials;

-- blog_posts
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;

-- contact_settings
DROP POLICY IF EXISTS "Admins can manage contact settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Public can view contact settings" ON public.contact_settings;

-- media
DROP POLICY IF EXISTS "Admins can manage media" ON public.media;
DROP POLICY IF EXISTS "Public can view media" ON public.media;

-- admin_users
DROP POLICY IF EXISTS "Admins can view own record" ON public.admin_users;

-- hero_slides
DROP POLICY IF EXISTS "Admins can manage hero slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public can view active hero slides" ON public.hero_slides;

-- faq_items
DROP POLICY IF EXISTS "Admins can manage faq items" ON public.faq_items;
DROP POLICY IF EXISTS "Public can view visible faq items" ON public.faq_items;

-- page_sections
DROP POLICY IF EXISTS "Admins can manage page sections" ON public.page_sections;
DROP POLICY IF EXISTS "Public can view visible page sections" ON public.page_sections;

-- ============================================
-- STEP 2: Recreate ALL policies as PERMISSIVE
-- ============================================

-- services
CREATE POLICY "Public read active services" ON public.services AS PERMISSIVE FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin manage services" ON public.services AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- offers
CREATE POLICY "Public read active offers" ON public.offers AS PERMISSIVE FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin manage offers" ON public.offers AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- testimonials
CREATE POLICY "Public read visible testimonials" ON public.testimonials AS PERMISSIVE FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "Admin manage testimonials" ON public.testimonials AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- blog_posts
CREATE POLICY "Public read published posts" ON public.blog_posts AS PERMISSIVE FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admin manage blog posts" ON public.blog_posts AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- contact_settings
CREATE POLICY "Public read contact settings" ON public.contact_settings AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage contact settings" ON public.contact_settings AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- media
CREATE POLICY "Public read media" ON public.media AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage media" ON public.media AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- admin_users
CREATE POLICY "Admin read own record" ON public.admin_users AS PERMISSIVE FOR SELECT TO authenticated USING (user_id = auth.uid());

-- hero_slides
CREATE POLICY "Public read active hero slides" ON public.hero_slides AS PERMISSIVE FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin manage hero slides" ON public.hero_slides AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- faq_items
CREATE POLICY "Public read visible faq items" ON public.faq_items AS PERMISSIVE FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "Admin manage faq items" ON public.faq_items AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- page_sections
CREATE POLICY "Public read visible page sections" ON public.page_sections AS PERMISSIVE FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "Admin manage page sections" ON public.page_sections AS PERMISSIVE FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- ============================================
-- STEP 3: Storage policies for media bucket
-- ============================================
DROP POLICY IF EXISTS "Public read media files" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Admin update media files" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media files" ON storage.objects;

CREATE POLICY "Public read media files" ON storage.objects AS PERMISSIVE FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
CREATE POLICY "Admin upload media files" ON storage.objects AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));
CREATE POLICY "Admin update media files" ON storage.objects AS PERMISSIVE FOR UPDATE TO authenticated USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));
CREATE POLICY "Admin delete media files" ON storage.objects AS PERMISSIVE FOR DELETE TO authenticated USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

-- ============================================
-- STEP 4: Add missing updated_at triggers
-- ============================================
CREATE OR REPLACE TRIGGER trigger_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_contact_settings_updated_at BEFORE UPDATE ON public.contact_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER trigger_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
