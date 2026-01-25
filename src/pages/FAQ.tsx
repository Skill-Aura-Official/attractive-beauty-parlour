import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What are your working hours?",
        a: `We are open Monday to Saturday from ${CONTACT_INFO.businessHours.weekdays} and Sunday from ${CONTACT_INFO.businessHours.sunday}. For appointments outside regular hours, please contact us in advance.`,
      },
      {
        q: "Do I need to book an appointment?",
        a: "While walk-ins are welcome, we highly recommend booking an appointment to ensure we can serve you at your preferred time. For bridal and party services, advance booking is essential.",
      },
      {
        q: "Where are you located?",
        a: `We are located at ${CONTACT_INFO.address}. You can easily reach us via Google Maps or call us for directions.`,
      },
      {
        q: "Do you offer home services?",
        a: "Yes, we offer home services for bridal makeup, party makeup, and certain other services. Additional charges may apply based on location. Please contact us for details.",
      },
    ],
  },
  {
    category: "Services",
    questions: [
      {
        q: "What services do you offer?",
        a: "We offer a comprehensive range of beauty services including makeup (bridal, party, engagement), hair services (styling, coloring, treatments), skincare (facials, treatments), nail care (manicure, pedicure, nail art), waxing, threading, and specialized services for kids.",
      },
      {
        q: "What products do you use?",
        a: "We use premium, internationally recognized brands for all our services. Our products are carefully selected for quality, safety, and effectiveness. We can also accommodate specific product requests for clients with sensitivities.",
      },
      {
        q: "Do you offer bridal packages?",
        a: "Yes! Our Bridal Bliss Package is our most popular offering. It includes pre-bridal treatments, makeup trial, D-day makeup and styling, and a complimentary touch-up kit. We also customize packages based on individual requirements.",
      },
      {
        q: "Can I get a makeup trial before my wedding?",
        a: "Absolutely! We highly recommend a makeup trial session before your big day. This helps us understand your preferences and ensures you're completely satisfied with your bridal look.",
      },
    ],
  },
  {
    category: "Kids Services",
    questions: [
      {
        q: "At what age can kids visit the salon?",
        a: "We welcome children of all ages! Our stylists are specially trained to work with kids and make the experience fun and comfortable. For very young children, we suggest scheduling appointments during their alert, happy times.",
      },
      {
        q: "Are your products safe for children?",
        a: "Yes, we use specially formulated, gentle products that are safe for children's delicate skin and hair. Our kids' nail polishes are water-based and non-toxic.",
      },
      {
        q: "Do you offer birthday party packages for kids?",
        a: "Yes! Our Kids Birthday Party Package includes mini makeovers, hair styling, and nail art for the birthday child and friends. It's a unique way to celebrate! Contact us for package details and pricing.",
      },
    ],
  },
  {
    category: "Booking & Payment",
    questions: [
      {
        q: "How do I book an appointment?",
        a: "You can book an appointment by calling us or sending a WhatsApp message. We'll confirm your appointment based on availability. For online booking, stay tuned - it's coming soon!",
      },
      {
        q: "What is your cancellation policy?",
        a: "We request at least 24 hours notice for cancellations. For bridal bookings, please inform us at least 48-72 hours in advance. Last-minute cancellations may be subject to a cancellation fee.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash, all major debit/credit cards, UPI payments (GPay, PhonePe, Paytm), and bank transfers. For bridal packages, we require an advance booking amount.",
      },
      {
        q: "Do you offer any discounts?",
        a: "We have seasonal offers and package discounts throughout the year. Follow us on social media or WhatsApp us to stay updated on our latest offers!",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-charcoal-dark to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4"
          >
            Help Center
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Find answers to common questions about our services, booking, and policies
          </motion.p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl text-foreground mb-6 pb-4 border-b border-border/30">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {section.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${section.category}-${index}`}
                    className="luxury-card border-none"
                  >
                    <AccordionTrigger className="text-left font-display text-lg text-foreground hover:text-primary hover:no-underline px-6 py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-charcoal-light">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              Still Have <span className="text-gradient-gold">Questions?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Our team is here to help! 
              Reach out to us and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={CONTACT_INFO.phoneLink}
                className="px-8 py-4 border border-primary text-primary font-medium text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Phone size={16} className="inline mr-2" />
                Call Us
              </a>
              <a
                href={`${CONTACT_INFO.whatsappLink}?text=Hi, I have a question about your services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300"
              >
                <MessageCircle size={16} className="inline mr-2" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
