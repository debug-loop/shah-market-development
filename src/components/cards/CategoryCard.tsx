import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  colorClass: string;
  delay?: number;
}

const CategoryCard = ({ title, icon: Icon, href, colorClass, delay = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={href}>
        <div className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 text-center transition-all duration-300 hover:border-transparent hover:shadow-lg">
          {/* Gradient overlay on hover */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10",
              colorClass
            )}
          />
          
          {/* Hexagonal Icon Container */}
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
            <div
              className={cn(
                "absolute inset-0 rounded-xl rotate-45 transition-transform duration-300 group-hover:scale-110",
                colorClass
              )}
            />
            <Icon className="relative h-7 w-7 text-white z-10" />
          </div>
          
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;