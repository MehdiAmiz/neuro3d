import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Play, 
  Download, 
  Box, 
  Video, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  FileImage,
  Zap,
  Eye,
  LogIn,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProcessingState {
  preview: 'idle' | 'processing' | 'completed' | 'error';
  model: 'idle' | 'processing' | 'completed' | 'error';
}

export const App = () => {
  const { user, login, register } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    preview: 'idle',
    model: 'idle'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showServerErrorDialog, setShowServerErrorDialog] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (!user) {
        setShowAuthDialog(true);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessingState({ preview: 'idle', model: 'idle' });
      setShowPreview(false);
      setShowModel(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (!user) {
        setShowAuthDialog(true);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessingState({ preview: 'idle', model: 'idle' });
      setShowPreview(false);
      setShowModel(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const generate3DPreview = async () => {
    if (!selectedFile) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate content.",
        variant: "destructive",
      });
      return;
    }

    if (user.credits < 50) {
      setShowCreditsDialog(true);
      return;
    }

    try {
      // Only start processing; do NOT deduct credits until a successful result
      setProcessingState(prev => ({ ...prev, preview: 'processing' }));
      
      // Simulate API call with 10 second loading → ends in error dialog
      setTimeout(() => {
        // Error path: DO NOT deduct credits
        setProcessingState(prev => ({ ...prev, preview: 'error' }));
        setShowServerErrorDialog(true);
      }, 10000);
    } catch (error) {
      setProcessingState(prev => ({ ...prev, preview: 'error' }));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generate3DModel = async () => {
    console.log('generate3DModel called', { selectedFile: !!selectedFile, user: !!user, credits: user?.credits });
    if (!selectedFile) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate content.",
        variant: "destructive",
      });
      return;
    }

    if (user.credits < 50) {
      setShowCreditsDialog(true);
      return;
    }

    try {
      // Start processing without deducting credits yet
      setProcessingState(prev => ({ ...prev, model: 'processing' }));
      
      // Simulate API call
      setTimeout(async () => {
        try {
          // Success path: Deduct credits now
          await userService.deduct3DModelCredits(user.id);
          setProcessingState(prev => ({ ...prev, model: 'completed' }));
          setShowModel(true);
          
          toast({
            title: "3D Model Generated",
            description: "Your 3D model has been generated successfully!",
          });
        } catch (deductError) {
          setProcessingState(prev => ({ ...prev, model: 'error' }));
          toast({
            title: "Error",
            description: deductError instanceof Error ? deductError.message : "Failed to deduct credits.",
            variant: "destructive",
          });
        }
      }, 5000);
    } catch (error) {
      setProcessingState(prev => ({ ...prev, model: 'error' }));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate 3D model. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadModel = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = '3d-model.glb';
    link.click();
  };

  const handleLogin = async () => {
    if (!authData.email || !authData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthLoading(true);
    try {
      await login(authData.email, authData.password);
      setShowAuthDialog(false);
      setAuthData({ name: '', email: '', password: '', confirmPassword: '' });
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!authData.name || !authData.email || !authData.password || !authData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (authData.password !== authData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (authData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthLoading(true);
    try {
      await register(authData.name, authData.email, authData.password);
      setShowAuthDialog(false);
      setAuthData({ name: '', email: '', password: '', confirmPassword: '' });
      toast({
        title: "Success",
        description: "Successfully registered! Welcome to DimenXioner Studio.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const getStatusIcon = (status: 'idle' | 'processing' | 'completed' | 'error') => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: 'idle' | 'processing' | 'completed' | 'error') => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAppPage={true} />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            DimenXioner{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Studio
            </span>
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Transform your 2D images into stunning 3D models and videos with AI-powered precision.
          </p>
          
          {/* Credit Display */}
          {user && (
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-foreground/60">Available Credits</p>
                    <p className="text-2xl font-bold text-foreground">{user.credits}</p>
                    <p className="text-xs text-foreground/40">50 credits per generation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Upload and Controls */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* File Upload Area */}
            <div className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Upload Image</h2>
              
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  selectedFile 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-white/20 overflow-hidden mx-auto">
                      <img 
                        src={previewUrl} 
                        alt="Uploaded preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-foreground/60">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white/60" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">Drop your image here</p>
                      <p className="text-sm text-foreground/60">or click to browse</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Generate</h2>
              
              <div className="space-y-4">
                {/* 3D Preview Button */}
                <div className="space-y-2">
                  <Button
                    onClick={generate3DPreview}
                    disabled={!selectedFile || processingState.preview === 'processing'}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {getStatusIcon(processingState.preview)}
                      <Video className="w-5 h-5" />
                      <span>Generate 3D Preview</span>
                    </div>
                  </Button>
                  <p className="text-sm text-foreground/60 text-center">
                    {getStatusText(processingState.preview)}
                  </p>
                </div>

                {/* 3D Model Button */}
                <div className="space-y-2">
                  <Button
                    onClick={generate3DModel}
                    disabled={!selectedFile || processingState.model === 'processing'}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {getStatusIcon(processingState.model)}
                      <Box className="w-5 h-5" />
                      <span>Generate 3D Model</span>
                    </div>
                  </Button>
                  <p className="text-sm text-foreground/60 text-center">
                    {getStatusText(processingState.model)}
                  </p>
                </div>

                {/* Download Button */}
                <AnimatePresence>
                  {processingState.model === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-2"
                    >
                      <Button
                        onClick={downloadModel}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <Download className="w-5 h-5" />
                          <span>Download 3D Model</span>
                        </div>
                      </Button>
                      <p className="text-sm text-foreground/60 text-center">
                        Download as GLB file
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Display Areas */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* 3D Preview Display */}
            <div className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">3D Preview</h2>
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-foreground/60">Video</span>
                </div>
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/20 flex items-center justify-center">
                {showPreview ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Play className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-foreground/80">3D Preview Video</p>
                    <p className="text-sm text-foreground/60">Click to play</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                      <Eye className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-foreground/60">Generate 3D preview to see the result</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3D Model Display */}
            <div className="bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">3D Model</h2>
                <div className="flex items-center space-x-2">
                  <Box className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-foreground/60">Model</span>
                </div>
              </div>
              
              <div className="aspect-square bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl border border-white/20 flex items-center justify-center">
                {showModel ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Box className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="text-foreground/80">3D Model Viewer</p>
                    <p className="text-sm text-foreground/60">Interactive 3D model</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                      <Box className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-foreground/60">Generate 3D model to view here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground text-center">Welcome to DimenXioner Studio</DialogTitle>
            <DialogDescription className="text-muted-foreground text-center">
              Sign in or create an account to start generating amazing 3D content
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card">
              <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  className="glass-card border-white/20"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  className="glass-card border-white/20"
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                onClick={handleLogin}
                disabled={isAuthLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Name</Label>
                <Input
                  value={authData.name}
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                  className="glass-card border-white/20"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  className="glass-card border-white/20"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  className="glass-card border-white/20"
                  placeholder="Enter your password"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Confirm Password</Label>
                <Input
                  type="password"
                  value={authData.confirmPassword}
                  onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                  className="glass-card border-white/20"
                  placeholder="Confirm your password"
                />
              </div>
              <Button 
                onClick={handleRegister}
                disabled={isAuthLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Insufficient Credits Dialog */}
<Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
  <DialogContent className="glass-card max-w-md">
    <DialogHeader>
      <DialogTitle className="text-2xl text-foreground text-center">Insufficient Credits</DialogTitle>
      <DialogDescription className="text-muted-foreground text-center">
        You need at least 50 credits to generate content.<br />
        Current balance: {user?.credits ?? 0} credits
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-col items-center gap-4 mt-4">
      <Button
        onClick={() => { setShowCreditsDialog(false); window.location.href = '/checkout'; }}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
      >
        Buy Credits
      </Button>
    </div>
  </DialogContent>
</Dialog>

{/* Server Error Dialog */}
<Dialog open={showServerErrorDialog} onOpenChange={setShowServerErrorDialog}>
  <DialogContent className="glass-card max-w-md">
    <DialogHeader>
      <DialogTitle className="text-2xl text-foreground text-center">Server Error</DialogTitle>
      <DialogDescription className="text-muted-foreground text-center">
        Servers are busy! Try again in few hours.
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-col items-center gap-4 mt-4">
      <Button
        onClick={() => setShowServerErrorDialog(false)}
        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
      >
        OK
      </Button>
    </div>
  </DialogContent>
</Dialog>

      {/* Dev viewer removed for production cleanliness */}
    </div>
  );
}; 