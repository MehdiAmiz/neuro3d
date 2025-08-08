import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const reviews = [
  {
    name: "Mark T.",
    role: "3D Freelancer on Fiverr",
    content: "This tool has completely transformed my Fiverr workflow. I used to spend hours in Blender, but now I can deliver stunning 3D models in minutes. My clients are thrilled with the results, and I can confidently take on way more projects thanks to its speed and precision. Definitely Underpriced !",
    rating: 5,
    gradient: "from-blue-500 to-cyan-500",
    emoji: "🚀",
    delay: 0.1
  },
  {
    name: "Lexy",
    role: "3D Freelancer",
    content: "Selling my designs online has never been easier. The 2D-to-3D conversion is incredibly accurate, capturing every detail of my sketches. My portfolio now stands out, and my sales have significantly increased thanks to the quality and consistency of these 3D assets.",
    rating: 5,
    gradient: "from-purple-500 to-pink-500",
    emoji: "💎",
    delay: 0.2
  },
  {
    name: "Mathew",
    role: "3D Design Entrepreneur",
    content: "I had zero experience with complex 3D software like Blender, yet this tool allowed me to launch my own 3D design business. It turns my simple ideas into professional-quality models that I can sell online, proving that you don't need to be a technical expert to succeed in 3D design.",
    rating: 5,
    gradient: "from-green-500 to-emerald-500",
    emoji: "🎯",
    delay: 0.3
  }
];

export const Reviews = () => {
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
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.section 
      ref={ref}
      id="reviews" 
      className="py-24 relative overflow-hidden"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Simplified Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Simplified Icon */}
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
            <Star className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
            Customer{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Reviews
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            See what our users are saying about NexodusAI. Real stories from real people who have transformed their creative workflow.
          </p>
        </motion.div>
        
        {/* Reviews Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {reviews.map((review, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              transition={{ duration: 0.8, delay: review.delay }}
              className="group"
            >
              <div className="relative h-full">
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${review.gradient} rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl" />
                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/10" />
                
                {/* Animated Background Pattern */}
                <motion.div 
                  className="absolute inset-0 opacity-20"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                  }}
                  transition={{ 
                    duration: 25, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 0.5
                  }}
                  style={{
                    backgroundImage: `radial-gradient(circle at 30% 70%, ${review.gradient.split(' ')[1]} 0%, transparent 40%), radial-gradient(circle at 70% 30%, ${review.gradient.split(' ')[3]} 0%, transparent 40%)`,
                    backgroundSize: "150% 150%"
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Quote Icon */}
                  <motion.div 
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: review.delay + 0.2, duration: 0.6 }}
                  >
                    <Sparkles className="w-8 h-8 text-foreground/60" />
                    <motion.div 
                      className="text-4xl"
                      animate={{ 
                        y: [0, -8, 0],
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: index * 0.3
                      }}
                    >
                      {review.emoji}
                    </motion.div>
                  </motion.div>
                  
                  {/* Rating */}
                  <motion.div 
                    className="flex items-center mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: review.delay + 0.3, duration: 0.6 }}
                  >
                    {[...Array(review.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 text-yellow-400 fill-current" 
                      />
                    ))}
                  </motion.div>
                  
                  {/* Review Content */}
                  <motion.p 
                    className="text-foreground/80 leading-relaxed flex-grow mb-6 font-paragraph"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: review.delay + 0.4, duration: 0.6 }}
                  >
                    "{review.content}"
                  </motion.p>
                  
                  {/* Author Info */}
                  <motion.div 
                    className="mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: review.delay + 0.5, duration: 0.6 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${review.gradient} rounded-full flex items-center justify-center mr-4`}>
                        <span className="text-white font-bold text-lg">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-foreground">
                          {review.name}
                        </h4>
                        <p className="text-foreground/60 text-sm">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Decorative Element */}
                  <motion.div 
                    className={`w-16 h-1 bg-gradient-to-r ${review.gradient} rounded-full mt-6`}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: review.delay + 0.7, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="glass-card p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 neon-glow"
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
              <Star className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-display font-bold mb-4 text-foreground">
              Join Our Happy Customers
            </h3>
            <p className="text-foreground/70 mb-6">
              Start creating stunning 3D models and transform your creative workflow today.
            </p>
            
            <Link to="/app">
              <motion.button
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}; 