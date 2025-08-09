import { Card } from "@/components/ui/card";
import { Zap, Brain, Download, Palette, Shield, Rocket, Image, Settings, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Conversion",
    description: "Advanced neural networks analyze your 2D images and generate accurate 3D geometry with intelligent depth mapping and texture preservation.",
    color: "text-neural-blue"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Convert images to 3D models in under 30 seconds. Our optimized AI pipeline delivers professional results instantly.",
    color: "text-primary"
  },
  {
    icon: Image,
    title: "Multiple Image Formats",
    description: "Support for PNG, JPG, JPEG, and SVG files. Upload any 2D image and get high-quality 3D models in return.",
    color: "text-accent"
  },
  {
    icon: Download,
    title: "Export in Any Format",
    description: "Download in OBJ, FBX, GLTF, STL, and more. Compatible with Blender, Unity, Unreal Engine, and 3D printers.",
    color: "text-neural-purple"
  },
  {
    icon: Shield,
    title: "Commercial License",
    description: "Full commercial rights for all generated models. Use in games, films, products, and client projects without restrictions.",
    color: "text-primary-glow"
  },
  {
    icon: Settings,
    title: "Integration with Platforms",
    description: "All the generated GLB files can be effortlessly integrated into game development engines, augmented reality applications, virtual reality environments, 3D modeling softwares.",
    color: "text-accent-glow"
  }
];

export const Features = () => {
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
    <section 
      ref={ref}
      id="features" 
      className="py-24 relative overflow-hidden"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Mobile: No animations */}
        <div className="text-center mb-16 md:hidden">
          <div 
            className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl mb-8"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
            Next-Gen{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              AI Features
            </span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-4xl mx-auto leading-relaxed">
            Experience the future of 3D creation with our advanced AI-powered platform. 
            Transform your ideas into stunning 3D models with unprecedented speed and precision.
          </p>
        </div>

        {/* Desktop: Keep animations */}
        <motion.div 
          className="text-center mb-16 hidden md:block"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div 
            className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl mb-8"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
            Next-Gen{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              AI Features
            </span>
          </h2>
          <p className="text-xl text-foreground/80 max-w-4xl mx-auto leading-relaxed">
            Experience the future of 3D creation with our advanced AI-powered platform. 
            Transform your ideas into stunning 3D models with unprecedented speed and precision.
          </p>
        </motion.div>
        
        {/* Mobile: No animations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:hidden">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group"
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg h-full">
                <div className="relative z-10">
                  <div 
                    className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6"
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Keep animations */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 hidden md:grid"
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
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg h-full">
                <div className="relative z-10">
                  <motion.div 
                    className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};