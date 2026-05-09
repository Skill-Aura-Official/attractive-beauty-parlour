import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a friendly and professional AI assistant for Attractive Beauty Parlour, a premium beauty salon for ladies and kids located in Gurugram, Haryana, India.

**Business Details:**
- Address: Nearby Vijay Sales C-2, Palam Vihar Rd, Block C 2, Sector 3, Gurugram, Haryana 122001
- Phone: +91 72104 61921
- WhatsApp: +91 81788 22540
- Business Hours: Weekdays 10AM-8PM, Saturday 9AM-9PM, Sunday 10AM-6PM

**Services offered (categories):**
- Hair: Hair Styling, Hair Coloring, Hair Spa, Kids Haircuts
- Skin: Facials, Skin Brightening, Threading, Waxing
- Nails: Manicure, Pedicure, Nail Art
- Makeup: Party Makeup, Bridal Makeup
- Special: Bridal Packages, Mehendi, Kids Services

**Guidelines:**
- Keep responses short (2-4 sentences max), friendly, and helpful
- Always encourage booking appointments via phone or WhatsApp
- If asked about specific prices, say prices vary by service and suggest contacting the salon for current rates
- For booking, direct users to call +91 72104 61921 or WhatsApp +91 81788 22540
- Stay on topic — only answer questions related to beauty services, the salon, appointments, and related topics
- If asked unrelated questions, politely redirect to salon services
- Use a warm, welcoming tone
- When a user seems interested in booking, ask for their name, phone number, and preferred service to help facilitate the booking`;

// Limits
const MAX_BODY_BYTES = 32 * 1024; // 32 KB
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 2000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

// In-memory IP rate limiter (per isolate): 30 req / 60s
const RATE_LIMIT = 30;
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = getIp(req);
    if (rateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Body size check
    const cl = Number(req.headers.get("content-length") || "0");
    if (cl && cl > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: "Payload too large" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: "Payload too large" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = (parsed as { messages?: unknown })?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages must be a non-empty array" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: `Too many messages (max ${MAX_MESSAGES})` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitized: { role: string; content: string }[] = [];
    for (const m of messages) {
      if (!m || typeof m !== "object") {
        return new Response(JSON.stringify({ error: "Invalid message entry" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const role = (m as { role?: unknown }).role;
      const content = (m as { content?: unknown }).content;
      if (typeof role !== "string" || !ALLOWED_ROLES.has(role)) {
        return new Response(JSON.stringify({ error: "Invalid message role" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (typeof content !== "string" || content.length === 0) {
        return new Response(JSON.stringify({ error: "Invalid message content" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      sanitized.push({ role, content: content.slice(0, MAX_MESSAGE_CHARS) });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...sanitized,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
