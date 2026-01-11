import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TrustBadge from "@/components/cards/TrustBadge";
import { Shield, Headphones, BadgeCheck, ArrowRight, Zap, Globe, Gift } from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "Secure Escrow",
    description: "100% payment protection",
    colorClass: "bg-escrow-safe",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    colorClass: "bg-rainbow-blue",
  },
  {
    icon: BadgeCheck,
    title: "Money-back Guarantee",
    description: "Full refund if not satisfied",
    colorClass: "bg-rainbow-purple",
  },
];

const floatingIcons = [
  { icon: Globe, className: "top-20 left-[10%] animate-float", color: "bg-rainbow-cyan" },
  { icon: Zap, className: "top-32 right-[15%] animate-float delay-150", color: "bg-rainbow-yellow" },
  { icon: Gift, className: "bottom-20 left-[20%] animate-float delay-300", color: "bg-rainbow-pink" },
  { icon: Shield, className: "bottom-32 right-[10%] animate-float delay-75", color: "bg-rainbow-green" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 hidden lg:block">
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.className}`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color} opacity-80`}>
              <item.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Welcome to{" "}
              <span className="text-gradient">Shah Freelance</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your trusted marketplace for digital services with secure escrow protection. 
              Buy and sell digital products with complete peace of mind.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="gradient-hero text-white border-0 gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Products
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {trustBadges.map((badge, index) => (
              <TrustBadge
                key={badge.title}
                icon={badge.icon}
                title={badge.title}
                description={badge.description}
                colorClass={badge.colorClass}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;