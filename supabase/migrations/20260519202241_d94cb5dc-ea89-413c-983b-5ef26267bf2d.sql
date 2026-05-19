-- admin_users: explicit deny for client-side mutations
CREATE POLICY "Deny client inserts to admin_users"
ON public.admin_users FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny client updates to admin_users"
ON public.admin_users FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny client deletes from admin_users"
ON public.admin_users FOR DELETE TO anon, authenticated
USING (false);

-- chatbot_leads: explicit deny for anon and non-admin authenticated clients
-- (admin ALL policy already grants admins full access; save-lead edge function uses service role and bypasses RLS)
CREATE POLICY "Deny anon select on chatbot_leads"
ON public.chatbot_leads FOR SELECT TO anon
USING (false);

CREATE POLICY "Deny anon insert on chatbot_leads"
ON public.chatbot_leads FOR INSERT TO anon
WITH CHECK (false);

CREATE POLICY "Deny authenticated non-admin insert on chatbot_leads"
ON public.chatbot_leads FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
