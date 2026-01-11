import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface FreelancerCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  colorClass: string;
  freelancerCount: number;
  delay?: number;
}

const FreelancerCard = ({
  title,
  icon: Icon,
  href,
  colorClass,
  freelancerCount,
  delay = 0,
}: FreelancerCardProps) => {
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

          {/* Icon Container */}
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-transform duration-300 group-hover:scale-110",
                colorClass
              )}
            />
            <Icon className="relative h-6 w-6 text-white z-10" />
          </div>

          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {freelancerCount.toLocaleString()}+ Freelancers
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default FreelancerCard;