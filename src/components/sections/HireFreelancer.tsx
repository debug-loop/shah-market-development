import { motion } from "framer-motion";
import FreelancerCard from "@/components/cards/FreelancerCard";
import {
  Code,
  Palette,
  TrendingUp,
  Server,
  Smartphone,
  Globe,
  PenTool,
} from "lucide-react";

const freelancerCategories = [
  {
    title: "Programming",
    icon: Code,
    href: "/freelancers?category=programming",
    colorClass: "bg-rainbow-blue",
    freelancerCount: 1200,
  },
  {
    title: "Graphic Design",
    icon: Palette,
    href: "/freelancers?category=design",
    colorClass: "bg-rainbow-pink",
    freelancerCount: 850,
  },
  {
    title: "SEO/SMM",
    icon: TrendingUp,
    href: "/freelancers?category=seo",
    colorClass: "bg-rainbow-green",
    freelancerCount: 620,
  },
  {
    title: "IT Management",
    icon: Server,
    href: "/freelancers?category=it",
    colorClass: "bg-rainbow-purple",
    freelancerCount: 340,
  },
  {
    title: "Mobile Development",
    icon: Smartphone,
    href: "/freelancers?category=mobile",
    colorClass: "bg-rainbow-orange",
    freelancerCount: 580,
  },
  {
    title: "Web Developer",
    icon: Globe,
    href: "/freelancers?category=web",
    colorClass: "bg-rainbow-cyan",
    freelancerCount: 920,
  },
  {
    title: "Content Writer",
    icon: PenTool,
    href: "/freelancers?category=content",
    colorClass: "bg-rainbow-yellow",
    freelancerCount: 750,
  },
];

const HireFreelancer = () => {
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
            Hire a <span className="text-gradient">Freelancer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with skilled professionals for your projects. Find the perfect match for any task.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {freelancerCategories.map((category, index) => (
            <FreelancerCard
              key={category.title}
              title={category.title}
              icon={category.icon}
              href={category.href}
              colorClass={category.colorClass}
              freelancerCount={category.freelancerCount}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HireFreelancer;