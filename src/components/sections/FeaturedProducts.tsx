import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/cards/ProductCard";
import {
  Send,
  CreditCard,
  Gift,
  Globe,
  Gamepad2,
  Package,
} from "lucide-react";

const featuredProducts = [
  {
    title: "+7 Russia Json+session TDATA 7d+ Telegram",
    price: 350,
    rating: 4,
    category: "Accounts",
    icon: Send,
    colorClass: "bg-rainbow-blue",
    badge: "Latest",
  },
  {
    title: "Steam Gift Card $50 USD Region Free",
    price: 4500,
    rating: 5,
    category: "Gift Cards",
    icon: Gift,
    colorClass: "bg-rainbow-purple",
    badge: "Popular",
  },
  {
    title: "Virtual Visa Card $100 Balance",
    price: 9500,
    rating: 4,
    category: "Virtual Cards",
    icon: CreditCard,
    colorClass: "bg-rainbow-green",
  },
  {
    title: "Premium VPN 1 Year Subscription",
    price: 2500,
    rating: 5,
    category: "Proxy/VPN",
    icon: Globe,
    colorClass: "bg-rainbow-cyan",
    badge: "Hot",
  },
  {
    title: "Adobe Creative Cloud 1 Year License",
    price: 12000,
    rating: 4,
    category: "Software",
    icon: Package,
    colorClass: "bg-rainbow-orange",
  },
  {
    title: "PlayStation Network $25 Gift Card",
    price: 2800,
    rating: 5,
    category: "Games",
    icon: Gamepad2,
    colorClass: "bg-rainbow-pink",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-muted-foreground">
              Top-rated products from verified sellers
            </p>
          </div>
          <Link to="/browse">
            <Button variant="outline" className="gap-2">
              View All Products
            </Button>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.title}
              title={product.title}
              price={product.price}
              rating={product.rating}
              category={product.category}
              icon={product.icon}
              colorClass={product.colorClass}
              badge={product.badge}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;