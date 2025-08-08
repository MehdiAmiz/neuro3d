import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Shield, Zap, Users, Brain, Lock } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const faqs = [
  {
    question: "What exactly does this tool do?",
    answer: "Our tool converts your 2D images into stunning, lifelike 3D models and videos. It automatically removes the background from your image, generates a 3D video preview that shows exactly how your final object will look, and then allows you to create a high-quality GLB file for download.",
    icon: Zap,
    category: "tool"
  },
  {
    question: "Who is this tool designed for?",
    answer: "Our platform is perfect for designers, architects, digital artists, game developers, and anyone curious about 3D design—even if you have no experience with complex software like Blender. It empowers creative professionals and enthusiasts to produce professional-grade 3D assets quickly and easily.",
    icon: Users,
    category: "audience"
  },
  {
    question: "How does the credit system work?",
    answer: "Each time you generate a 3D video or convert an image into a GLB file, a predetermined number of credits are deducted from your account. If you enjoy the tool and need more conversions, you can purchase additional credit bundles that suit your usage.",
    icon: HelpCircle,
    category: "credits"
  },
  {
    question: "How accurate is the conversion process?",
    answer: "Our tool leverages the latest and most advanced AI models to ensure that every detail of your 2D image is faithfully reproduced in 3D. The 3D video preview allows you to verify the output before finalizing the conversion, so you can be confident in the result.",
    icon: Brain,
    category: "accuracy"
  },
  {
    question: "Do I need any specialized skills to use this tool?",
    answer: "Not at all! Our user-friendly interface is designed for professionals and beginners alike. You don't need to know 3D modeling software—just upload your image, and our AI takes care of the rest.",
    icon: Zap,
    category: "ease"
  },
  {
    question: "Is my data secure when I use this tool?",
    answer: "Absolutely. We take data privacy and security very seriously. Your images and personal information are processed securely, and we ensure that all conversions are performed with the highest standards of data protection.",
    icon: Shield,
    category: "security"
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto"
    }
  };

  return (
    <motion.section 
      ref={ref}
      id="faq" 
      className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
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
            <HelpCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Everything you need to know about NexodusAI. Can't find what you're looking for?
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <motion.div 
          className="max-w-4xl mx-auto space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="glass-card border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(var(--primary), 0.1)"
                }}
                layout
              >
                {/* Question Header */}
                <motion.button
                  className="w-full p-6 text-left flex items-center justify-between group"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        boxShadow: "0 0 20px rgba(var(--primary), 0.6)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <faq.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <motion.div
                    className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                    animate={{ 
                      rotate: openIndex === index ? 180 : 0,
                      scale: openIndex === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <ChevronDown className="w-5 h-5 text-foreground" />
                  </motion.div>
                </motion.button>

                {/* Answer Content */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className="overflow-hidden"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-primary/10">
                          <p className="text-foreground/80 leading-relaxed text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="glass-card p-8 rounded-2xl border-primary/10 max-w-2xl mx-auto">
            <motion.div 
              className="w-16 h-16 bg-gradient-neural rounded-full flex items-center justify-center mx-auto mb-6 neon-glow"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-xl font-bold mb-4 text-foreground">
              Still have questions?
            </h3>
            <p className="text-foreground/70">
              Our support team is here to help you get the most out of NexodusAI.
            </p>
            
            <motion.button
              className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-neural transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(var(--primary), 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}; 