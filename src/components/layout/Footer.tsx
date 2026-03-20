import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";
import { CONTACT_INFO, BRAND } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="bg-charcoal-dark border-t border-border/20">
      <div className="container mx-auto px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <img src={logo} alt={BRAND.name} className="h-14 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Where luxury meets artistry. Premium beauty services for ladies and kids
              in a warm, welcoming environment.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: CONTACT_INFO.instagramUrl, icon: Instagram, label: "Instagram" },
                { href: CONTACT_INFO.facebookUrl, icon: Facebook, label: "Facebook" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base text-foreground mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
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
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-base text-foreground mb-5">Services</h4>
            <ul className="space-y-2.5">
              {["Bridal Makeup", "Hair Styling", "Skin Care", "Nail Art", "Waxing", "Kids Haircuts"].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base text-foreground mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Call Us</p>
                  <a href={CONTACT_INFO.phoneLink} className="text-foreground hover:text-primary transition-colors text-sm">{CONTACT_INFO.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">WhatsApp</p>
                  <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors text-sm">{CONTACT_INFO.whatsapp}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Visit Us</p>
                  <address className="text-foreground not-italic text-sm leading-snug">{CONTACT_INFO.address}</address>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/faq" className="text-muted-foreground hover:text-primary text-xs transition-colors">FAQ</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary text-xs transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
