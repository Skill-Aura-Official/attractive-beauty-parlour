import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Heart, Smile, Scissors, Star, Sparkles, MessageCircle, Phone } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import kidsSection from "@/assets/kids-section.jpg";

const kidsServices = [
  {
    id: 1,
    title: "Kids Haircut",
    description: "Trendy, age-appropriate haircuts in a fun, friendly environment. We make haircuts an adventure!",
    icon: Scissors,
  },
  {
    id: 2,
    title: "Kids Hair Styling",
    description: "Special occasion hairstyles for birthday parties, family events, and school functions.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Mini Manicure",
    description: "Gentle, kid-safe nail care with fun colors and optional nail art.",
    icon: Heart,
  },
  {
    id: 4,
    title: "Mini Pedicure",
    description: "Relaxing foot treatment designed specially for little feet.",
    icon: Smile,
  },
  {
    id: 5,
    title: "Hair Spa for Kids",
    description: "Gentle hair treatments to keep young hair healthy and shiny.",
    icon: Star,
  },
  {
    id: 6,
    title: "Kids Party Packages",
    description: "Birthday party packages including mini makeovers for the birthday child and friends.",
    icon: Sparkles,
  },
];

const whyKidsLoveUs = [
  {
    title: "Fun Environment",
    description: "Colorful, child-friendly space with entertainment to keep kids engaged.",
  },
  {
    title: "Patient Staff",
    description: "Our stylists are specially trained to work with children of all ages.",
  },
  {
    title: "Safe Products",
    description: "We use only gentle, hypoallergenic products suitable for young skin.",
  },
  {
    title: "Quick Service",
    description: "We understand kids can get restless, so we work efficiently.",
  },
];

const Kids = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src={kidsSection}
            alt="Kids at Attractive Beauty Parlour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary/20 rounded-full mb-6"
          >
            <Sparkles size={18} className="text-primary" />
            <span className="text-primary font-body text-sm uppercase tracking-widest">
              Little Stars Zone
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            Beauty Care for <span className="text-gradient-gold">Little Ones</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-elegant text-xl md:text-2xl text-champagne/80 max-w-2xl mx-auto"
          >
            Where kids feel special, parents feel confident, and everyone has fun!
          </motion.p>
        </div>
      </section>

      {/* Why Kids Love Us */}
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
                Kid-Friendly
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Why Kids <span className="text-gradient-gold">Love Coming Here</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                At Attractive Beauty Parlour, we understand that kids need a special touch. 
                Our dedicated kids' zone is designed to make every visit a delightful experience 
                for both children and parents.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {whyKidsLoveUs.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-border/30 rounded-lg"
                  >
                    <h4 className="font-display text-lg text-foreground mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={kidsSection}
                  alt="Happy kids at salon"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kids Services */}
      <section className="section-padding bg-charcoal-light">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Our Services"
            title="Services for Little Stars"
            description="Specially designed services that make kids feel like royalty"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {kidsServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="luxury-card text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <service.icon size={28} />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-5">{service.description}</p>
                <a
                  href={`${CONTACT_INFO.whatsappLink}?text=Hi, I'd like to book ${service.title} for my child.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary text-sm hover:gap-3 transition-all duration-300"
                >
                  Book Now
                  <MessageCircle size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Birthday Party Package */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="luxury-card max-w-4xl mx-auto text-center p-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-gold text-primary-foreground">
              <Sparkles size={36} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Kids Birthday <span className="text-gradient-gold">Party Package</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Make your child's birthday extra special! Our party package includes mini makeovers, 
              hair styling, nail art, and fun activities for the birthday star and friends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={CONTACT_INFO.phoneLink}
                className="px-8 py-4 border border-primary text-primary font-medium text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Phone size={16} className="inline mr-2" />
                Call to Enquire
              </a>
              <a
                href={`${CONTACT_INFO.whatsappLink}?text=Hi, I'd like to enquire about the Kids Birthday Party Package.`}
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

export default Kids;
