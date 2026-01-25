import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Heart, Award, Users, Sparkles, Clock, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const values = [
  {
    icon: Heart,
    title: "Passion for Beauty",
    description: "Every service is delivered with love and dedication to make you feel special.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We use premium products and stay updated with the latest beauty trends.",
  },
  {
    icon: Users,
    title: "Client First",
    description: "Your satisfaction and comfort are at the heart of everything we do.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Constantly evolving our techniques to offer you the best results.",
  },
  {
    icon: Clock,
    title: "Punctuality",
    description: "We respect your time and ensure timely service delivery.",
  },
  {
    icon: Shield,
    title: "Hygiene & Safety",
    description: "Strict hygiene protocols to ensure your health and safety.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="About Attractive Beauty Parlour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4"
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            About <span className="text-gradient-gold">Attractive</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-elegant text-xl md:text-2xl text-champagne/80 max-w-2xl mx-auto"
          >
            A journey of passion, elegance, and dedication to beauty
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4 block">
                Who We Are
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Where Luxury Meets <span className="text-gradient-gold">Warmth</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Welcome to <strong className="text-foreground">Attractive Beauty Parlour</strong>, 
                  Gurugram's premier destination for luxury beauty services. Founded with a vision to 
                  redefine beauty experiences, we have grown to become a trusted name for ladies and 
                  kids seeking premium care in a warm, welcoming environment.
                </p>
                <p>
                  Our journey began with a simple belief: every woman and child deserves to feel 
                  beautiful and pampered. Today, we continue to uphold this philosophy, combining 
                  traditional beauty wisdom with modern techniques and international products.
                </p>
                <p>
                  At Attractive, we don't just offer services – we create experiences. From bridal 
                  transformations to kids' first haircuts, every moment at our parlour is designed 
                  to be memorable, comfortable, and truly special.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="luxury-card p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 border border-border/30 rounded-lg">
                    <span className="font-display text-4xl text-gradient-gold block mb-2">10+</span>
                    <span className="text-muted-foreground text-sm">Years Experience</span>
                  </div>
                  <div className="text-center p-6 border border-border/30 rounded-lg">
                    <span className="font-display text-4xl text-gradient-gold block mb-2">5000+</span>
                    <span className="text-muted-foreground text-sm">Happy Clients</span>
                  </div>
                  <div className="text-center p-6 border border-border/30 rounded-lg">
                    <span className="font-display text-4xl text-gradient-gold block mb-2">500+</span>
                    <span className="text-muted-foreground text-sm">Bridal Makeovers</span>
                  </div>
                  <div className="text-center p-6 border border-border/30 rounded-lg">
                    <span className="font-display text-4xl text-gradient-gold block mb-2">15+</span>
                    <span className="text-muted-foreground text-sm">Expert Stylists</span>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-primary/10 to-transparent blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-charcoal-light">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Our Values"
            title="What Sets Us Apart"
            description="The principles that guide every service we deliver"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="luxury-card text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <value.icon size={28} />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4 block">
              Our Mission
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
              "To make every woman and child feel <span className="text-gradient-gold italic">extraordinarily beautiful</span> through exceptional care and artistry"
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We are committed to providing a sanctuary where beauty, relaxation, and confidence converge. 
              Our team of skilled professionals works tirelessly to ensure that every visit leaves you 
              feeling refreshed, radiant, and ready to conquer the world.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
