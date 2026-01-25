import { motion } from "framer-motion";
import { Phone, MessageCircle, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import { CONTACT_INFO } from "@/lib/constants";

export const HeroSection = () => {
  const scrollToServices = () => {
    const element = document.getElementById("services-preview");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <motion.img
          src={heroBg}
          alt="Luxury beauty salon"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <img
            src={logo}
            alt="Attractive Beauty Parlour"
            className="h-24 md:h-32 lg:h-40 w-auto mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2 border border-primary/30 rounded-full text-primary font-body text-xs md:text-sm uppercase tracking-[0.25em]">
            Luxury Beauty & Wellness
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-6"
        >
          <span className="block">Where Beauty</span>
          <span className="text-gradient-gold italic">Meets Elegance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-elegant text-xl md:text-2xl lg:text-3xl text-champagne/80 mb-12 max-w-3xl mx-auto"
        >
          Exclusive beauty experiences for discerning ladies & adorable kids
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href={CONTACT_INFO.phoneLink}
            className="btn-hero group w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Phone size={18} />
              Call Now
            </span>
          </a>
          <a
            href={CONTACT_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-widest bg-primary text-primary-foreground hover:shadow-gold transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-3">
              <MessageCircle size={18} />
              Book via WhatsApp
            </span>
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToServices}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary animate-float"
        >
          <ChevronDown size={32} />
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-primary/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent blur-3xl" />
    </section>
  );
};
