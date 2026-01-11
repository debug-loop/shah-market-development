import HeroSection from "@/components/sections/HeroSection";
import StatsCounter from "@/components/sections/StatsCounter";
import HowEscrowWorks from "@/components/sections/HowEscrowWorks";
import CategoriesSection from "@/components/sections/CategoriesSection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import HireFreelancer from "@/components/sections/HireFreelancer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <StatsCounter />
        <HowEscrowWorks />
        <CategoriesSection />
        <FeaturedProducts />
        <HireFreelancer />
        <TestimonialsSection />
      </main>
            <Footer />
      
    </div>
  );
};

export default Index;