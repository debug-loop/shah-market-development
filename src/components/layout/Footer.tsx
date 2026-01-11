import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { label: "Browse Services", href: "/browse" },
  { label: "About Us", href: "/about" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Contact Us", href: "/#contact" },
];

const categories = [
  { label: "Accounts", href: "/browse?category=accounts" },
  { label: "Currency Exchange", href: "/browse?category=currency" },
  { label: "Gift Cards", href: "/browse?category=giftcards" },
  { label: "Virtual Cards", href: "/browse?category=virtualcards" },
  { label: "Premium Software", href: "/browse?category=software" },
  { label: "Digital Marketing", href: "/browse?category=marketing" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo & Social */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-hero">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold">Shah Freelance</span>
            </Link>
            <p className="text-sm text-background/70">
              Your trusted marketplace for digital services with secure escrow protection.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-background/70 mb-4">
              Subscribe to get updates on new products and offers.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button size="icon" className="gradient-hero border-0 shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 space-y-1">
              <Link
                to="/terms"
                className="block text-xs text-background/50 hover:text-background/70 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="block text-xs text-background/50 hover:text-background/70 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-background/10">
        <div className="container py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-background/50">
          <p>© 2025 Shah Freelance. All rights reserved.</p>
          <p>Secure transactions powered by Escrow Protection</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;