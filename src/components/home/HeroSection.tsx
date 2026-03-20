import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-salon.jpg";
import heroBg2 from "@/assets/hero-bg.jpg";
import bridalPackage from "@/assets/bridal-package-new.jpg";
import logo from "@/assets/logo.png";
import { CONTACT_INFO } from "@/lib/constants";

const fallbackSlides = [
  { image: heroBg, subtitle: "Luxury Beauty & Wellness", title: "Where Beauty", highlight: "Meets Elegance", description: "Exclusive beauty experiences for discerning ladies & adorable kids" },
  { image: heroBg2, subtitle: "Premium Bridal Services", title: "Your Dream", highlight: "Bridal Look", description: "Complete bridal makeover packages with pre-bridal care & HD makeup" },
  { image: bridalPackage, subtitle: "Special Packages", title: "Glow This", highlight: "Festive Season", description: "Exclusive offers on facials, hair spa, and complete beauty packages" },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: dbSlides } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_slides").select("*").eq("is_active", true).order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const slides = dbSlides && dbSlides.length > 0
    ? dbSlides.map((s) => ({ image: s.image_url || heroBg, subtitle: s.subtitle || "", title: s.title, highlight: s.highlight || "", description: s.description || "" }))
    : fallbackSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [dbSlides]);

  const scrollToServices = () => {
    document.getElementById("services-preview")?.scrollIntoView({ behavior: "smooth" });
  };

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div key={currentSlide} className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
          <img src={slide.image} alt="" className="w-full h-full object-cover" loading="eager" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-6">
          <img src={logo} alt="Attractive Beauty Parlour" className="h-20 md:h-28 lg:h-32 w-auto mx-auto drop-shadow-lg" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, y: 20, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -15, filter: "blur(4px)" }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-5 py-2 border border-primary/25 rounded-full text-primary font-body text-xs md:text-sm uppercase tracking-[0.2em] mb-5">{slide.subtitle}</span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-4 leading-[1.1]" style={{ textWrap: "balance" }}>
              <span className="block">{slide.title}</span>
              <span className="text-gradient-gold italic">{slide.highlight}</span>
            </h1>
            <p className="font-elegant text-lg md:text-xl lg:text-2xl text-foreground/60 mb-10 max-w-2xl mx-auto" style={{ textWrap: "pretty" }}>{slide.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-8 bg-primary" : "w-3 bg-primary/25 hover:bg-primary/40"}`} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a href={CONTACT_INFO.phoneLink} className="btn-hero group w-full sm:w-auto rounded-full">
            <span className="relative z-10 flex items-center justify-center gap-2.5"><Phone size={16} />Call Now</span>
          </a>
          <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold uppercase tracking-widest bg-primary text-primary-foreground rounded-full hover:shadow-gold transition-all duration-300 active:scale-[0.97]">
            <span className="flex items-center justify-center gap-2.5"><MessageCircle size={16} />Book via WhatsApp</span>
          </a>
        </motion.div>

        {/* Scroll down */}
        <motion.button onClick={scrollToServices} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary/60 hover:text-primary transition-colors" aria-label="Scroll down">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={28} />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
};
