import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, Home, AppWindow } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "./Logo";

interface HeaderProps {
  isAppPage?: boolean;
}

export const Header = ({ isAppPage = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Check if we're on the App page or Profile page
  const isOnAppPage = isAppPage || location.pathname === '/app';
  const isOnProfilePage = location.pathname === '/profile';
  const shouldShowMobileMenu = true; // Always show mobile menu on mobile devices

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <motion.header 
      className="fixed top-0 w-full z-50 glass border-b border-white/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Logo />
            <Link to="/" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              NexodusAI
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {!isOnAppPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#hero" className="text-foreground/80 hover:text-foreground transition-colors">
                Home
              </a>
              <Link to="/app" className="text-foreground/80 hover:text-foreground transition-colors">
                App
              </Link>
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#reviews" className="text-foreground/80 hover:text-foreground transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-foreground/80 hover:text-foreground transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  className="flex items-center space-x-2 glass-card px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">{user?.name}</span>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl border border-white/20 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b border-white/10">
                        <p className="text-foreground font-medium">{user?.name}</p>
                        <p className="text-foreground/60 text-sm">{user?.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button 
                  variant="ghost" 
                  className="glass-card"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Link to="/app">
                <Button variant="neural" className="glass-card neon-glow">Start Converting</Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          {shouldShowMobileMenu && (
            <motion.button
              className="md:hidden bg-white/10 hover:bg-white/20 p-2 rounded-lg border border-white/20 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>

        {/* Mobile Navigation */}
        {shouldShowMobileMenu && (
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav 
                className="md:hidden mt-4 pb-4 border-t border-white/20 bg-black/40 backdrop-blur-md rounded-lg border border-white/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex flex-col space-y-4 pt-4 px-4">
                  {/* Show full navigation only on homepage */}
                  {!isOnAppPage && !isOnProfilePage && [
                    { href: "#hero", label: "Home", isLink: false },
                    { href: "/app", label: "App", isLink: true },
                    { href: "#features", label: "Features", isLink: false },
                    { href: "#pricing", label: "Pricing", isLink: false },
                    { href: "#reviews", label: "Reviews", isLink: false },
                    { href: "#faq", label: "FAQ", isLink: false },
                    { href: "#contact", label: "Contact", isLink: false }
                  ].map((link, index) => (
                    link.isLink ? (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="text-white hover:text-blue-300 transition-colors py-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <motion.a 
                        key={link.href}
                        href={link.href} 
                        className="text-white hover:text-blue-300 transition-colors py-2 font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </motion.a>
                    )
                  ))}
                  
                  {/* Simplified menu for App and Profile pages */}
                  {(isOnAppPage || isOnProfilePage) && (
                    <div className="space-y-3">
                      <Link 
                        to="/" 
                        className="flex items-center space-x-3 text-white hover:text-blue-300 transition-colors py-3 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Home className="w-5 h-5" />
                        <span>Home</span>
                      </Link>
                      
                      {isOnAppPage ? (
                        <Link 
                          to="/profile" 
                          className="flex items-center space-x-3 text-white hover:text-blue-300 transition-colors py-3 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                      ) : (
                        <Link 
                          to="/app" 
                          className="flex items-center space-x-3 text-white hover:text-blue-300 transition-colors py-3 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <AppWindow className="w-5 h-5" />
                          <span>App</span>
                        </Link>
                      )}
                      
                      {isAuthenticated && (
                        <Button 
                          variant="ghost" 
                          className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full justify-start"
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {/* Show user info and additional options only on homepage */}
                  {!isOnAppPage && !isOnProfilePage && (
                    <div className="flex flex-col space-y-2 pt-4">
                      {isAuthenticated ? (
                        <>
                          <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{user?.name}</p>
                              <p className="text-gray-300 text-xs">{user?.email}</p>
                            </div>
                          </div>
                          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Profile
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          onClick={() => {
                            setIsAuthModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                      )}
                      <Link to="/app" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="neural" className="glass-card neon-glow w-full">Start Converting</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </motion.header>
  );
};