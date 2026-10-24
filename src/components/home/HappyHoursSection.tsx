import { motion } from "framer-motion";
import { Clock, Phone, MessageCircle, Sparkles, Info } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { CONTACT_INFO } from "@/lib/constants";
import { useCampaign } from "@/hooks/useCampaigns";
import { getHappyHoursState, type HappyHoursState } from "@/lib/campaign";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import happyHoursImage from "@/assets/generated-hair-styling-luxury.jpg";

const stateCopy: Record<Exclude<HappyHoursState, "unpublished">, { label: string; tone: string; note: string }> = {
  not_started: {
    label: "Coming Soon",
    tone: "bg-primary/15 text-primary border-primary/40",
    note: "Happy Hours will begin on the announced start date.",
  },
  unconfigured: {
    label: "Announced",
    tone: "bg-primary/15 text-primary border-primary/40",
    note: "The daily two-hour window will be announced by the salon — please call to confirm.",
  },
  active: {
    label: "Live Now",
    tone: "bg-accent/20 text-accent-foreground border-accent/50",
    note: "Happy Hours are on right now! Call to confirm today's eligible services.",
  },
  closed_for_today: {
    label: "Opens Daily",
    tone: "bg-primary/15 text-primary border-primary/40",
    note: "Today's window has closed — call us to find out tomorrow's slot.",
  },
  ended: {
    label: "Concluded",
    tone: "bg-muted text-muted-foreground border-border",
    note: "This campaign has concluded. Contact the salon for current offers.",
  },
};

export const HappyHoursSection = () => {
  const { data, isLoading } = useCampaign("happy_hours");

  if (!isLoading && !data) return null;
  const { campaign, services } = data ?? { campaign: undefined, services: [] };
  if (!campaign) return null;

  const state = getHappyHoursState(campaign);
  const copy = stateCopy[state === "unpublished" ? "unconfigured" : state];
  const eligible = services ?? [];

  const enquiryMsg = encodeURIComponent(
    "Hello Attractive Beauty Parlour,\n\nI'd like to know which services are included in today's Happy Hours offer and the daily two-hour window.\n\nThank you."
  );

  return (
    <section id="happy-hours" className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Daily Happy Hours"
          title="Up to 50% OFF Selected Services"
          description="A special two-hour window, every day."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mt-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] border border-border/40">
              <img
                src={happyHoursImage}
                alt="Happy Hours at Attractive Beauty Parlour"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur border border-primary/40">
                <Clock size={14} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {campaign.daily_start_time && campaign.daily_end_time
                    ? `${campaign.daily_start_time.slice(0, 5)} – ${campaign.daily_end_time.slice(0, 5)} Daily`
                    : "2-Hour Window, Every Day"}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-5 ${copy.tone}`}>
              <Sparkles size={13} /> {copy.label}
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-foreground mb-4">
              {campaign.title} — <span className="text-gradient-gold">{campaign.subtitle}</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{campaign.description}</p>

            {eligible.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Selected services in the offer
                </p>
                <div className="flex flex-wrap gap-2">
                  {eligible.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50 text-xs text-foreground"
                    >
                      {s.display_name || s.name}
                      {s.discount_pct > 0 && (
                        <span className="text-primary font-semibold"> · {s.discount_pct}% off</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/50 mb-6">
              <Info size={15} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{copy.note}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={CONTACT_INFO.phoneLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:shadow-gold transition-all duration-300"
              >
                <Phone size={15} /> Call to Confirm
              </a>
              <a
                href={`${CONTACT_INFO.whatsappLink}?text=${enquiryMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/10 transition-all duration-300"
              >
                <MessageCircle size={15} /> WhatsApp Enquiry
              </a>
            </div>
          </motion.div>
        </div>

        {/* Terms */}
        <div className="max-w-3xl mx-auto mt-12">
          <Accordion type="single" collapsible>
            <AccordionItem value="terms" className="border-border/50">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-primary py-3">
                Happy Hours Terms &amp; Conditions
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {campaign.terms}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};
