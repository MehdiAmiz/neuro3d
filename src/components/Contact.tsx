import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MessageSquare, Phone, MapPin, Send, Zap, Shield, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import emailjs from '@emailjs/browser';
import { emailConfig } from '@/config/email';

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get detailed responses within 24 hours",
    value: "support@nexodusai.com",
    gradient: "from-blue-500 to-cyan-500",
    emoji: "📧",
    delay: 0.1
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Instant help from our AI assistant",
    value: "Available 24/7 (Coming Soon)",
    gradient: "from-green-500 to-emerald-500",
    emoji: "💬",
    delay: 0.2
  },
  {
    icon: Phone,
    title: "Priority Support",
    description: "Direct line for enterprise customers",
    value: "+1 (555) 123-4567",
    gradient: "from-purple-500 to-pink-500",
    emoji: "📞",
    delay: 0.3
  }
];

const features = [
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Secure Communication",
    description: "End-to-end encrypted messages",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: Zap,
    title: "Instant Response",
    description: "AI-powered quick solutions",
    gradient: "from-red-500 to-pink-500"
  }
];

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Initialize EmailJS with your public key
      emailjs.init(emailConfig.publicKey);

      const templateParams = {
        to_email: emailConfig.toEmail,
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      };

      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams
      );

      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section 
      ref={ref}
      id="contact" 
      className="py-24 relative overflow-hidden"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Mobile: No animations */}
        <div className="text-center mb-16 md:hidden">
          <div 
            className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl mb-8"
          >
            <MessageSquare className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Have questions about NexodusAI? Our support team is here to help you succeed with your 3D modeling projects.
          </p>
        </div>

        {/* Desktop: Keep animations */}
        <motion.div 
          className="text-center mb-16 hidden md:block"
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
            <MessageSquare className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
            Have questions about NexodusAI? Our support team is here to help you succeed with your 3D modeling projects.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Mobile: No animations */}
          <div className="relative md:hidden">
            <div className="relative">
              {/* Form Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl" />
              <div className="absolute inset-0 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/10" />
              
              {/* Form Content */}
              <div className="relative z-10 p-8">
                <h3 
                  className="text-2xl font-display font-bold mb-6 text-foreground"
                >
                  Send us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        required
                      />
                    </div>
                    
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email"
                        className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject"
                      className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      rows={6}
                      className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Desktop: Keep animations */}
          <motion.div 
            className="relative hidden md:block"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <div className="relative">
              {/* Form Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl" />
              <div className="absolute inset-0 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/10" />
              
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
                  backgroundImage: `radial-gradient(circle at 30% 70%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 70% 30%, #8b5cf6 0%, transparent 40%)`,
                  backgroundSize: "150% 150%"
                }}
              />
              
              {/* Form Content */}
              <div className="relative z-10 p-8">
                <motion.h3 
                  className="text-2xl font-display font-bold mb-6 text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  Send us a Message
                </motion.h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    className="grid md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        required
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                      />
                    </div>
                    
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email"
                        className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        required
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject"
                      className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                  >
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      rows={6}
                      className="relative z-10 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                      required
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Methods */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {contactMethods.map((method, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                transition={{ duration: 0.8, delay: method.delay }}
                className="group"
              >
                <div className="relative">
                  {/* Card Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl" />
                  <div className="absolute inset-0 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/10" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-foreground mb-2">
                        {method.title}
                      </h4>
                      <p className="text-foreground/70 mb-1">
                        {method.description}
                      </p>
                      <p className="text-foreground/90 font-medium">
                        {method.value}
                      </p>
                    </div>
                    
                    <div className="text-4xl">
                      {method.emoji}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 