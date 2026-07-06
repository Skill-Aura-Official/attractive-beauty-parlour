
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE TABLE public.queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  query_text text NOT NULL,
  status text NOT NULL DEFAULT 'pending_call',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.queries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.queries TO authenticated;
GRANT ALL ON public.queries TO service_role;

ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a callback request"
ON public.queries FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(customer_name) BETWEEN 2 AND 100
  AND length(customer_phone) BETWEEN 10 AND 15
  AND length(query_text) BETWEEN 3 AND 2000
);

CREATE POLICY "Admins can view queries"
ON public.queries FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update queries"
ON public.queries FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete queries"
ON public.queries FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Block anon from reading/updating/deleting explicitly
CREATE POLICY "Deny anon select" ON public.queries FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon update" ON public.queries FOR UPDATE TO anon USING (false) WITH CHECK (false);
CREATE POLICY "Deny anon delete" ON public.queries FOR DELETE TO anon USING (false);

-- Trigger: on insert, POST full row to the relay edge function via pg_net.
-- The edge function reads CALLBACK_WEBHOOK_URL and WEBHOOK_SHARED_SECRET
-- from env and forwards the payload to the customer's external backend.
CREATE OR REPLACE FUNCTION public.notify_new_query()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  edge_url text := 'https://wvlnkgvdfgpsazahxhld.supabase.co/functions/v1/relay-callback';
BEGIN
  PERFORM extensions.http_post(
    url := edge_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'id', NEW.id,
      'customer_name', NEW.customer_name,
      'customer_phone', NEW.customer_phone,
      'query_text', NEW.query_text,
      'status', NEW.status,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_new_query failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- pg_net exposes http_post under schema `net`; alias via extensions if needed
CREATE OR REPLACE FUNCTION public.notify_new_query()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, net
AS $$
DECLARE
  edge_url text := 'https://wvlnkgvdfgpsazahxhld.supabase.co/functions/v1/relay-callback';
BEGIN
  PERFORM net.http_post(
    url := edge_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'id', NEW.id,
      'customer_name', NEW.customer_name,
      'customer_phone', NEW.customer_phone,
      'query_text', NEW.query_text,
      'status', NEW.status,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_new_query failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_query
AFTER INSERT ON public.queries
FOR EACH ROW EXECUTE FUNCTION public.notify_new_query();
