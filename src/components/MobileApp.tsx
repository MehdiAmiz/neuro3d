import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Download, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Convert 2D to 3D models in seconds with our optimized mobile AI",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Download,
    title: "Offline Capability",
    description: "Work on your projects even without internet connection",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Sparkles,
    title: "Advanced Filters",
    description: "Fine-tune your models with professional-grade editing tools",
    gradient: "from-green-500 to-emerald-500"
  }
];

export const MobileApp = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      ref={ref}
      id="mobile-app" 
      className="py-24 relative overflow-hidden"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Section Icon */}
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
            <Smartphone className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
            Mobile App{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Take NexodusAI with you everywhere. Our mobile app will bring the full power of AI-powered 3D conversion to your smartphone.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Mobile App Preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-[2.5rem] p-6 relative overflow-hidden">
                  {/* App Interface Mockup */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-lg">NexodusAI</h3>
                      <p className="text-white/70 text-sm">AI 3D Converter</p>
                    </div>
                    
                    {/* Upload Area */}
                    <div className="bg-white/10 rounded-2xl p-4 border-2 border-dashed border-white/30">
                      <div className="text-center">
                        <Download className="w-8 h-8 text-white/60 mx-auto mb-2" />
                        <p className="text-white/80 text-sm">Tap to upload image</p>
                      </div>
                    </div>
                    
                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-blue-500/20 px-3 py-1 rounded-full">
                        <span className="text-blue-300 text-xs">AI Processing</span>
                      </div>
                      <div className="bg-purple-500/20 px-3 py-1 rounded-full">
                        <span className="text-purple-300 text-xs">3D Preview</span>
                      </div>
                      <div className="bg-green-500/20 px-3 py-1 rounded-full">
                        <span className="text-green-300 text-xs">Export 3D Model</span>
                      </div>
                    </div>
                    
                    {/* Coming Soon Badge */}
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-sm">🚀 Coming Soon</p>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <motion.div 
                    className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  <motion.div 
                    className="absolute bottom-8 left-6 w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-3xl -z-10" />
            </div>
          </motion.div>
          
          {/* Features List */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* CTA Section */}
            <motion.div 
              className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h4 className="text-lg font-bold text-foreground mb-3">
                Be the First to Know
              </h4>
              <p className="text-foreground/70 mb-4">
                Get notified when our mobile app launches and receive early access.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/app">
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Join Waitlist
                  </Button>
                </Link>
                <Link to="/app">
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-foreground hover:bg-white/5"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}; 