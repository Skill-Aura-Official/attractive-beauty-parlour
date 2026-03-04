import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Crown, MessageCircle } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { CONTACT_INFO } from "@/lib/constants";
import bridalPackage from "@/assets/bridal-package.jpg";

const handleWhatsAppClick = (packageName: string) => {
  const message = encodeURIComponent(`Hi, I'm interested in the ${packageName}. Please share more details.`);
  window.open(`${CONTACT_INFO.whatsappLink}?text=${message}`, '_blank');
};

export const OffersPreview = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading
          subtitle="Special Packages"
          title="Exclusive Offers"
          description="Tailored packages for your special moments"
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Bridal Package */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
              <img
                src={bridalPackage}
                alt="Bridal Package"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={20} className="text-primary" />
                  <span className="text-primary text-sm uppercase tracking-widest">Bridal Special</span>
                </div>
                <h3 className="font-display text-3xl text-foreground mb-3">Bridal Bliss Package</h3>
                <p className="text-muted-foreground mb-6">
                  Complete bridal makeover including pre-bridal treatments, HD makeup, 
                  hair styling, and mehendi services for your magical day.
                </p>
                <button
                  onClick={() => handleWhatsAppClick("Bridal Bliss Package")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  Enquire Now
                </button>
              </div>
            </div>
          </motion.div>

          {/* Party & Other Packages */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="luxury-card group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="flex-1">
                  <span className="text-primary text-xs uppercase tracking-widest mb-2 block">Party Ready</span>
                  <h3 className="font-display text-2xl text-foreground mb-2">Party Glam Package</h3>
                  <p className="text-muted-foreground mb-4">
                    Professional makeup, elegant hair styling, and manicure combo 
                    to make you shine at any celebration.
                  </p>
                  <button
                    onClick={() => handleWhatsAppClick("Party Glam Package")}
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all duration-300 cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    Book Now
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="luxury-card group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="flex-1">
                  <span className="text-primary text-xs uppercase tracking-widest mb-2 block">Seasonal Offer</span>
                  <h3 className="font-display text-2xl text-foreground mb-2">Festive Glow Package</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete skin prep, facial, and makeup combo to get you 
                    festival-ready with a radiant glow.
                  </p>
                  <button
                    onClick={() => handleWhatsAppClick("Festive Glow Package")}
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all duration-300 cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    Book Now
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                to="/offers"
                className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary font-medium text-sm transition-colors duration-300"
              >
                View All Packages
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
