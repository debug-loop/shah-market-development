import { motion } from "framer-motion";
import { ShoppingCart, Shield, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Buyer Places Order",
    description: "Choose your product and complete the purchase. Your payment is held securely in escrow.",
    color: "bg-rainbow-blue",
  },
  {
    icon: Shield,
    title: "Secure Delivery",
    description: "Seller delivers the product or service while your funds remain protected in escrow.",
    color: "bg-rainbow-purple",
  },
  {
    icon: CheckCircle,
    title: "Release Payment",
    description: "Confirm receipt and satisfaction. Funds are released to the seller automatically.",
    color: "bg-rainbow-green",
  },
];

const HowEscrowWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How <span className="text-gradient">Escrow</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our secure escrow system protects both buyers and sellers, ensuring safe and trustworthy transactions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting Lines (desktop) */}
          <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-border" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="relative"
            >
              <div className="rounded-xl border-2 border-border bg-card p-6 text-center h-full transition-all hover:shadow-lg hover:border-primary/30">
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl ${step.color}`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Arrow (mobile) */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4 md:hidden">
                  <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowEscrowWorks;