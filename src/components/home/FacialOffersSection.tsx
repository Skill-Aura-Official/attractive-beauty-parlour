import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Phone, BadgePercent } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { CONTACT_INFO } from "@/lib/constants";
import { useCampaign } from "@/hooks/useCampaigns";
import { formatINR, discountedPrice } from "@/lib/campaign";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import facialImage from "@/assets/generated-skincare-room.jpg";

export const FacialOffersSection = () => {
  const { data, isLoading } = useCampaign("facial_offer");

  if (!isLoading && !data) return null;
  const { campaign, services } = data ?? { campaign: undefined, services: [] };
  if (!campaign) return null;

  const eligible = services ?? [];
  const maxDiscount = eligible.reduce((m, s) => Math.max(m, s.discount_pct), 0);

  return (
    <section id="facial-offers" className="section-padding bg-charcoal-light relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Radiance Facial Offers"
          title="Glow More, Spend Less"
          description={
            campaign.description ??
            "Up to 30% OFF on selected facials — chosen by the salon for radiant, festive-ready skin."
          }
        />

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] border border-border/40"
          >
            <img
              src={facialImage}
              alt="Radiance facial offer at Attractive Beauty Parlour"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest">
                <BadgePercent size={14} />
                Up to {maxDiscount || 30}% OFF
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {eligible.length === 0 ? (
              <div className="p-6 rounded-2xl border border-border/50 bg-card/70">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The salon is finalising the selection of discounted facials. Please call or WhatsApp
                  us to hear the current selection and pricing — we'll gladly guide you.
                </p>
              </div>
            ) : (
              eligible.map((s, i) => {
                const promo = discountedPrice(s.price, s.discount_pct);
                const hasPrice = s.price != null && Number(s.price) > 0;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="luxury-card p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-widest mb-2">
                          Selected Facial Offer
                        </span>
                        <h3 className="font-display text-xl text-foreground">
                          {s.display_name || s.name}
                        </h3>
                        {s.description && (
                          <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed line-clamp-2">
                            {s.description}
                          </p>
                        )}
                        {s.duration && (
                          <p className="text-xs text-muted-foreground/80 mt-1.5">{s.duration}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {s.discount_pct > 0 && (
                          <span className="block text-2xl font-display text-gradient-gold tabular-nums">
                            {s.discount_pct}% off
                          </span>
                        )}
                        {hasPrice && (
                          <p className="text-sm mt-1">
                            {promo != null && s.discount_pct > 0 && (
                              <span className="line-through text-muted-foreground/70 mr-2 tabular-nums">
                                {formatINR(s.price)}
                              </span>
                            )}
                            <span className="text-foreground font-semibold tabular-nums">
                              {formatINR(promo ?? s.price)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2.5 mt-4">
                      <a
                        href={`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(
                          `Hello Attractive Beauty Parlour,\n\nI'd like to enquire about the "${s.display_name || s.name}" facial${s.discount_pct > 0 ? ` (${s.discount_pct}% off)` : ""}.\n\nThank you.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold uppercase tracking-wider hover:shadow-gold transition-all"
                      >
                        <MessageCircle size={13} /> Enquire
                      </a>
                      <a
                        href={CONTACT_INFO.phoneLink}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-foreground text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all"
                      >
                        <Phone size={13} /> Call
                      </a>
                    </div>
                  </motion.div>
                );
              })
            )}

            <div className="pt-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="terms" className="border-border/50">
                  <AccordionTrigger className="text-sm text-muted-foreground hover:text-primary py-3">
                    Facial Offer Terms &amp; Conditions
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {campaign.terms}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
