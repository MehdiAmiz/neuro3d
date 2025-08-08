import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Index from "./pages/Index";
import { App as AppPage } from "./pages/App";
import Profile from "./pages/Profile";
import { Checkout } from "./pages/Checkout";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { CheckoutCancel } from "./pages/CheckoutCancel";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { AdminDashboard, AdminUsers, AdminCreditPacks } from "./pages/admin";

const queryClient = new QueryClient();

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Animated gradient background */}
    <motion.div 
      className="absolute inset-0 bg-gradient-cyber opacity-20"
      animate={{ 
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      style={{ backgroundSize: "400% 400%" }}
    />
    
    {/* Floating particles */}
    <div className="particles-bg">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`
          }}
        />
      ))}
    </div>
    
    {/* Glassmorphism orbs */}
    <motion.div 
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glass rounded-full blur-3xl opacity-30"
      animate={{ 
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 15, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
    <motion.div 
      className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-neon rounded-full blur-3xl opacity-20"
      animate={{ 
        y: [0, 40, 0],
        scale: [1, 0.8, 1],
        rotate: [360, 180, 0]
      }}
      transition={{ 
        duration: 18, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: 3
      }}
    />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AnimatedBackground />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="credit-packs" element={<AdminCreditPacks />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
