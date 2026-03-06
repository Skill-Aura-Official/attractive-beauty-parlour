import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Phone, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import { useServices } from "@/hooks/useServices";
import serviceBridalMakeup from "@/assets/service-bridal-makeup.jpg";
import servicePartyMakeup from "@/assets/service-party-makeup.jpg";
import serviceHairStyling from "@/assets/service-hair-styling.jpg";
import serviceHairColor from "@/assets/service-hair-color.jpg";
import serviceHairSpa from "@/assets/service-hair-spa.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceSkinBrightening from "@/assets/service-skin-brightening.jpg";
import serviceManicure from "@/assets/service-manicure.jpg";
import servicePedicure from "@/assets/service-pedicure.jpg";
import serviceWaxing from "@/assets/service-waxing-new.jpg";
import serviceThreading from "@/assets/service-threading.jpg";
import serviceMehendi from "@/assets/service-mehendi-new.jpg";

const fallbackImageMap: Record<string, string> = {
  "Makeup": serviceBridalMakeup,
  "Hair": serviceHairStyling,
  "Skin": serviceFacial,
  "Nails": serviceManicure,
  "Waxing": serviceWaxing,
  "Styling": serviceThreading,
  "Haircut": serviceHairColor,
};

const staticServices = [
  { id: "s1", name: "Bridal Makeup", category: "Makeup", description: "Complete bridal makeup with HD finish, including pre-bridal consultation, trial session, and day-of flawless application for your special day.", image_url: serviceBridalMakeup },
  { id: "s2", name: "Party Makeup", category: "Makeup", description: "Glamorous party looks with long-lasting formulas. Perfect for weddings, receptions, and special occasions.", image_url: servicePartyMakeup },
  { id: "s3", name: "Engagement Makeup", category: "Makeup", description: "Subtle yet stunning makeup for your engagement ceremony, designed to photograph beautifully.", image_url: serviceBridalMakeup },
  { id: "s4", name: "Hair Styling", category: "Hair", description: "Professional hair styling for all occasions - from elegant updos to trendy hairstyles.", image_url: serviceHairStyling },
  { id: "s5", name: "Hair Coloring", category: "Hair", description: "Premium hair coloring with international products including highlights, balayage, and global colors.", image_url: serviceHairColor },
  { id: "s6", name: "Hair Treatments", category: "Hair", description: "Deep conditioning, keratin treatments, and hair spa for healthy, lustrous locks.", image_url: serviceHairSpa },
  { id: "s7", name: "Haircut & Trim", category: "Hair", description: "Expert haircuts tailored to your face shape and style preferences.", image_url: serviceHairColor },
  { id: "s8", name: "Facial Treatments", category: "Skin", description: "Rejuvenating facials including cleanup, gold facial, diamond facial, and anti-aging treatments.", image_url: serviceFacial },
  { id: "s9", name: "Skin Brightening", category: "Skin", description: "Advanced skin brightening and whitening treatments for radiant, glowing skin.", image_url: serviceSkinBrightening },
  { id: "s10", name: "Acne Treatment", category: "Skin", description: "Specialized treatments to combat acne and achieve clear, healthy skin.", image_url: serviceFacial },
  { id: "s11", name: "Manicure", category: "Nails", description: "Classic and spa manicures with premium nail care products for beautiful hands.", image_url: serviceManicure },
  { id: "s12", name: "Pedicure", category: "Nails", description: "Relaxing pedicure treatments including spa pedicure and foot care therapy.", image_url: servicePedicure },
  { id: "s13", name: "Nail Art", category: "Nails", description: "Creative nail art designs from simple to intricate patterns and gel extensions.", image_url: serviceManicure },
  { id: "s14", name: "Full Body Waxing", category: "Waxing", description: "Gentle and effective full body waxing using premium wax for smooth, lasting results.", image_url: serviceWaxing },
  { id: "s15", name: "Face Waxing", category: "Waxing", description: "Precise face waxing including eyebrows, upper lip, and chin for a clean look.", image_url: serviceWaxing },
  { id: "s16", name: "Threading", category: "Styling", description: "Expert eyebrow and face threading for perfectly shaped brows.", image_url: serviceThreading },
  { id: "s17", name: "Bleaching", category: "Styling", description: "Face and body bleaching treatments for an even, radiant skin tone.", image_url: serviceSkinBrightening },
  { id: "s18", name: "Mehendi", category: "Styling", description: "Traditional and modern mehendi designs for bridal and festive occasions.", image_url: serviceMehendi },
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: dbServices, isLoading } = useServices();

  // Use DB data if available, else static fallback
  const services = dbServices && dbServices.length > 0
    ? dbServices.map(s => ({
        ...s,
        image_url: s.image_url || fallbackImageMap[s.category] || serviceBridalMakeup,
      }))
    : staticServices;

  // Build dynamic categories from data
  const categories = ["All", ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => s.category === activeCategory);

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
            Our Expertise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            Premium <span className="text-gradient-gold">Beauty Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Explore our comprehensive range of luxury beauty treatments designed to enhance your natural radiance
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="luxury-card animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-md mb-5" />
                  <div className="h-3 bg-muted rounded w-1/4 mb-3" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="luxury-card group"
                >
                  <div className="relative overflow-hidden rounded-md mb-5 aspect-[4/3]">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <span className="text-primary text-xs uppercase tracking-widest mb-2 block">
                    {service.category}
                  </span>
                  <h3 className="font-display text-xl text-foreground mb-3">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={CONTACT_INFO.phoneLink}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-primary/30 text-primary text-sm hover:bg-primary/10 transition-all duration-300"
                    >
                      <Phone size={14} />
                      Call
                    </a>
                    <a
                      href={`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(`Hi, I'm interested in ${service.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm hover:shadow-gold transition-all duration-300"
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal-light">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              Ready to Book Your <span className="text-gradient-gold">Appointment?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Contact us today to schedule your beauty session. We're here to make you look and feel amazing!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={CONTACT_INFO.phoneLink}
                className="px-8 py-4 border border-primary text-primary font-medium text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Phone size={16} className="inline mr-2" />
                Call Now
              </a>
              <a
                href={CONTACT_INFO.whatsappLink}
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

export default Services;
