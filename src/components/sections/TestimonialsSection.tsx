import { motion } from "framer-motion";
import TestimonialCard from "@/components/cards/TestimonialCard";

const testimonials = [
  {
    name: "Ahmed Khan",
    role: "Digital Marketer",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    quote: "Shah Freelance has transformed how I purchase digital services. The escrow system gives me complete peace of mind with every transaction.",
  },
  {
    name: "Sarah Chen",
    role: "E-commerce Owner",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    quote: "I've been using this platform for months now. The quality of products and the security measures are exceptional. Highly recommended!",
  },
  {
    name: "Michael Ross",
    role: "Freelance Developer",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    quote: "As a seller, I appreciate the fair escrow system and the smooth payment releases. Great platform for digital service providers.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="why-choose-us" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our <span className="text-gradient">Customers</span> Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Shah Freelance for their digital needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              name={testimonial.name}
              role={testimonial.role}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
              quote={testimonial.quote}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;