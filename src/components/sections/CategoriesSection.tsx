import { motion } from "framer-motion";
import CategoryCard from "@/components/cards/CategoryCard";
import {
  User,
  Coins,
  Gift,
  CreditCard,
  Users,
  Package,
  GraduationCap,
  Megaphone,
  FileText,
  MessageSquare,
  Globe,
  Gamepad2,
} from "lucide-react";

const categories = [
  { title: "Accounts", icon: User, href: "/browse?category=accounts", colorClass: "bg-rainbow-red" },
  { title: "Currency Exchange", icon: Coins, href: "/browse?category=currency", colorClass: "bg-rainbow-orange" },
  { title: "Gift Cards", icon: Gift, href: "/browse?category=giftcards", colorClass: "bg-rainbow-yellow" },
  { title: "Virtual Cards", icon: CreditCard, href: "/browse?category=virtualcards", colorClass: "bg-rainbow-green" },
  { title: "Dedicated Teams", icon: Users, href: "/browse?category=teams", colorClass: "bg-rainbow-teal" },
  { title: "Premium Software", icon: Package, href: "/browse?category=software", colorClass: "bg-rainbow-cyan" },
  { title: "Learning Course", icon: GraduationCap, href: "/browse?category=courses", colorClass: "bg-rainbow-blue" },
  { title: "Digital Marketing", icon: Megaphone, href: "/browse?category=marketing", colorClass: "bg-rainbow-indigo" },
  { title: "USA Document", icon: FileText, href: "/browse?category=documents", colorClass: "bg-rainbow-purple" },
  { title: "SMS Verification", icon: MessageSquare, href: "/browse?category=sms", colorClass: "bg-rainbow-pink" },
  { title: "Proxy/VPN", icon: Globe, href: "/browse?category=proxy", colorClass: "bg-rainbow-rose" },
  { title: "Games", icon: Gamepad2, href: "/browse?category=games", colorClass: "bg-rainbow-lime" },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of digital products and services across multiple categories.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              icon={category.icon}
              href={category.href}
              colorClass={category.colorClass}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;