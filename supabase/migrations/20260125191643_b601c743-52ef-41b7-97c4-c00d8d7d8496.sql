-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_bridal BOOLEAN DEFAULT false,
  is_party BOOLEAN DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 5,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  category TEXT,
  author TEXT DEFAULT 'Attractive Beauty Parlour',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_settings table (single row for site-wide settings)
CREATE TABLE public.contact_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT,
  whatsapp_number TEXT,
  email TEXT,
  address TEXT,
  google_map_embed TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media table for media manager
CREATE TABLE public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies (for website visitors)
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view visible testimonials" ON public.testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view contact settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Public can view media" ON public.media FOR SELECT USING (true);

-- Admin policies (for authenticated admin users)
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage offers" ON public.offers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage contact settings" ON public.contact_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage media" ON public.media FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT USING (
  user_id = auth.uid()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_settings_updated_at BEFORE UPDATE ON public.contact_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default contact settings
INSERT INTO public.contact_settings (phone_number, whatsapp_number, email, address)
VALUES ('+91 98765 43210', '+91 98765 43210', 'hello@attractivebeautyparlour.com', '123 Beauty Lane, Fashion District, City - 400001');

-- Insert sample services
INSERT INTO public.services (name, category, description, display_order) VALUES
('Bridal Makeup', 'Makeup', 'Complete bridal makeup with HD finish for your special day', 1),
('Party Makeup', 'Makeup', 'Glamorous looks for parties and special occasions', 2),
('Hair Styling', 'Hair', 'Professional styling for all occasions', 3),
('Hair Coloring', 'Hair', 'Premium hair coloring with international products', 4),
('Facial Treatment', 'Skin', 'Rejuvenating facials for glowing skin', 5),
('Manicure & Pedicure', 'Nails', 'Luxurious nail care treatments', 6),
('Full Body Waxing', 'Waxing', 'Gentle and effective hair removal', 7),
('Kids Haircut', 'Haircut', 'Fun and friendly haircuts for children', 8);

-- Insert sample testimonials
INSERT INTO public.testimonials (client_name, review_text, rating) VALUES
('Priya Sharma', 'Absolutely loved my bridal makeup! The team made me feel like a queen on my special day.', 5),
('Anita Reddy', 'Best salon in the city! The ambiance is so luxurious and the staff is incredibly skilled.', 5),
('Meera Patel', 'My daughter loves coming here for her haircuts. They are so patient with kids!', 5);

-- Insert sample offers
INSERT INTO public.offers (title, description, is_bridal) VALUES
('Bridal Bliss Package', 'Complete bridal makeover including pre-bridal treatments, makeup, and styling', true),
('Party Ready Package', 'Makeup, hair styling, and manicure combo for special occasions', false);