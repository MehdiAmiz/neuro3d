import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "Github" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  const footerLinks = [
    {
      title: "Product",
      links: [
        { href: "#", label: "Features" },
        { href: "#", label: "Pricing" },
        { href: "#", label: "API" },
        { href: "#", label: "Integrations" },
        { href: "#", label: "Changelog" }
      ]
    },
    {
      title: "Resources",
      links: [
        { href: "#", label: "Documentation" },
        { href: "#", label: "Tutorials" },
        { href: "#", label: "Blog" },
        { href: "#", label: "Community" },
        { href: "#", label: "Support" }
      ]
    },
    {
      title: "Company",
      links: [
        { href: "#", label: "About" },
        { href: "#", label: "Careers" },
        { href: "#", label: "Press" },
        { href: "#", label: "Privacy" },
        { href: "#", label: "Terms" }
      ]
    }
  ];

  return (
    <motion.footer 
      className="bg-gradient-to-t from-muted/20 to-background border-t border-white/20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Glassmorphism background elements */}
      <motion.div 
        className="absolute top-0 left-1/4 w-64 h-64 glass rounded-full blur-3xl opacity-10"
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-96 h-96 glass rounded-full blur-3xl opacity-10"
        animate={{ 
          y: [0, 30, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex items-center space-x-2 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-neural rounded-lg neon-glow"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DimenXioner
              </span>
            </motion.div>
            <p className="text-foreground/70 mb-6 max-w-sm">
              Advanced AI-powered 2D to 3D conversion tool. Transform your images into stunning 3D models 
              with professional quality and commercial licensing.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="glass-card hover:neon-glow"
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-3 text-foreground/70">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <a 
                      href={link.href} 
                      className="hover:text-primary transition-colors relative group"
                    >
                      {link.label}
                      <motion.div 
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-foreground/60 text-sm">
            © 2024 DimenXioner. All rights reserved.
          </p>
          <motion.p 
            className="text-foreground/60 text-sm mt-4 md:mt-0"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ 
              backgroundSize: "200% 100%",
              backgroundImage: "linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Made with ❤️ for creators worldwide
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};