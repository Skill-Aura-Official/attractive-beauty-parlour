import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

export const CTASection = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">
            Book Your Visit
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Ready to Experience <br />
            <span className="text-gradient-gold">Luxury Beauty?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Connect with us to schedule your appointment or learn more about our services. 
            We're here to help you look and feel your absolute best.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
            <motion.a
              href="tel:+919876543210"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 border border-primary text-primary font-body text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Phone size={18} />
              Call Now
            </motion.a>
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest hover:shadow-gold transition-all duration-300"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </motion.a>
          </div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-3 text-muted-foreground"
          >
            <MapPin size={18} className="text-primary" />
            <address className="not-italic">
              123 Beauty Lane, Fashion District, City - 400001
            </address>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
