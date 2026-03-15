import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Smile, Scissors } from "lucide-react";
import kidsSection from "@/assets/kids-section.jpg";

export const KidsPreview = () => {
  return (
    <section className="section-padding bg-charcoal-light relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={kidsSection}
                alt="Kids at Attractive Beauty Parlour"
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
            </div>
            {/* Decorative floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-primary/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">
              Little Stars Zone
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Special Care for <br />
              <span className="text-gradient-gold">Little Ones</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our dedicated kids' section offers a fun, friendly, and safe environment 
              where little ones can enjoy their very own pampering experience. 
              Gentle services with a touch of magic!
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Scissors size={22} />
                </div>
                <p className="text-foreground text-sm">Trendy Haircuts</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Heart size={22} />
                </div>
                <p className="text-foreground text-sm">Gentle Products</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Smile size={22} />
                </div>
                <p className="text-foreground text-sm">Fun Experience</p>
              </motion.div>
            </div>

            <Link
              to="/kids"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest hover:shadow-gold transition-all duration-300"
            >
              Explore Kids Zone
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
