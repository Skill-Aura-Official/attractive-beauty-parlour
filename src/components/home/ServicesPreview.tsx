import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import serviceBridalMakeup from "@/assets/service-bridal-makeup.jpg";
import serviceHairStyling from "@/assets/service-hair-styling.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceManicure from "@/assets/service-manicure.jpg";

const services = [
  {
    id: 1,
    title: "Makeup Artistry",
    description: "Bridal & party makeup with HD finish",
    image: serviceBridalMakeup,
    category: "Makeup",
  },
  {
    id: 2,
    title: "Hair Styling",
    description: "Cuts, coloring & elegant updos",
    image: serviceHairStyling,
    category: "Hair",
  },
  {
    id: 3,
    title: "Skin Treatments",
    description: "Facials & rejuvenating therapies",
    image: serviceFacial,
    category: "Skin",
  },
  {
    id: 4,
    title: "Nail Care",
    description: "Manicures, pedicures & nail art",
    image: serviceManicure,
    category: "Nails",
  },
];

export const ServicesPreview = () => {
  return (
    <section id="services-preview" className="section-padding bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Our Expertise"
          title="Premium Beauty Services"
          description="Indulge in our curated collection of luxury treatments designed to enhance your natural beauty"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link
                to="/services"
                className="luxury-card group block h-full"
              >
                <div className="relative overflow-hidden rounded-md mb-5 aspect-[3/4]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                  >
                    <span className="text-primary text-sm font-medium flex items-center gap-2">
                      View Details <ArrowRight size={16} />
                    </span>
                  </motion.div>
                </div>
                <span className="text-primary text-xs uppercase tracking-widest mb-2 block">
                  {service.category}
                </span>
                <h3 className="font-display text-xl text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
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
