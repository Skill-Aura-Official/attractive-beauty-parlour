import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_INFO } from "@/lib/constants";

export const CTASection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-block text-primary font-body text-xs uppercase tracking-[0.3em] mb-4">
            Book Your Visit
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 leading-tight">
            Ready to Experience <br />
            <span className="text-gradient-gold">Luxury Beauty?</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed" style={{ textWrap: "pretty" }}>
            Connect with us to schedule your appointment or learn more about our services.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <motion.a
              href={CONTACT_INFO.phoneLink}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-7 py-3.5 flex items-center justify-center gap-2.5 border border-primary/40 text-primary font-body text-sm uppercase tracking-wider rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Phone size={16} />
              Call Now
            </motion.a>
            <motion.a
              href={`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent("Hi, I'd like to book an appointment at Attractive Beauty Parlour.")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-7 py-3.5 flex items-center justify-center gap-2.5 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider rounded-full hover:shadow-gold transition-all duration-300"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </motion.a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-12">
            {[
              { label: "View Services", to: "/services" },
              { label: "Special Offers", to: "/offers" },
              { label: "Get Directions", to: "/contact" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-muted-foreground hover:text-primary text-sm flex items-center gap-1 transition-colors duration-200">
                {link.label} <ArrowRight size={13} />
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-2.5 text-muted-foreground"
          >
            <MapPin size={16} className="text-primary shrink-0" />
            <address className="not-italic text-sm">{CONTACT_INFO.address}</address>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
