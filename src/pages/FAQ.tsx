import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const staticFaqs = [
  { category: "General", questions: [
    { q: "What are your working hours?", a: `We are open Monday to Saturday from ${CONTACT_INFO.businessHours.weekdays} and Sunday from ${CONTACT_INFO.businessHours.sunday}.` },
    { q: "Do I need to book an appointment?", a: "Walk-ins are welcome, but we recommend booking for bridal and party services." },
    { q: "Where are you located?", a: `We are located at ${CONTACT_INFO.address}.` },
    { q: "Do you offer home services?", a: "Yes, for bridal and party makeup. Additional charges may apply." },
  ]},
  { category: "Services", questions: [
    { q: "What services do you offer?", a: "Makeup (bridal, party), hair services, skincare, nail care, waxing, threading, and kids' services." },
    { q: "Do you offer bridal packages?", a: "Yes! Our Bridal Bliss Package includes pre-bridal treatments, makeup trial, D-day makeup and styling." },
  ]},
  { category: "Booking & Payment", questions: [
    { q: "How do I book an appointment?", a: "Call us or send a WhatsApp message. Online booking coming soon!" },
    { q: "What payment methods do you accept?", a: "Cash, debit/credit cards, UPI (GPay, PhonePe, Paytm), and bank transfers." },
  ]},
];

const FAQ = () => {
  const { data: dbFaqs } = useQuery({
    queryKey: ["faq-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faq_items").select("*").eq("is_visible", true).order("category").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  // Group DB FAQs by category, or fall back to static
  const faqs = dbFaqs && dbFaqs.length > 0
    ? Object.entries(
        dbFaqs.reduce((acc, f) => {
          if (!acc[f.category]) acc[f.category] = [];
          acc[f.category].push({ q: f.question, a: f.answer });
          return acc;
        }, {} as Record<string, { q: string; a: string }[]>)
      ).map(([category, questions]) => ({ category, questions }))
    : staticFaqs;

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-gradient-to-b from-charcoal-dark to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">Help Center</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services, booking, and policies
          </motion.p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.map((section, sectionIndex) => (
            <motion.div key={section.category} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: sectionIndex * 0.1 }} className="mb-12">
              <h2 className="font-display text-2xl text-foreground mb-6 pb-4 border-b border-border/30">{section.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {section.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`${section.category}-${index}`} className="luxury-card border-none">
                    <AccordionTrigger className="text-left font-display text-lg text-foreground hover:text-primary hover:no-underline px-6 py-4">{faq.q}</AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-charcoal-light">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">Still Have <span className="text-gradient-gold">Questions?</span></h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Can't find what you're looking for? Our team is here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={CONTACT_INFO.phoneLink} className="px-8 py-4 border border-primary text-primary font-medium text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Phone size={16} className="inline mr-2" />Call Us
              </a>
              <a href={`${CONTACT_INFO.whatsappLink}?text=Hi, I have a question about your services.`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300">
                <MessageCircle size={16} className="inline mr-2" />WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
