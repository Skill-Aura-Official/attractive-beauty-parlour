import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_BODY_BYTES = 4 * 1024;
const RATE_LIMIT = 5; // 5 leads / minute / IP
const RATE_WINDOW_MS = 60_000;
const ipHits = new Map<string, number[]>();

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (ipHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  ipHits.set(ip, arr);
  return arr.length > RATE_LIMIT;
}

const j = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ip = getIp(req);
    if (rateLimited(ip)) return j(429, { error: "Too many requests. Please try again later." });

    const cl = Number(req.headers.get("content-length") || "0");
    if (cl && cl > MAX_BODY_BYTES) return j(413, { error: "Payload too large" });
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return j(413, { error: "Payload too large" });

    let body: any;
    try { body = JSON.parse(raw); } catch { return j(400, { error: "Invalid JSON" }); }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const preferred_service = typeof body?.preferred_service === "string"
      ? body.preferred_service.trim().slice(0, 200) : null;
    const notes = typeof body?.notes === "string" ? body.notes.trim().slice(0, 1000) : null;
    const honeypot = typeof body?.website === "string" ? body.website : "";

    if (honeypot) return j(200, { success: true }); // silently drop bots

    if (!name || name.length < 2 || name.length > 100) {
      return j(400, { error: "Name must be 2-100 characters" });
    }
    // Basic phone validation: 7-20 chars, digits/spaces/+-() only
    if (!phone || !/^[0-9+\-()\s]{7,20}$/.test(phone)) {
      return j(400, { error: "Valid phone is required" });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("chatbot_leads").insert({
      name, phone, preferred_service, notes,
    });

    if (error) {
      console.error("Insert error:", error);
      return j(500, { error: "Failed to save lead" });
    }

    return j(200, { success: true });
  } catch (e) {
    console.error("save-lead error:", e);
    return j(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
