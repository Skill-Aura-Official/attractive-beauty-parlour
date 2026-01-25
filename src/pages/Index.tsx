import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { OffersPreview } from "@/components/home/OffersPreview";
import { KidsPreview } from "@/components/home/KidsPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesPreview />
      <OffersPreview />
      <TestimonialsSection />
      <KidsPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
