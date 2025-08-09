import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api-client';
import { shopifyService } from '@/lib/shopify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Mail, User, Edit, Save, X, LogOut, Shield, Clock, CreditCard, Coins, Lock, Eye, EyeOff, ShoppingCart, Settings, Home, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Profile: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Credits from user data - use actual user credits, not a fallback
  const [credits, setCredits] = useState(user?.credits ?? 0);

  // Update credits when user data changes
  useEffect(() => {
    if (user?.credits !== undefined) {
      setCredits(user.credits);
    }
  }, [user?.credits]);

  // Refresh user from API on mount to avoid stale localStorage values
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh on window focus and periodically while on the profile page
  useEffect(() => {
    const handleFocus = () => {
      refreshUser();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshUser();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    const intervalId = window.setInterval(() => {
      refreshUser();
    }, 10000); // refresh every 10s

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(intervalId);
    };
  }, [refreshUser]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAppPage={true} />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md glass-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Not Authenticated</h2>
                <p className="text-muted-foreground mb-4">
                  Please log in to view your profile.
                </p>
                <Button onClick={() => window.location.href = '/'} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user.name,
      email: user.email
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, {
        name: String(formData.name ?? '').trim(),
        email: String(formData.email ?? '').trim(),
      });
      
      // Update user data in localStorage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
      // Refresh the user context without full reload
      await refreshUser();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    setIsLoading(true);
    try {
      // Update password in database
      await userService.changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    window.location.href = '/';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAppPage={true} />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Profile{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Manage your account, credits, and settings with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Sidebar - User Info */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass-card sticky top-8">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                    </div>

                    {/* Credits Display */}
                    <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-lg p-4 mb-6 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Credits Balance</span>
                        <Coins className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-3">{credits}</div>
                      <Button 
                        onClick={() => setShowBuyCreditsDialog(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Credits
                      </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Account Age</span>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                          {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Status</span>
                        <Badge className="bg-green-500/20 text-green-300">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 glass-card">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">Profile</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">Security</TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">Activity</TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="mt-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl text-foreground">Personal Information</CardTitle>
                            <CardDescription className="text-muted-foreground">
                              Update your profile information
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            {!isEditing ? (
                              <Button onClick={handleEdit} variant="outline" size="sm" className="glass-card">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  onClick={handleSave} 
                                  disabled={isLoading}
                                  size="sm"
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  {isLoading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button onClick={handleCancel} variant="outline" size="sm" className="glass-card">
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Full Name</Label>
                            {isEditing ? (
                              <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="glass-card border-white/20"
                                placeholder="Enter your full name"
                              />
                            ) : (
                              <div className="flex items-center space-x-3 p-4 glass-card rounded-lg">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <span className="text-foreground">{user.name}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Email Address</Label>
                            {isEditing ? (
                              <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="glass-card border-white/20"
                                placeholder="Enter your email"
                              />
                            ) : (
                              <div className="flex items-center space-x-3 p-4 glass-card rounded-lg">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span className="text-foreground">{user.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator className="bg-white/20" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">User ID</Label>
                            <div className="flex items-center space-x-3 p-4 glass-card rounded-lg">
                              <Shield className="h-5 w-5 text-muted-foreground" />
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                                {user.id}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Member Since</Label>
                            <div className="flex items-center space-x-3 p-4 glass-card rounded-lg">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <span className="text-foreground">{formatDate(user.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Security Tab */}
                  <TabsContent value="security" className="mt-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="text-2xl text-foreground">Security Settings</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Manage your account security
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="text-foreground font-medium">Password</h3>
                              <p className="text-muted-foreground text-sm">Last changed: {formatDate(user.updatedAt)}</p>
                            </div>
                          </div>
                          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="glass-card">
                                Change Password
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card">
                              <DialogHeader>
                                <DialogTitle className="text-foreground">Change Password</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Enter your current password and choose a new one.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Current Password</Label>
                                  <div className="relative">
                                    <Input
                                      type={showCurrentPassword ? "text" : "password"}
                                      value={passwordData.currentPassword}
                                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                      className="glass-card border-white/20 pr-10"
                                      placeholder="Enter current password"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">New Password</Label>
                                  <div className="relative">
                                    <Input
                                      type={showNewPassword ? "text" : "password"}
                                      value={passwordData.newPassword}
                                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                      className="glass-card border-white/20 pr-10"
                                      placeholder="Enter new password"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Confirm New Password</Label>
                                  <div className="relative">
                                    <Input
                                      type={showConfirmPassword ? "text" : "password"}
                                      value={passwordData.confirmPassword}
                                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                      className="glass-card border-white/20 pr-10"
                                      placeholder="Confirm new password"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    onClick={handlePasswordChange}
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                  >
                                    {isLoading ? 'Changing...' : 'Change Password'}
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setShowPasswordDialog(false)}
                                    className="flex-1 glass-card"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="mt-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="text-2xl text-foreground">Recent Activity</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Your recent account activity
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 glass-card rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-foreground">Profile updated</p>
                              <p className="text-muted-foreground text-sm">{formatDate(user.updatedAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 glass-card rounded-lg">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-foreground">Account created</p>
                              <p className="text-muted-foreground text-sm">{formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>

          {/* Buy Credits Dialog */}
          <Dialog open={showBuyCreditsDialog} onOpenChange={setShowBuyCreditsDialog}>
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
                ].map((package_, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      package_.popular 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={async () => {
                      if (!user || !user.email) {
                        toast({
                          title: "Error",
                          description: "Please log in to purchase credits.",
                          variant: "destructive"
                        });
                        return;
                      }

                      try {
                        setIsLoading(true);
                        
                        // Create Shopify checkout URL with user attributes
                        const checkoutUrl = `https://neuro3d.myshopify.com/cart/${package_.shopifyId}:1?attributes[userId]=${user.id}&attributes[credits]=${package_.credits}`;
                        
                        // Redirect to Shopify checkout
                        window.location.href = checkoutUrl;
                        
                      } catch (error) {
                        console.error('Error creating checkout:', error);
                        toast({
                          title: "Error",
                          description: "Failed to create checkout. Please try again.",
                          variant: "destructive"
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-foreground font-semibold">{package_.name} Pack</span>
                          {package_.popular && (
                            <Badge className="bg-purple-600 text-white text-xs">Popular</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">${package_.price} - {package_.credits.toLocaleString()} Credits</p>
                      </div>
                      <Coins className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => setShowBuyCreditsDialog(false)}
                  className="w-full glass-card"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile; 