import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

// Status Bar Component for iOS
const StatusBarArea = () => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  if (!isIOS) return null;

  return (
    <div 
      className="status-bar-area"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    />
  );
};

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Static gradient background - removed animation for mobile performance */}
    <div className="absolute inset-0 bg-gradient-cyber opacity-20" />
    
    {/* Removed floating particles for mobile performance */}
    
    {/* Simplified glassmorphism orbs - reduced animation complexity */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glass rounded-full blur-3xl opacity-30" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-neon rounded-full blur-3xl opacity-20" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StatusBarArea />
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
