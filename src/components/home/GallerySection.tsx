import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "@/components/ui/section-heading";
import { supabase } from "@/integrations/supabase/client";
import bridalMakeup from "@/assets/generated-bridal-makeup-closeup.jpg";
import hairStyling from "@/assets/generated-hair-styling-luxury.jpg";
import facial from "@/assets/generated-skincare-room.jpg";
import nails from "@/assets/generated-nail-art-luxury.jpg";
import hairSpa from "@/assets/generated-wash-station.jpg";
import mehendi from "@/assets/generated-mehendi-detail.jpg";
import kidsSalon from "@/assets/generated-kids-salon-corner.jpg";
import partyMakeup from "@/assets/generated-party-glam.jpg";
import products from "@/assets/generated-beauty-products.jpg";
import reception from "@/assets/generated-reception-lounge.jpg";

const galleryImages = [
  { src: bridalMakeup, alt: "Premium bridal makeup finish", span: "md:col-span-2 md:row-span-2" },
  { src: hairStyling, alt: "Elegant salon hair styling" },
  { src: facial, alt: "Relaxing facial treatment" },
  { src: nails, alt: "Luxury nail care and nail art" },
  { src: hairSpa, alt: "Hair spa treatment setup" },
  { src: mehendi, alt: "Detailed mehendi design service" },
  { src: kidsSalon, alt: "Mother and child salon experience", span: "md:col-span-2" },
  { src: partyMakeup, alt: "Party makeup transformation" },
  { src: products, alt: "Premium salon beauty products" },
  { src: reception, alt: "Luxury salon reception lounge" },
];

export const GallerySection = () => {
  const { data } = useQuery({
    queryKey: ["public-gallery-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items" as never)
        .select("*" as never)
        .eq("is_visible" as never, true)
        .order("display_order" as never, { ascending: true })
        .order("created_at" as never, { ascending: false });
      if (error) throw error;
      return data as unknown as Array<{ id: string; title: string; media_url: string; media_type: string }>;
    },
  });

  const items = data?.length
    ? data.map((item, index) => ({ src: item.media_url, alt: item.title, type: item.media_type, span: index === 0 ? "md:col-span-2 md:row-span-2" : index === 6 ? "md:col-span-2" : "" }))
    : galleryImages.map((item) => ({ ...item, type: "image" }));

  return (
    <section className="section-padding bg-secondary/35 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Salon Moments"
          title="A Glimpse of Our Craft"
          description="Curated beauty, bridal, hair, skin, nail, and kids salon experiences in a refined setting."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[190px] lg:auto-rows-[230px] gap-3 sm:gap-4 mt-12">
          {items.map((image, index) => (
            <motion.figure
              key={image.alt}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className={`group relative overflow-hidden rounded-lg border border-border/60 bg-card shadow-card ${image.span || ""}`}
            >
              {image.type === "video" ? (
                <video src={image.src} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" muted playsInline controls preload="metadata" />
              ) : (
                <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/65 via-background/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-45" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};