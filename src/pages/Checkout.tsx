import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Zap,
  Star,
  Users,
  Clock,
  Wallet
} from 'lucide-react';
import { shopifyService } from '@/services/shopifyService';

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  bonus?: string;
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    credits: 3000,
    price: 14,
    bonus: 'Perfect for small projects and testing'
  },
  {
    id: 'professional',
    credits: 5000,
    price: 20,
    popular: true,
    bonus: 'For professionals and regular users'
  },
  {
    id: 'enterprise',
    credits: 20000,
    price: 50,
    bonus: 'For large projects and teams'
  }
];

export const Checkout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage>(creditPackages[1]); // Default to professional
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create Shopify checkout session
      const checkoutSession = await shopifyService.createCheckoutSession({
        packageId: selectedPackage.id,
        credits: selectedPackage.credits,
        price: selectedPackage.price,
        userId: user.id,
        customerEmail: user.email,
      });

      // Store order details in localStorage for processing after payment
      localStorage.setItem('shopify_order', JSON.stringify({
        packageId: selectedPackage.id,
        credits: selectedPackage.credits,
        price: selectedPackage.price,
        userId: user.id,
        customerEmail: user.email,
      }));

      // Redirect to Shopify checkout
      window.location.href = checkoutSession.checkout_url;

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <Header isAppPage={true} />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Get More Credits
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Unlock unlimited 3D transformations with our premium credit packages
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Credit Packages */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Choose Your Package</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {creditPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    >
                      <Card 
                        className={`glass-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedPackage.id === pkg.id 
                            ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
                            : 'hover:bg-white/5'
                        }`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <CardHeader className="text-center pb-4">
                          {pkg.popular && (
                            <Badge className="w-fit mx-auto mb-2 bg-gradient-to-r from-orange-500 to-red-500">
                              Most Popular
                            </Badge>
                          )}
                                                     <CardTitle className="text-2xl font-bold text-foreground">
                             {pkg.credits.toLocaleString()} Credits
                           </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {pkg.bonus}
                          </CardDescription>
                        </CardHeader>
                                                 <CardContent className="text-center">
                           <div className="mb-4">
                             <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                           </div>
                           <div className="text-sm text-muted-foreground">
                             ${(pkg.price / pkg.credits * 1000).toFixed(2)} per 1,000 credits
                           </div>
                         </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8"
              >
                <h3 className="text-xl font-bold text-foreground mb-4">What You Get</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-foreground">Instant credit delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-foreground">Credits never expire</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span className="text-foreground">Priority customer support</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="glass-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div className="space-y-3">
                                         <div className="flex justify-between items-center">
                       <span className="text-muted-foreground">Package:</span>
                       <span className="text-foreground font-medium">{selectedPackage.credits.toLocaleString()} Credits</span>
                     </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="text-foreground font-medium">${selectedPackage.price}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-foreground">Total:</span>
                      <span className="text-foreground">${selectedPackage.price}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Payment Method</h4>
                    
                    {/* Shopify Payments */}
                    <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-500/10">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-medium text-foreground">Shopify Payments</div>
                          <div className="text-sm text-muted-foreground">Secure payment with PayPal, credit cards, and more</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  {/* Pay Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Redirecting to Shopify...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Pay ${selectedPackage.price} with Shopify
                      </>
                    )}
                  </Button>

                  {/* Back to App */}
                  <Button
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to App
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">What Our Users Say</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Johnson",
                  role: "3D Artist",
                  content: "The credit system is perfect! I can generate unlimited 3D models for my projects.",
                  rating: 5
                },
                {
                  name: "Mike Chen",
                  role: "Game Developer",
                  content: "Fast processing and high-quality results. The PayPal integration makes it so easy.",
                  rating: 5
                },
                {
                  name: "Emma Davis",
                  role: "Content Creator",
                  content: "Best investment for my creative workflow. The premium package is worth every penny!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}; 