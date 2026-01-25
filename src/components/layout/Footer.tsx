import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";
import { CONTACT_INFO, BRAND } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="bg-charcoal-dark border-t border-border/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <img src={logo} alt={BRAND.name} className="h-16 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where luxury meets artistry. Premium beauty services for ladies and kids 
              in a warm, welcoming environment.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={CONTACT_INFO.instagramUrl}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href={CONTACT_INFO.facebookUrl}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Special Offers", path: "/offers" },
                { name: "Kids Zone", path: "/kids" },
                { name: "FAQ", path: "/faq" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                "Bridal Makeup",
                "Hair Styling",
                "Skin Care",
                "Nail Art",
                "Waxing",
                "Kids Haircuts",
              ].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Call Us</p>
                  <a href={CONTACT_INFO.phoneLink} className="text-foreground hover:text-primary transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={18} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a
                    href={CONTACT_INFO.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {CONTACT_INFO.whatsapp}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Visit Us</p>
                  <address className="text-foreground not-italic text-sm">
                    {CONTACT_INFO.address}
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
