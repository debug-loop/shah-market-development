import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, ShoppingBag, Shield, Award } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const StatItem = ({ icon: Icon, value, label, suffix = "", delay = 0 }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="text-center"
    >
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 mb-3">
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm opacity-80">{label}</div>
    </motion.div>
  );
};

const StatsCounter = () => {
  const stats = [
    { icon: ShoppingBag, value: 15000, label: "Transactions Completed", suffix: "+" },
    { icon: Users, value: 8500, label: "Active Users", suffix: "+" },
    { icon: Shield, value: 100, label: "Secure Escrow", suffix: "%" },
    { icon: Award, value: 500, label: "Products Available", suffix: "+" },
  ];

  return (
    <div className="gradient-hero text-white py-12 md:py-16 rounded-2xl">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;