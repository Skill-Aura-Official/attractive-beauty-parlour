import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import bridalMakeup from "@/assets/bridal-package-new.jpg";
import hairStyling from "@/assets/service-hair-styling.jpg";
import facial from "@/assets/service-facial.jpg";
import nails from "@/assets/service-nails.jpg";
import hairSpa from "@/assets/service-hair-spa.jpg";
import mehendi from "@/assets/service-mehendi-new.jpg";
import kidsSalon from "@/assets/kids-mom-daughter.jpg";
import partyMakeup from "@/assets/service-party-makeup.jpg";

const galleryImages = [
  { src: bridalMakeup, alt: "Premium bridal makeup finish", span: "md:col-span-2 md:row-span-2" },
  { src: hairStyling, alt: "Elegant salon hair styling" },
  { src: facial, alt: "Relaxing facial treatment" },
  { src: nails, alt: "Luxury nail care and nail art" },
  { src: hairSpa, alt: "Hair spa treatment setup" },
  { src: mehendi, alt: "Detailed mehendi design service" },
  { src: kidsSalon, alt: "Mother and child salon experience", span: "md:col-span-2" },
  { src: partyMakeup, alt: "Party makeup transformation" },
];

export const GallerySection = () => {
  return (
    <section className="section-padding bg-secondary/35 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Salon Moments"
          title="A Glimpse of Our Craft"
          description="Curated beauty, bridal, hair, skin, nail, and kids salon experiences in a refined setting."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[190px] lg:auto-rows-[230px] gap-3 sm:gap-4 mt-12">
          {galleryImages.map((image, index) => (
            <motion.figure
              key={image.alt}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className={`group relative overflow-hidden rounded-lg border border-border/60 bg-card shadow-card ${image.span || ""}`}
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/65 via-background/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-45" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};