import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { CONTACT_INFO } from "@/lib/constants";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Offers", path: "/offers" },
  { name: "Kids", path: "/kids" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-elegant"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <motion.img
              src={logo}
              alt="Attractive Beauty Parlour"
              className="h-14 lg:h-16 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-body text-sm uppercase tracking-widest transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={CONTACT_INFO.phoneLink}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-all duration-300"
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>
            <a
              href={CONTACT_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:shadow-gold transition-all duration-300"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-10 p-2 text-foreground"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 top-20 bg-background z-40 lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`font-display text-2xl tracking-wide ${
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-foreground/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-4 mt-8 w-full max-w-xs"
              >
                <a
                  href={CONTACT_INFO.phoneLink}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-primary border border-primary rounded-full"
                >
                  <Phone size={18} />
                  <span>Call Now</span>
                </a>
                <a
                  href={CONTACT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-full"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
