import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Instagram, Facebook, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-charcoal-dark border-t border-border/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <img src={logo} alt="Attractive Beauty Parlour" className="h-16 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where luxury meets artistry. Premium beauty services for ladies and kids 
              in a warm, welcoming environment.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
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
                  <span className="text-muted-foreground text-sm">{service}</span>
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
                  <a href="tel:+919876543210" className="text-foreground hover:text-primary transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={18} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href="mailto:hello@attractivebeautyparlour.com"
                    className="text-foreground hover:text-primary transition-colors text-sm"
                  >
                    hello@attractivebeautyparlour.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Visit Us</p>
                  <address className="text-foreground not-italic text-sm">
                    123 Beauty Lane, Fashion District,<br />
                    City - 400001
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
            © {new Date().getFullYear()} Attractive Beauty Parlour. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
