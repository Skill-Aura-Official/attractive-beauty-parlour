import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export const FloatingCTA = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 lg:hidden">
      <motion.a
        href="tel:+919876543210"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-elegant animate-pulse-gold"
      >
        <Phone size={24} />
      </motion.a>
      <motion.a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-gold"
      >
        <MessageCircle size={24} />
      </motion.a>
    </div>
  );
};
