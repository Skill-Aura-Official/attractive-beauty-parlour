import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { useServices } from "@/hooks/useServices";
import serviceBridalMakeup from "@/assets/service-bridal-makeup.jpg";
import serviceHairStyling from "@/assets/service-hair-styling.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceManicure from "@/assets/service-manicure.jpg";
import serviceHairColor from "@/assets/service-hair-color.jpg";
import serviceWaxing from "@/assets/service-waxing-new.jpg";

const fallbackServices = [
  { id: "1", name: "Makeup Artistry", description: "Bridal & party makeup with HD finish", image_url: serviceBridalMakeup, category: "Makeup" },
  { id: "2", name: "Hair Styling", description: "Cuts, coloring & elegant updos", image_url: serviceHairStyling, category: "Hair" },
  { id: "3", name: "Skin Treatments", description: "Facials & rejuvenating therapies", image_url: serviceFacial, category: "Skin" },
  { id: "4", name: "Nail Care", description: "Manicures, pedicures & nail art", image_url: serviceManicure, category: "Nails" },
  { id: "5", name: "Hair Coloring", description: "Highlights, balayage & global", image_url: serviceHairColor, category: "Hair" },
  { id: "6", name: "Waxing & Threading", description: "Premium waxing for smooth skin", image_url: serviceWaxing, category: "Waxing" },
];

export const ServicesPreview = () => {
  const { data: dbServices } = useServices();
  const allServices = dbServices && dbServices.length > 0
    ? dbServices.map(s => ({ ...s, image_url: s.image_url || serviceBridalMakeup }))
    : fallbackServices;
  
  // Show 4 at a time on desktop, carousel through them
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allServices.length / itemsPerPage);
  const displayedServices = allServices.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const nextPage = useCallback(() => setCurrentPage(p => (p + 1) % totalPages), [totalPages]);
  const prevPage = () => setCurrentPage(p => (p - 1 + totalPages) % totalPages);

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(nextPage, 6000);
    return () => clearInterval(timer);
  }, [totalPages, nextPage]);

  return (
    <section id="services-preview" className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Our Expertise"
          title="Premium Beauty Services"
          description="Indulge in our curated collection of luxury treatments designed to enhance your natural beauty"
        />

        <div className="relative mt-16">
          {totalPages > 1 && (
            <div className="absolute -top-12 right-0 flex items-center gap-2">
              <button onClick={prevPage} className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <ChevronLeft size={18} />
              </button>
              <span className="text-muted-foreground text-sm font-body">{currentPage + 1}/{totalPages}</span>
              <button onClick={nextPage} className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayedServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to="/services" className="luxury-card group block h-full">
                    <div className="relative overflow-hidden rounded-md mb-5 aspect-[3/4]">
                      <img
                        src={service.image_url || serviceBridalMakeup}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-primary text-sm font-medium flex items-center gap-2">
                          View Details <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                    <span className="text-primary text-xs uppercase tracking-widest mb-2 block">
                      {service.category}
                    </span>
                    <h3 className="font-display text-xl text-foreground mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-3 px-8 py-4 border border-primary text-primary font-body text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Explore All Services
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
