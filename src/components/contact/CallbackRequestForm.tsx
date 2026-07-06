import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, PhoneCall } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Please enter your name (min 2 characters)")
    .max(100, "Name is too long"),
  // Indian mobile: optional +91 or 0 prefix, then 10 digits starting 6-9
  customer_phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+91[\s-]?|0)?[6-9]\d{9}$/,
      "Enter a valid 10-digit Indian mobile (optionally with +91)"
    ),
  query_text: z
    .string()
    .trim()
    .min(3, "Please describe what you'd like a call about")
    .max(2000, "Message is too long"),
});

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  // Strip leading 91 (with +) or leading 0, keep last 10 digits.
  const last10 = digits.slice(-10);
  return `+91${last10}`;
}

export const CallbackRequestForm = () => {
  const { toast } = useToast();
  const [values, setValues] = useState({ customer_name: "", customer_phone: "", query_text: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("queries").insert({
        customer_name: parsed.data.customer_name,
        customer_phone: normalizePhone(parsed.data.customer_phone),
        query_text: parsed.data.query_text,
      });
      if (error) throw error;

      setDone(true);
      setValues({ customer_name: "", customer_phone: "", query_text: "" });
      toast({
        title: "Request received",
        description: "Our team will call you back shortly.",
      });
    } catch (err) {
      console.error("callback request failed", err);
      toast({
        title: "Couldn't submit request",
        description: "Please try again or reach us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="luxury-card space-y-5"
      noValidate
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          <PhoneCall size={20} />
        </div>
        <div>
          <h3 className="font-display text-xl text-foreground">Request a Callback</h3>
          <p className="text-muted-foreground text-sm">Leave your number — we'll call you back.</p>
        </div>
      </div>

      <div>
        <label htmlFor="cb-name" className="block text-sm text-foreground mb-1.5">
          Name <span className="text-primary">*</span>
        </label>
        <input
          id="cb-name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          value={values.customer_name}
          onChange={onChange("customer_name")}
          className="w-full px-4 py-2.5 rounded-md bg-background border border-border/50 text-foreground focus:outline-none focus:border-primary/60 transition-colors"
          placeholder="Your full name"
        />
        {errors.customer_name && <p className="text-destructive text-xs mt-1">{errors.customer_name}</p>}
      </div>

      <div>
        <label htmlFor="cb-phone" className="block text-sm text-foreground mb-1.5">
          Mobile number <span className="text-primary">*</span>
        </label>
        <input
          id="cb-phone"
          type="tel"
          required
          inputMode="tel"
          maxLength={15}
          autoComplete="tel"
          value={values.customer_phone}
          onChange={onChange("customer_phone")}
          className="w-full px-4 py-2.5 rounded-md bg-background border border-border/50 text-foreground focus:outline-none focus:border-primary/60 transition-colors"
          placeholder="+91 98765 43210"
        />
        {errors.customer_phone && <p className="text-destructive text-xs mt-1">{errors.customer_phone}</p>}
      </div>

      <div>
        <label htmlFor="cb-msg" className="block text-sm text-foreground mb-1.5">
          What can we help with? <span className="text-primary">*</span>
        </label>
        <textarea
          id="cb-msg"
          required
          rows={4}
          maxLength={2000}
          value={values.query_text}
          onChange={onChange("query_text")}
          className="w-full px-4 py-2.5 rounded-md bg-background border border-border/50 text-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
          placeholder="Tell us briefly what service or question you'd like a call about."
        />
        {errors.query_text && <p className="text-destructive text-xs mt-1">{errors.query_text}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:shadow-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <PhoneCall size={16} />}
        {submitting ? "Sending…" : "Request Callback"}
      </button>

      {done && (
        <p className="text-primary text-sm text-center">
          Thanks! We've received your request and will call you back soon.
        </p>
      )}
    </motion.form>
  );
};
