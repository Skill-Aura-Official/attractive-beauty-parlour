import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Crown, Sparkles, Gift, Star, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import bridalPackage from "@/assets/bridal-package.jpg";

const packages = [
  {
    id: 1,
    title: "Bridal Bliss Package",
    subtitle: "For the Perfect Bride",
    description: "Complete bridal makeover package including pre-bridal facials, hair spa, makeup trial, D-day makeup & hair styling, draping assistance, and touch-up kit.",
    features: [
      "3 Pre-bridal facial sessions",
      "Hair spa & treatment",
      "Makeup trial session",
      "Bridal HD makeup",
      "Bridal hair styling",
      "Mehendi on hands & feet",
      "Complimentary touch-up kit",
    ],
    icon: Crown,
    isFeatured: true,
    image: bridalPackage,
  },
  {
    id: 2,
    title: "Party Glam Package",
    subtitle: "Shine at Every Event",
    description: "Look stunning at parties, receptions, and special events with our comprehensive party package.",
    features: [
      "Party makeup with airbrush",
      "Hair styling",
      "Manicure & pedicure",
      "Face cleanup",
      "Eyebrow threading",
    ],
    icon: Sparkles,
    isFeatured: false,
  },
  {
    id: 3,
    title: "Engagement Elegance",
    subtitle: "Your Special Moment",
    description: "Perfect for your engagement ceremony with subtle, elegant makeup that photographs beautifully.",
    features: [
      "Engagement makeup",
      "Hair styling",
      "Pre-engagement facial",
      "Manicure",
      "Eyebrow shaping",
    ],
    icon: Star,
    isFeatured: false,
  },
  {
    id: 4,
    title: "Festive Glow Package",
    subtitle: "Celebrate in Style",
    description: "Get festival-ready with our comprehensive glow package for Diwali, Karwa Chauth, and more.",
    features: [
      "Gold/Diamond facial",
      "Hair spa",
      "Manicure & pedicure",
      "Full body waxing",
      "Threading & cleanup",
    ],
    icon: Gift,
    isFeatured: false,
  },
  {
    id: 5,
    title: "Mom & Daughter Duo",
    subtitle: "Quality Time Together",
    description: "A special bonding experience for mothers and daughters to enjoy pampering together.",
    features: [
      "Matching hairstyles",
      "Kids-friendly mani-pedi",
      "Light makeup for both",
      "Hair accessories",
      "Photo moment setup",
    ],
    icon: Sparkles,
    isFeatured: false,
  },
  {
    id: 6,
    title: "Pre-Wedding Prep",
    subtitle: "Bride-to-Be Essentials",
    description: "Complete preparation package starting from 1 month before the wedding for glowing skin and healthy hair.",
    features: [
      "4 Facial sessions",
      "4 Hair spa sessions",
      "Full body waxing",
      "Bleaching",
      "Mani-pedi",
      "Skin consultation",
    ],
    icon: Crown,
    isFeatured: false,
  },
];

const Offers = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-charcoal-dark to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4"
          >
            Special Packages
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            Exclusive <span className="text-gradient-gold">Offers & Packages</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Curated packages for every special occasion, designed to give you the complete beauty experience
          </motion.p>
        </div>
      </section>

      {/* Featured Package */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[4/5]">
                <img
                  src={bridalPackage}
                  alt="Bridal Package"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-widest">
                  Most Popular
                </div>
              </div>
              <div className="absolute -z-10 -bottom-10 -right-10 w-72 h-72 bg-gradient-radial from-primary/20 to-transparent blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Crown size={24} className="text-primary" />
                <span className="text-primary text-sm uppercase tracking-widest">
                  Bridal Special
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                Bridal Bliss <span className="text-gradient-gold">Package</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                The ultimate bridal experience, designed to make your wedding day truly magical. 
                From pre-bridal prep to the final touch-up, we've got everything covered.
              </p>
              
              <ul className="space-y-3 mb-8">
                {packages[0].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <Star size={14} className="text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={`${CONTACT_INFO.whatsappLink}?text=Hi, I'm interested in the Bridal Bliss Package. Please share more details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300"
              >
                <MessageCircle size={18} />
                Enquire Now
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* All Packages Grid */}
      <section className="section-padding bg-charcoal-light">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="More Packages"
            title="Find Your Perfect Package"
            description="Browse our collection of curated packages for every occasion"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {packages.slice(1).map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="luxury-card group"
              >
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <pkg.icon size={26} />
                </div>
                <span className="text-primary text-xs uppercase tracking-widest mb-2 block">
                  {pkg.subtitle}
                </span>
                <h3 className="font-display text-2xl text-foreground mb-3">
                  {pkg.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {pkg.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {pkg.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground text-sm">
                      <Star size={12} className="text-primary" />
                      {feature}
                    </li>
                  ))}
                  {pkg.features.length > 4 && (
                    <li className="text-muted-foreground text-sm">
                      +{pkg.features.length - 4} more services
                    </li>
                  )}
                </ul>

                <a
                  href={`${CONTACT_INFO.whatsappLink}?text=Hi, I'm interested in the ${pkg.title}. Please share more details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <MessageCircle size={16} />
                  Enquire
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Package CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              Need a <span className="text-gradient-gold">Custom Package?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Can't find exactly what you need? Let us create a personalized package 
              tailored to your specific requirements and occasion.
            </p>
            <a
              href={`${CONTACT_INFO.whatsappLink}?text=Hi, I'd like to discuss a custom beauty package.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300"
            >
              <MessageCircle size={18} />
              Create Custom Package
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Offers;
