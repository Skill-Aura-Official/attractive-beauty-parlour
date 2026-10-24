import { motion } from "framer-motion";
import { Crown, Star, MessageCircle, Phone, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "../ui/section-heading";
import { CONTACT_INFO } from "@/lib/constants";
import { useKcPackages } from "@/hooks/useKcPackages";
import { formatINR } from "@/lib/campaign";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Tables } from "@/integrations/supabase/types";

type KcPackage = Tables<"kc_packages">;

const enquiryMessage = (pkg: KcPackage) =>
  encodeURIComponent(
    `Hello Attractive Beauty Parlour,\n\nI'm interested in the Karwa Chauth package "${pkg.display_name}" (${formatINR(pkg.price_inr)}).\n\nPlease share availability and the next steps.\n\nThank you.`
  );

const tierLabel: Record<string, string> = {
  basic: "Basic Beauty Care Package",
  premium: "Premium Beauty Care Package",
  luxury: "Luxury Beauty Care Package",
};

export const KarwaChauthSection = () => {
  const { data: packages, isLoading } = useKcPackages();
  const [termsOpen, setTermsOpen] = useState<string | undefined>(undefined);

  if (!isLoading && (!packages || packages.length === 0)) return null;

  const sharedTerms =
    packages?.[0]?.terms ||
    "Please contact the salon to confirm availability and clarify any package inclusions before arranging your visit.";

  return (
    <section id="karwa-chauth" className="section-padding bg-charcoal-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Karwa Chauth Special"
          title="Karwa Chauth Beauty Care Packages"
          description="Because Every Woman Deserves Her Time — curated one-day glow rituals for the festive season."
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-14 max-w-6xl mx-auto">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="h-[480px] rounded-2xl bg-muted/20 animate-pulse" />
              ))
            : packages?.map((pkg, index) => {
                const isPopular = pkg.tier === "premium";
                const inclusions = Array.isArray(pkg.inclusions) ? (pkg.inclusions as string[]) : [];
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className={`relative rounded-2xl border p-6 sm:p-7 flex flex-col ${
                      isPopular
                        ? "border-primary/60 bg-gradient-to-b from-primary/10 via-card to-card shadow-gold lg:-translate-y-3"
                        : "border-border/60 bg-card/90"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">
                        <Crown size={12} /> Popular Choice
                      </div>
                    )}

                    <p className="text-primary text-[11px] uppercase tracking-[0.25em] font-body">
                      {tierLabel[pkg.tier] ?? pkg.tier}
                    </p>
                    <h3 className="font-display text-2xl sm:text-[1.7rem] text-foreground mt-2">
                      {pkg.display_name}
                    </h3>
                    <p className="text-3xl sm:text-4xl font-display text-gradient-gold mt-3 mb-1 tabular-nums">
                      {formatINR(pkg.price_inr)}
                    </p>
                    {pkg.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mt-2 mb-5">
                        {pkg.description}
                      </p>
                    )}

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                          <Check size={15} className="text-primary shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-2.5 mt-auto">
                      <a
                        href={`${CONTACT_INFO.whatsappLink}?text=${enquiryMessage(pkg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:shadow-gold transition-all duration-300"
                      >
                        <MessageCircle size={15} /> Enquire on WhatsApp
                      </a>
                      <a
                        href={CONTACT_INFO.phoneLink}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-primary/40 text-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/10 transition-all duration-300"
                      >
                        <Phone size={14} /> Call to Enquire
                      </a>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {/* Terms */}
        <div className="max-w-3xl mx-auto mt-12">
          <Accordion type="single" collapsible value={termsOpen} onValueChange={setTermsOpen}>
            <AccordionItem value="terms" className="border-border/50">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-primary py-3">
                <span className="flex items-center gap-2">
                  <Star size={13} className="text-primary" /> Package Terms &amp; Conditions
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {sharedTerms}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="text-[11px] text-muted-foreground/70 mt-2 flex items-center gap-1.5">
            <ChevronDown size={12} />
            One-time packages, availed in a single day. Fixed prices.
          </p>
        </div>
      </div>
    </section>
  );
};
