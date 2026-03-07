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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
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
            ...messages,
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
