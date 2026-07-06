// Relay: receives new query rows from the on_new_query DB trigger (via pg_net)
// and forwards them to the customer's external AI callback backend, adding
// a shared-secret header the backend can verify.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const targetUrl = Deno.env.get("CALLBACK_WEBHOOK_URL");
  const sharedSecret = Deno.env.get("WEBHOOK_SHARED_SECRET");

  if (!targetUrl) {
    console.warn("relay-callback: CALLBACK_WEBHOOK_URL not configured; skipping forward");
    // Return 200 so pg_net doesn't retry-storm; DB insert still succeeded.
    return new Response(JSON.stringify({ ok: true, forwarded: false, reason: "url_not_configured" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (sharedSecret) headers["X-Webhook-Secret"] = sharedSecret;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    // Do not leak upstream body to caller (which is Postgres/pg_net anyway).
    console.log(`relay-callback: forwarded, upstream status ${res.status}`);
    return new Response(JSON.stringify({ ok: true, forwarded: true, status: res.status }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("relay-callback: forward failed", e);
    return new Response(JSON.stringify({ ok: false, error: "forward_failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
