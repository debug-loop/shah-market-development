import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
  delay?: number;
}

const TestimonialCard = ({
  name,
  role,
  avatar,
  rating,
  quote,
  delay = 0,
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="relative rounded-xl border-2 border-border bg-card p-6 transition-all hover:shadow-lg">
        {/* Quote Icon */}
        <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />

        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-rainbow-yellow text-rainbow-yellow"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Quote Text */}
        <p className="text-muted-foreground mb-6 italic leading-relaxed">"{quote}"</p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-foreground">{name}</h4>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;