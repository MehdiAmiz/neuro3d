import { Card } from "@/components/ui/card";
import { Upload, Brain, Download, CheckCircle, Image, Settings, Eye, Video, Zap, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Image",
    description: "Start by selecting and uploading a 2D image—whether it's a product photo, a character concept, or any design you want to bring to life. Our AI instantly analyzes the image and automatically removes the background to ensure a clean and seamless 3D transformation. This step ensures that the focus remains on your object without distractions.",
    step: "01",
    image: "/src/assets/how-it-works/step1-upload.png",
    alt: "Upload interface showing drag and drop area",
    isVideo: false,
    gradient: "from-blue-500 to-cyan-500",
    emoji: "📤"
  },
  {
    icon: Image,
    title: "Intelligent Background Removal",
    description: "Before transforming your 2D image into 3D, our AI performs an advanced background removal process to ensure the highest accuracy and visual quality. This step is crucial in isolating the main subject of your image, eliminating distractions, and ensuring a seamless 3D transformation.",
    step: "02",
    image: "/src/assets/how-it-works/step2-upload.png",
    alt: "Background removal process visualization",
    isVideo: false,
    gradient: "from-purple-500 to-pink-500",
    emoji: "🧠"
  },
  {
    icon: Video,
    title: "Instant 3D Video Preview",
    description: "Once the background is removed, our AI model creates a detailed 3D video preview of your object. This rotating video gives you a complete 360° view, allowing you to inspect the shape, proportions, and accuracy of the generated model. If you're not satisfied with the result, you have the option to regenerate the video until you achieve the best representation of your original image.",
    step: "03",
    video: "/src/assets/how-it-works/step3-preview.mp4",
    alt: "3D video preview with rotating model",
    isVideo: true,
    gradient: "from-green-500 to-emerald-500",
    emoji: "🎬"
  },
  {
    icon: Download,
    title: "Finalize with 3D GLB Conversion",
    description: "After reviewing the video, you can proceed to generate a high-quality GLB 3D file. This file format is widely used in game development, 3D printing, augmented reality (AR), virtual reality (VR), and digital design. The AI optimizes the model for realism while keeping it lightweight and efficient for use in various platforms.",
    step: "04",
    video: "/src/assets/how-it-works/step4-glb.mp4",
    alt: "GLB file generation and download interface",
    isVideo: true,
    gradient: "from-orange-500 to-red-500",
    emoji: "📦"
  }
];

export const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.section 
      ref={ref}
      id="how-it-works" 
      className="py-24 bg-gradient-to-b from-background via-background/95 to-muted/10 relative overflow-hidden"
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
            How DimenXioner{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Transform your 2D images into stunning 3D models in just four simple steps. 
            Our AI handles the complex work while you focus on creating amazing content.
          </p>
        </motion.div>
        
        {/* Enhanced Steps Grid */}
        <motion.div 
          className="space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              variants={itemVariants}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="absolute left-1/2 top-full w-0.5 h-24 bg-gradient-to-b from-primary/50 to-transparent z-0"
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ delay: index * 0.3 + 1, duration: 0.8 }}
                />
              )}
              
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Enhanced Media Section */}
                <motion.div 
                  className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                  initial={{ opacity: 0, x: index % 2 === 1 ? 80 : -80 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 1 ? 80 : -80 }}
                  transition={{ delay: index * 0.3 + 0.5, duration: 1, ease: "easeOut" }}
                >
                  <div className="relative group">
                    {/* Enhanced Background Glow */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-2xl`}
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    />
                    
                    {/* Step Number Badge */}
                    <motion.div 
                      className={`absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center z-30 neon-glow`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                      transition={{ delay: index * 0.3 + 0.8, duration: 0.6, type: "spring" }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 10,
                        boxShadow: "0 0 30px rgba(var(--primary), 0.8)"
                      }}
                    >
                      <span className="text-white font-bold text-xl font-display">{step.step}</span>
                    </motion.div>
                    
                    {/* Media Content */}
                    <div className="relative z-10">
                      {step.isVideo ? (
                        <motion.video
                          src={step.video}
                          className="w-full h-auto rounded-3xl shadow-2xl border border-primary/20 glass-card"
                          initial={{ opacity: 0, scale: 0.8, rotateY: index % 2 === 1 ? 20 : -20 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{ 
                            duration: 1.2,
                            delay: index * 0.3 + 1
                          }}
                          whileHover={{ 
                            rotateY: index % 2 === 1 ? -8 : 8,
                            rotateX: 3,
                            scale: 1.02,
                            transition: { duration: 0.4 }
                          }}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls={false}
                        />
                      ) : (
                        <motion.img
                          src={step.image}
                          alt={step.alt}
                          className="w-full h-auto rounded-3xl shadow-2xl border border-primary/20 glass-card"
                          initial={{ opacity: 0, scale: 0.8, rotateY: index % 2 === 1 ? 20 : -20 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{ 
                            duration: 1.2,
                            delay: index * 0.3 + 1
                          }}
                          whileHover={{ 
                            rotateY: index % 2 === 1 ? -8 : 8,
                            rotateX: 3,
                            scale: 1.02,
                            transition: { duration: 0.4 }
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Enhanced Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent rounded-3xl" />
                    
                    {/* Play Button for Videos */}
                    {step.isVideo && (
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.3 + 1.5, duration: 0.5 }}
                      >
                        <motion.div 
                          className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 neon-glow"
                          whileHover={{ scale: 1.1 }}
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                {/* Enhanced Content Section */}
                <motion.div 
                  className={`text-center lg:text-left ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                  initial={{ opacity: 0, x: index % 2 === 1 ? -80 : 80 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 1 ? -80 : 80 }}
                  transition={{ delay: index * 0.3 + 0.8, duration: 1, ease: "easeOut" }}
                >
                  <div className="relative p-10 rounded-3xl border border-primary/20 hover:border-primary/40 transition-all duration-500 group overflow-hidden">
                    {/* Enhanced Background Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent rounded-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-accent/5 rounded-3xl" />
                    <div className="absolute inset-0 backdrop-blur-xl bg-black/10 rounded-3xl" />
                    
                    {/* Animated Background Pattern */}
                    <motion.div 
                      className="absolute inset-0 opacity-20"
                      animate={{ 
                        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, ${step.gradient.split(' ')[1]} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${step.gradient.split(' ')[3]} 0%, transparent 50%)`,
                        backgroundSize: "200% 200%"
                      }}
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      animate={{ 
                        x: ["-100%", "200%"]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: index * 0.5
                      }}
                    />
                    
                    {/* Content Container */}
                <div className="relative z-10">
                    {/* Step Icon */}
                  <motion.div 
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl mb-6 neon-glow`}
                    whileHover={{ 
                        scale: 1.15,
                        rotate: 15,
                        boxShadow: "0 0 30px rgba(var(--primary), 0.8)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.h3 
                      className="text-3xl lg:text-4xl font-display font-bold mb-6 text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.3 + 1.2, duration: 0.6 }}
                  >
                    {step.title}
                  </motion.h3>
                  
                  <motion.p 
                      className="text-lg text-foreground/70 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: index * 0.3 + 1.4, duration: 0.6 }}
                  >
                    {step.description}
                  </motion.p>
                </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enhanced Stats Section */}
        <div className="text-center mt-32 mb-20">
          <h3 className="text-3xl lg:text-4xl font-display font-bold mb-12">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DimenXioner
            </span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                value: "<30s", 
                label: "Average Processing Time", 
                description: "Lightning-fast AI processing for instant results",
                gradient: "from-blue-500 to-cyan-500", 
                icon: "⚡",
                color: "blue"
              },
              { 
                value: "99.2%", 
                label: "Accuracy Rate", 
                description: "Industry-leading precision in 3D conversion",
                gradient: "from-green-500 to-emerald-500", 
                icon: "🎯",
                color: "green"
              },
              { 
                value: "All Formats", 
                label: "Export Options", 
                description: "GLB, FBX, OBJ, STL, and more supported",
                gradient: "from-purple-500 to-pink-500", 
                icon: "📦",
                color: "purple"
              }
          ].map((stat, index) => (
              <div 
              key={index}
                className="relative group"
              >
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl" />
                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/10" />
                
                {/* Content */}
                <div className="relative z-10 p-8 text-center">
                  {/* Icon */}
                  <div className="text-6xl mb-6">
                    {stat.icon}
                  </div>
                  
                  {/* Value */}
                  <div 
                    className={`text-4xl font-display font-bold mb-4 text-white`}
                    style={{ 
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                      WebkitTextStroke: "0.5px rgba(0, 0, 0, 0.3)"
                    }}
              >
                {stat.value}
                  </div>
                  
                  {/* Label */}
                  <h4 
                    className="text-xl font-display font-bold mb-3 text-white drop-shadow-lg"
                    style={{ 
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                      WebkitTextStroke: "0.5px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    {stat.label}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-white/80 leading-relaxed text-sm">
                    {stat.description}
                  </p>
                  
                  {/* Decorative Element */}
                  <div className={`w-16 h-1 bg-gradient-to-r ${stat.gradient} rounded-full mx-auto mt-6`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};