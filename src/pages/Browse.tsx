import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from "@/lib/utils";
import { Send, CreditCard, Gift, Globe, Gamepad2, Package, MessageSquare, FileText, Coins, Search } from "lucide-react";

const categories = ["All", "Accounts", "Currency", "Gift Cards", "Virtual Cards", "Software", "SMS", "Proxy/VPN", "Games"];

const products = [
  { title: "+7 Russia Json+session TDATA 7d+ Telegram", price: 350, rating: 4, category: "Accounts", icon: Send, colorClass: "bg-rainbow-blue", badge: "Latest" },
  { title: "Steam Gift Card $50 USD Region Free", price: 4500, rating: 5, category: "Gift Cards", icon: Gift, colorClass: "bg-rainbow-purple", badge: "Popular" },
  { title: "Virtual Visa Card $100 Balance", price: 9500, rating: 4, category: "Virtual Cards", icon: CreditCard, colorClass: "bg-rainbow-green" },
  { title: "Premium VPN 1 Year Subscription", price: 2500, rating: 5, category: "Proxy/VPN", icon: Globe, colorClass: "bg-rainbow-cyan", badge: "Hot" },
  { title: "Adobe Creative Cloud 1 Year License", price: 12000, rating: 4, category: "Software", icon: Package, colorClass: "bg-rainbow-orange" },
  { title: "PlayStation Network $25 Gift Card", price: 2800, rating: 5, category: "Games", icon: Gamepad2, colorClass: "bg-rainbow-pink" },
  { title: "USA Phone Number SMS Verification", price: 150, rating: 3, category: "SMS", icon: MessageSquare, colorClass: "bg-rainbow-rose" },
  { title: "Google Play Gift Card $100", price: 9200, rating: 5, category: "Gift Cards", icon: Gift, colorClass: "bg-rainbow-yellow" },
  { title: "USDT to PKR Exchange Service", price: 500, rating: 4, category: "Currency", icon: Coins, colorClass: "bg-rainbow-indigo", badge: "Trusted" },
];

const Browse = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Browse <span className="text-gradient">Services</span></h1>
            <p className="text-muted-foreground">Find the perfect digital product for your needs</p>
          </motion.div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." name="search" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)} className={cn(activeCategory === cat && "gradient-hero text-white border-0")}>
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.title} {...product} delay={index * 0.05} />
            ))}
          </div>
          {filteredProducts.length === 0 && <p className="text-center text-muted-foreground py-12">No products found.</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Browse;