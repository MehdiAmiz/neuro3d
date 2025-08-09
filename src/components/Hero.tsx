import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Upload, CreditCard, Coins } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-3d-transformation.jpg";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const Hero = () => {
  const ref = useRef(null);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      ref={ref}
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30"
        style={{ y }}
      />
      
      {/* Glassmorphism floating elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 glass rounded-full blur-xl"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]) }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-48 h-48 glass rounded-full blur-xl"
        animate={{ 
          y: [0, 20, 0],
          rotate: [360, 180, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
      />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center lg:text-left">
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-primary/20 mb-6 neon-glow"
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm text-foreground/80">AI-Powered 2D to 3D Conversion</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              variants={itemVariants}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="block">
                Convert
              </div>
              <div className="block">
                <motion.span 
                  className="bg-gradient-neural bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                >
                  2D Images
                </motion.span>
              </div>
              <div className="block">
                Into Stunning
              </div>
              <div className="block">
                <motion.span 
                  className="bg-gradient-primary bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 0.5
                  }}
                  style={{ backgroundSize: "200% 100%" }}
                >
                  3D Models
                </motion.span>
              </div>
            </motion.h1>
            
            <p className="text-xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              NexodusAI uses advanced AI to transform your 2D images into detailed 3D models in seconds.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/app">
                  <Button variant="glow" size="lg" className="group glass-card neon-glow text-xl">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Image
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="group glass-card text-xl"
                  onClick={() => setIsCreditsOpen(true)}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Get Credits
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-sm text-foreground/60"
              variants={itemVariants}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                "No 3D experience needed",
                "Export ready files", 
                "Commercial license"
              ].map((text, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.2 }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full mr-2 neon-glow" />
                  {text}
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            className="relative hidden md:block"
            variants={itemVariants}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-neural rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <motion.img
                src={heroImage}
                alt="2D to 3D Transformation with NexodusAI"
                className="relative z-10 w-full h-auto rounded-2xl shadow-neural border border-primary/20 glass-card"
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  duration: 1,
                  delay: 0.8
                }}
                whileHover={{ 
                  rotateY: 5,
                  rotateX: 2,
                  transition: { duration: 0.3 }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-2xl" />
            </motion.div>
            
            {/* Glassmorphism floating UI Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 glass-card backdrop-blur-sm border border-primary/20 rounded-lg p-3 neon-glow"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: [0, -10, 0], 
                scale: 1 
              }}
              transition={{ 
                opacity: { delay: 1.2, duration: 0.5 },
                scale: { delay: 1.2, duration: 0.5 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <div className="text-xs text-foreground/60">Processing</div>
              <motion.div 
                className="text-sm font-semibold text-primary"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                98% Complete
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 glass-card backdrop-blur-sm border border-accent/20 rounded-lg p-3 neon-glow-cyan"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: [0, 10, 0], 
                scale: 1 
              }}
              transition={{ 
                opacity: { delay: 1.4, duration: 0.5 },
                scale: { delay: 1.4, duration: 0.5 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }
              }}
              whileHover={{ scale: 1.1, y: 5 }}
            >
              <div className="text-xs text-foreground/60">Quality</div>
              <motion.div 
                className="text-sm font-semibold text-accent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              >
                Ultra HD
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Get Credits Dialog */}
      <Dialog open={isCreditsOpen} onOpenChange={setIsCreditsOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">Buy Credits</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose a credit package to continue using our services.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { 
                name: "Starter",
                credits: 3000, 
                price: 14, 
                popular: false,
                shopifyId: '42665373925454'
              },
              { 
                name: "Professional",
                credits: 5000, 
                price: 20, 
                popular: true,
                shopifyId: '42665410035790'
              },
              { 
                name: "Enterprise",
                credits: 20000, 
                price: 50, 
                popular: false,
                shopifyId: '42665416851534'
              }
            ].map((pkg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  pkg.popular 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
                onClick={async () => {
                  if (!user || !user.email) {
                    toast({
                      title: "Please sign in",
                      description: "Log in to purchase credits.",
                      variant: "destructive"
                    });
                    return;
                  }
                  try {
                    setIsLoading(true);
                    const checkoutUrl = `https://neuro3d.myshopify.com/cart/${pkg.shopifyId}:1?attributes[userId]=${user.id}&attributes[credits]=${pkg.credits}`;
                    window.location.href = checkoutUrl;
                  } catch (err) {
                    console.error('Error creating checkout:', err);
                    toast({ title: 'Error', description: 'Failed to create checkout. Please try again.', variant: 'destructive' });
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground font-semibold">{pkg.name} Pack</span>
                      {pkg.popular && (
                        <Badge className="bg-purple-600 text-white text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">${pkg.price} - {pkg.credits.toLocaleString()} Credits</p>
                  </div>
                  <Coins className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              onClick={() => setIsCreditsOpen(false)}
              className="w-full glass-card"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};