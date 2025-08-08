import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Zap, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$14",
    period: "",
    credits: "3,000",
    description: "Perfect for small projects and testing",
    features: [
      "3,000 AI credits",
      "High quality 3D models",
      "All export formats (OBJ, FBX, GLTF, STL)",
      "Commercial license included",
      "Email support",
      "Credits never expire"
    ],
    buttonText: "Buy Credits",
    buttonVariant: "outline" as const,
    popular: false,
    savings: null,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Professional",
    price: "$20",
    period: "",
    credits: "5,000",
    description: "For professionals and regular users",
    features: [
      "5,000 AI credits",
      "Ultra HD quality models",
      "All export formats",
      "Priority support",
      "Commercial license",
      "Batch processing",
      "Credits never expire",
      "API access"
    ],
    buttonText: "Buy Credits",
    buttonVariant: "neural" as const,
    popular: true,
    savings: "33% more credits",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Enterprise",
    price: "$50",
    period: "",
    credits: "20,000",
    description: "For large projects and teams",
    features: [
      "20,000 AI credits",
      "Maximum quality output",
      "All export formats",
      "Dedicated support",
      "Commercial license",
      "Advanced batch processing",
      "Credits never expire",
      "Full API access",
      "Custom integrations"
    ],
    buttonText: "Buy Credits",
    buttonVariant: "glow" as const,
    popular: false,
    savings: "67% more credits",
    gradient: "from-orange-500 to-red-500"
  }
];

export const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.section 
      ref={ref}
      id="pricing" 
      className="py-24 relative overflow-hidden"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Simplified Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)"
            }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
            Credit-Based{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Pay only for what you use. Purchase credits and generate 3D models whenever you need them. 
            No monthly subscriptions, no hidden fees.
          </p>
        </motion.div>
        
        {/* Redesigned Pricing Cards */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="h-full"
            >
              <div className={`h-full relative group ${
                plan.popular ? 'lg:scale-105' : ''
              }`}>
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl" />
                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/10" />
                
                {/* Popular Badge */}
              {plan.popular && (
                  <motion.div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full text-sm font-semibold text-white flex items-center shadow-lg">
                      <Star className="w-4 h-4 mr-2" />
                      Most Popular
                    </div>
                  </motion.div>
              )}
              
                {/* Card Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Header */}
              <div className="text-center mb-8">
                    <motion.h3 
                      className="text-3xl font-display font-bold mb-4 text-foreground"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.2 + 0.7, duration: 0.6 }}
                    >
                      {plan.name}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-foreground/70 mb-6"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: index * 0.2 + 0.9, duration: 0.6 }}
                    >
                      {plan.description}
                    </motion.p>
                    
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.2 + 1.1, duration: 0.6 }}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-5xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                      </div>
                      <div className="flex items-center justify-center text-xl text-foreground/80">
                        <Zap className="w-6 h-6 text-primary mr-2" />
                        <span className="font-semibold">{plan.credits} Credits</span>
                      </div>
                      {plan.savings && (
                        <div className="mt-3">
                          <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium">
                            {plan.savings}
                          </span>
                </div>
                      )}
                    </motion.div>
              </div>
              
                  {/* Features */}
                  <div className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.2 + 1.3 + featureIndex * 0.1, duration: 0.5 }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                    <span className="text-foreground/80">{feature}</span>
                      </motion.div>
                ))}
              </div>
              
                  {/* Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: index * 0.2 + 1.5, duration: 0.6 }}
                    className="mt-auto"
                  >
              <Link to="/app">
              <Button 
                variant={plan.buttonVariant} 
                      className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
                      }`}
                size="lg"
              >
                {plan.buttonText}
              </Button>
              </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enhanced How Credits Work Section */}
        <motion.div 
          className="text-center mt-32"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {/* Enhanced Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 neon-glow"
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ delay: 1.4, duration: 0.8, type: "spring" }}
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              How Credits{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Work
              </span>
            </h3>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Simple, transparent pricing with no hidden fees or complexity-based charges
            </p>
          </motion.div>

          {/* Enhanced Steps Grid */}
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Purchase Credits",
                  description: "Buy credits based on your project needs. Credits never expire and are yours forever.",
                  icon: "💳",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 1.5
                },
                {
                  step: "02", 
                  title: "Convert Images",
                  description: "Each conversion (3D video or GLB file) costs exactly 50 credits, regardless of complexity.",
                  icon: "🔄",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 1.7
                },
                {
                  step: "03",
                  title: "Download & Use", 
                  description: "Download your 3D models and videos in any format and use them commercially without restrictions.",
                  icon: "📥",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 1.9
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="text-center relative group"
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                  transition={{ delay: item.delay, duration: 0.8, type: "spring" }}
                >
                  {/* Step Number Badge */}
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      boxShadow: "0 0 30px rgba(var(--primary), 0.8)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-white font-bold text-xl font-display">{item.step}</span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ 
                      y: [0, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Content */}
                  <h4 className="text-xl font-display font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Bottom Section */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl mx-auto">
              <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2.4, duration: 0.5 }}
              >
                <h4 className="text-xl font-display font-bold mb-2 text-foreground">
                  Simple & Transparent Pricing
                </h4>
                <p className="text-foreground/70">
                  Each conversion costs exactly 50 credits. No hidden fees or complexity-based pricing.
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { text: "No monthly fees", icon: "🚫" },
                  { text: "Credits never expire", icon: "♾️" },
                  { text: "Commercial license included", icon: "✅" }
                ].map((item, index) => (
                  <motion.div 
                    key={item.text}
                    className="flex items-center justify-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 2.6 + index * 0.1, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-foreground/80">{item.text}</span>
                  </motion.div>
                ))}
          </div>
        </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};