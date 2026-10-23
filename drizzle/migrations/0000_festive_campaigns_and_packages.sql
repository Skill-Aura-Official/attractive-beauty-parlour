-- ============ 1. Services: new editable fields ============
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS price numeric(10,2),
  ADD COLUMN IF NOT EXISTS duration text,
  ADD COLUMN IF NOT EXISTS detailed_description text,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.services.display_name IS 'Customer-facing premium display name; falls back to name when empty';
COMMENT ON COLUMN public.services.price IS 'Optional price in INR configured by the salon';

-- ============ 2. Service category display metadata ============
CREATE TABLE public.service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ 3. Karwa Chauth packages ============
CREATE TABLE public.kc_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL CHECK (tier IN ('basic','premium','luxury')),
  display_name text NOT NULL,
  price_inr numeric(10,2) NOT NULL,
  inclusions jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text,
  terms text,
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tier)
);

-- ============ 4. Campaigns (Happy Hours / Facial Offers) ============
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_key text NOT NULL UNIQUE CHECK (campaign_key IN ('happy_hours','facial_offer')),
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text,
  start_date date,
  end_date date,
  daily_start_time time,
  daily_end_time time,
  cta_text text,
  terms text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ 5. Eligible services per campaign ============
CREATE TABLE public.campaign_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  discount_pct integer NOT NULL DEFAULT 0 CHECK (discount_pct >= 0 AND discount_pct <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, service_id)
);

-- ============ Validation triggers ============
CREATE OR REPLACE FUNCTION public.validate_campaign_discount()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  ckey text;
  max_pct integer;
BEGIN
  SELECT campaign_key INTO ckey FROM public.campaigns WHERE id = NEW.campaign_id;
  IF ckey = 'happy_hours' THEN
    max_pct := 50;
  ELSIF ckey = 'facial_offer' THEN
    max_pct := 30;
  ELSE
    max_pct := 100;
  END IF;
  IF NEW.discount_pct > max_pct THEN
    RAISE EXCEPTION 'Discount percent exceeds the maximum of % allowed for this campaign', max_pct;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_validate_campaign_discount
BEFORE INSERT OR UPDATE ON public.campaign_services
FOR EACH ROW EXECUTE FUNCTION public.validate_campaign_discount();

CREATE OR REPLACE FUNCTION public.validate_campaign_window()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.campaign_key = 'happy_hours' AND NEW.daily_start_time IS NOT NULL AND NEW.daily_end_time IS NOT NULL THEN
    IF (NEW.daily_end_time - NEW.daily_start_time) <> interval '2 hours' THEN
      RAISE EXCEPTION 'Happy Hours daily window must be exactly two hours';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_validate_campaign_window
BEFORE INSERT OR UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.validate_campaign_window();

-- ============ Grants (Data API access) ============
GRANT SELECT ON public.service_categories TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_categories TO authenticated;
GRANT ALL ON public.service_categories TO service_role;

GRANT SELECT ON public.kc_packages TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kc_packages TO authenticated;
GRANT ALL ON public.kc_packages TO service_role;

GRANT SELECT ON public.campaigns TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;

GRANT SELECT ON public.campaign_services TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_services TO authenticated;
GRANT ALL ON public.campaign_services TO service_role;

-- ============ RLS ============
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kc_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read service categories" ON public.service_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage service categories" ON public.service_categories
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Public read published packages" ON public.kc_packages
  FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admin manage kc packages" ON public.kc_packages
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Public read published campaigns" ON public.campaigns
  FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admin manage campaigns" ON public.campaigns
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Public read services of published campaigns" ON public.campaign_services
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.is_published = true));
CREATE POLICY "Admin manage campaign services" ON public.campaign_services
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

-- ============ updated_at triggers ============
CREATE TRIGGER set_updated_at_service_categories BEFORE UPDATE ON public.service_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_kc_packages BEFORE UPDATE ON public.kc_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_campaigns BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Seed: service categories ============
INSERT INTO public.service_categories (category_key, display_name, description, display_order) VALUES
  ('Makeup', 'Aura Glam Makeup', 'Party and bridal artistry for a flawless, luminous finish.', 1),
  ('Hair', 'Crown & Silk Hair Rituals', 'Coloring, styling and deep-nourishing spa treatments.', 2),
  ('Skin', 'Radiance Skin Rituals', 'Facials, brightening and glow-boosting skin care.', 3),
  ('Nails', 'The Polished Atelier', 'Manicures, pedicures and nail art, finished to perfection.', 4),
  ('Waxing', 'Silken Touch', 'Gentle, thorough waxing for silky-smooth skin.', 5),
  ('Haircut', 'Signature Cuts', 'Precision cuts for ladies and little stars.', 6),
  ('Styling', 'The Finishing Touch', 'Blowouts, styling and finishing for every occasion.', 7),
  ('Kids', 'Little Stars for Kids', 'Gentle, fun salon care designed for children.', 8)
ON CONFLICT (category_key) DO NOTHING;

-- ============ Seed: Karwa Chauth packages (exact approved prices) ============
INSERT INTO public.kc_packages (tier, display_name, price_inr, inclusions, description, terms, display_order) VALUES
  ('basic', 'The Essential Glow', 2499,
    '["Eyebrows","Upper lips","Wax","Facial","Haircut / Head Massage"]'::jsonb,
    'A refreshing single-day glow-up covering the essentials — perfect to look and feel festive-ready.',
    'Each package is a one-time service package intended to be availed in a single day. The package price is fixed and non-negotiable. Included services cannot be distributed across multiple days. The campaign is intended for the ladies and kids audience of Attractive Beauty Parlour, subject to the suitability of individual services. Please contact the salon to confirm availability and clarify any package inclusions before arranging your visit.',
    1),
  ('premium', 'The Signature Glow', 3999,
    '["Eyebrows","Upper lips","Wax","Facial","Manicure","Pedicure","Haircut / Head Massage"]'::jsonb,
    'Our most-loved festive ritual — complete grooming from head to toe for your special day.',
    'Each package is a one-time service package intended to be availed in a single day. The package price is fixed and non-negotiable. Included services cannot be distributed across multiple days. The campaign is intended for the ladies and kids audience of Attractive Beauty Parlour, subject to the suitability of individual services. Please contact the salon to confirm availability and clarify any package inclusions before arranging your visit.',
    2),
  ('luxury', 'The Luxe Glow', 5999,
    '["Eyebrows","Upper lips","Wax","Facial","Manicure","Pedicure","Haircut / Head Massage","Body Massage / Hair Spa"]'::jsonb,
    'The full luxury experience — every indulgence, meticulously delivered for Karwa Chauth.',
    'Each package is a one-time service package intended to be availed in a single day. The package price is fixed and non-negotiable. Included services cannot be distributed across multiple days. The campaign is intended for the ladies and kids audience of Attractive Beauty Parlour, subject to the suitability of individual services. Please contact the salon to confirm availability and clarify any package inclusions before arranging your visit.',
    3)
ON CONFLICT (tier) DO NOTHING;

-- ============ Seed: campaigns ============
INSERT INTO public.campaigns (campaign_key, title, subtitle, description, start_date, cta_text, terms) VALUES
  ('happy_hours',
   'Daily Happy Hours',
   'Up to 50% OFF Selected Services',
   'A special two-hour window, every day. Enjoy special savings on selected beauty services during our daily Happy Hours. Discounts of up to 50% are available on eligible services only. Call our team to find out which services are included today.',
   '2026-10-29',
   'Call to Confirm Today''s Window',
   '1. The campaign begins on the date configured by the salon (currently 29 October 2026; the salon may change it through its dashboard).
2. Happy Hours are available during a designated two-hour window each day.
3. The precise time window is determined and maintained by the salon.
4. Discounts of up to 50% are available on selected services only; all services are not covered by this promotion.
5. Customers must call the salon team to confirm which services currently qualify.
6. The actual discount for each eligible service is configured by the salon.
7. The offer is subject to service availability and the salon''s confirmation.
8. The offer cannot be combined with another discount or package promotion unless explicitly enabled by the salon.')
ON CONFLICT (campaign_key) DO NOTHING;

INSERT INTO public.campaigns (campaign_key, title, subtitle, description, cta_text, terms) VALUES
  ('facial_offer',
   'Glow More, Spend Less',
   'Up to 30% OFF on Selected Facials',
   'Radiance Facial Offers — enjoy up to 30% off on selected facials. Only the facials chosen by the salon are part of this offer; please enquire for the current selection.',
   'Enquire on WhatsApp',
   '1. A maximum discount of 30% is permitted under this offer.
2. The offer applies only to selected facial services chosen by the salon; it does not automatically apply to all facials or every skin service.
3. The offer does not apply to Karwa Chauth packages unless explicitly enabled by the salon.
4. Discounted services and their individual percentages are configured by the salon and may change.
5. The offer is subject to service availability and the salon''s confirmation and cannot be combined with other promotions unless explicitly enabled.')
ON CONFLICT (campaign_key) DO NOTHING;