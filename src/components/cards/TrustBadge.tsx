import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface TrustBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
  delay?: number;
}

const TrustBadge = ({ icon: Icon, title, description, colorClass, delay = 0 }: TrustBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-4 transition-all hover:shadow-md"
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
          colorClass
        )}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

export default TrustBadge;