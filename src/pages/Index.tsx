import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { OffersPreview } from "@/components/home/OffersPreview";
import { KidsPreview } from "@/components/home/KidsPreview";
import { CTASection } from "@/components/home/CTASection";
import { GallerySection } from "@/components/home/GallerySection";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ScrollReveal>
        <ServicesPreview />
      </ScrollReveal>
      <ScrollReveal direction="left">
        <OffersPreview />
      </ScrollReveal>
      <ScrollReveal direction="scale">
        <GallerySection />
      </ScrollReveal>
      <ScrollReveal>
        <TestimonialsSection />
      </ScrollReveal>
      <ScrollReveal direction="right">
        <KidsPreview />
      </ScrollReveal>
      <ScrollReveal direction="scale">
        <CTASection />
      </ScrollReveal>
    </Layout>
  );
};

export default Index;
