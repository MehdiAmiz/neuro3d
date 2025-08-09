import { Card } from "@/components/ui/card";
import { Upload, Brain, Download, CheckCircle, Image, Settings, Eye, Video, Zap, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Import assets
import step1Image from "@/assets/how-it-works/step1-upload.png";
import step2Image from "@/assets/how-it-works/step2-upload.png";
import step3Video from "@/assets/how-it-works/step3-preview.mp4";
import step4Video from "@/assets/how-it-works/step4-glb.mp4";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Image",
    description: "Start by selecting and uploading a 2D image—whether it's a product photo, a character concept, or any design you want to bring to life. Our AI instantly analyzes the image and automatically removes the background to ensure a clean and seamless 3D transformation. This step ensures that the focus remains on your object without distractions.",
    step: "01",
    image: step1Image,
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
    image: step2Image,
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
    video: step3Video,
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
    video: step4Video,
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
          <div 
            className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl mb-8"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent"
          >
            How NexodusAI{" "}
            <span className="text-foreground">Works</span>
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
                <div 
                  className="absolute left-1/2 top-full w-0.5 h-24 bg-gradient-to-b from-primary/50 to-transparent z-0"
                />
              )}
              
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Media Section */}
                <div 
                  className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="relative group">
                    {/* Simplified Background Glow */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-3xl opacity-20 blur-2xl`}
                    />
                    
                    {/* Step Number Badge */}
                    <div 
                      className={`absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center z-30 neon-glow`}
                    >
                      <span className="text-white font-bold text-xl font-display">{step.step}</span>
                    </div>
                    
                    {/* Media Content */}
                    <div className="relative z-10">
                      {step.isVideo ? (
                        <video
                          src={step.video}
                          className="w-full h-auto rounded-3xl shadow-2xl border border-primary/20 glass-card"
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls={false}
                          onError={(e) => {
                            console.error('Video loading error:', e);
                          }}
                        />
                      ) : (
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="w-full h-auto rounded-3xl shadow-2xl border border-primary/20 glass-card"
                          onError={(e) => {
                            console.error('Image loading error:', e);
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Enhanced Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent rounded-3xl" />
                    
                    {/* Play Button for Videos */}
                    {step.isVideo && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center z-20"
                      >
                        <div 
                          className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 neon-glow"
                        >
                          <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content Section */}
                <div 
                  className={`text-center lg:text-left ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                >
                  <div className="relative p-10 rounded-3xl border border-primary/20 hover:border-primary/40 transition-all duration-500 group overflow-hidden">
                    {/* Enhanced Background Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent rounded-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-accent/5 rounded-3xl" />
                    <div className="absolute inset-0 backdrop-blur-xl bg-black/10 rounded-3xl" />
                    
                    {/* Content Container */}
                    <div className="relative z-10">
                      {/* Step Icon */}
                      <div 
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl mb-6 neon-glow`}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 
                        className="text-3xl lg:text-4xl font-display font-bold mb-6 text-foreground"
                      >
                        {step.title}
                      </h3>
                      
                      <p 
                        className="text-lg text-foreground/70 leading-relaxed"
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enhanced Stats Section */}
        <div className="text-center mt-32 mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Ideas?
          </h3>
          <p className="text-foreground/70 mb-6">
            Join thousands of creators who are already using NexodusAI to bring their 2D concepts to life in stunning 3D.
          </p>
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