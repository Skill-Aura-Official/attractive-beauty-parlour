import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Phone, MessageCircle, MapPin, Clock, Instagram, Facebook, Navigation } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const Contact = () => {
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
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            Contact <span className="text-gradient-gold">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            We'd love to hear from you! Reach out to book your appointment or ask any questions
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Call */}
            <motion.a
              href={CONTACT_INFO.phoneLink}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="luxury-card text-center group cursor-pointer hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Phone size={28} />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Call Us</h3>
              <p className="text-primary font-medium">{CONTACT_INFO.phone}</p>
              <p className="text-muted-foreground text-sm mt-2">For appointments & enquiries</p>
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="luxury-card text-center group cursor-pointer hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <MessageCircle size={28} />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">WhatsApp</h3>
              <p className="text-primary font-medium">{CONTACT_INFO.whatsapp}</p>
              <p className="text-muted-foreground text-sm mt-2">Quick responses & bookings</p>
            </motion.a>

            {/* Location */}
            <motion.a
              href={CONTACT_INFO.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="luxury-card text-center group cursor-pointer hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <MapPin size={28} />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Visit Us</h3>
              <p className="text-muted-foreground text-sm">{CONTACT_INFO.address}</p>
            </motion.a>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="luxury-card text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock size={28} />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Hours</h3>
              <div className="text-muted-foreground text-sm space-y-1">
                <p>Mon-Sat: {CONTACT_INFO.businessHours.weekdays}</p>
                <p>Sunday: {CONTACT_INFO.businessHours.sunday}</p>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border/30">
                <iframe
                  src={CONTACT_INFO.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Attractive Beauty Parlour Location"
                />
              </div>
              <a
                href={CONTACT_INFO.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium hover:shadow-gold transition-all duration-300"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </motion.div>

            {/* Contact Info & Social */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-3xl text-foreground mb-6">
                  We're Here to <span className="text-gradient-gold">Help</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Whether you want to book an appointment, enquire about our services, 
                  or just have a question - we're always happy to hear from you. 
                  Reach out through any of our channels and we'll respond promptly!
                </p>
              </div>

              <div className="luxury-card">
                <h3 className="font-display text-xl text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <a
                    href={CONTACT_INFO.phoneLink}
                    className="flex items-center gap-4 p-4 border border-border/30 rounded-lg hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Call for Appointment</p>
                      <p className="text-primary text-sm">{CONTACT_INFO.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`${CONTACT_INFO.whatsappLink}?text=Hi, I'd like to book an appointment at Attractive Beauty Parlour.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 border border-border/30 rounded-lg hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">WhatsApp Booking</p>
                      <p className="text-primary text-sm">{CONTACT_INFO.whatsapp}</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="luxury-card">
                <h3 className="font-display text-xl text-foreground mb-4">Follow Us</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Stay updated with our latest offers, looks, and beauty tips!
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href={CONTACT_INFO.instagramUrl}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href={CONTACT_INFO.facebookUrl}
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
