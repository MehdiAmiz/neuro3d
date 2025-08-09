import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Reviews } from "@/components/Reviews";
import { MobileApp } from "@/components/MobileApp";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ScrollProgress />
      <Header />
      {/* Spacer to offset fixed header height */}
      <div className="h-16 md:h-20" />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Reviews />
      <MobileApp />
      <FAQ />
      <Contact />
      <Footer />
    </motion.div>
  );
};

export default Index;
