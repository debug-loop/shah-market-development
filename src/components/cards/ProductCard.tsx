import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: number;
  rating: number;
  category: string;
  icon: LucideIcon;
  colorClass: string;
  badge?: string;
  delay?: number;
}

const ProductCard = ({
  title,
  price,
  rating,
  category,
  icon: Icon,
  colorClass,
  badge,
  delay = 0,
}: ProductCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3.5 w-3.5",
          i < rating ? "fill-rainbow-yellow text-rainbow-yellow" : "text-muted-foreground/30"
        )}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl border-2 border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
        {/* Badge */}
        {badge && (
          <Badge className="absolute top-3 left-3 z-10 bg-rainbow-green text-white border-0">
            {badge}
          </Badge>
        )}

        {/* Icon Section */}
        <div className="relative flex items-center justify-center py-8 px-4 bg-muted/30">
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              colorClass
            )}
          >
            <Icon className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] leading-tight">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">{renderStars(rating)}</div>

          {/* Price & Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-foreground">
              Rs {price.toLocaleString()}
            </span>
            <Button size="sm" className="gap-1.5">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;