import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login, register, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', password: '', confirmPassword: '', name: '' });
      setFormErrors({});
      setError(null);
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (activeTab === 'signup') {
      if (!formData.name.trim()) {
        errors.name = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'signup') {
        // Registration
        await register(formData.name, formData.email, formData.password);
      } else {
        // Sign in
        await login(formData.email, formData.password);
      }
      
      // Show success state
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    setFormErrors({});
    setError(null);
    setIsSuccess(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getInputClassName = (field: keyof FormErrors) => {
    const baseClasses = "pl-10 bg-white/5 border-white/20 text-foreground placeholder:text-foreground/40 focus:border-blue-500";
    const errorClasses = "border-red-500 focus:border-red-500";
    return `${baseClasses} ${formErrors[field] ? errorClasses : ''}`;
  };

  // Google One Tap / Button handler using Google Identity Services
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure Google script has been loaded
      const { google } = window as any;
      if (!google || !google.accounts || !google.accounts.id) {
        throw new Error('Google Identity not loaded. Please refresh the page and try again.');
      }

      // Check if client ID is configured
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google client ID not configured');
      }

      // Use the prompt flow via button click
      await new Promise<void>((resolve, reject) => {
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              try {
                const idToken = response.credential;
                if (!idToken) throw new Error('No credential returned from Google');
                
                console.log('Google ID token received, calling loginWithGoogle...');
                await loginWithGoogle(idToken);
                setIsSuccess(true);
                // Force refresh of the user in context from backend right after Google login
                window.location.reload();
                resolve();
              } catch (e) {
                console.error('Error in Google callback:', e);
                reject(e);
              }
            },
          });
          // Show native prompt
          google.accounts.id.prompt();
        } catch (e) {
          reject(e);
        }
      });
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 min-h-screen overflow-y-auto md:items-center items-start md:pt-4 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          style={{ 
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
            paddingBottom: '1rem'
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-card/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mx-auto my-8 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              margin: 'auto',
              maxWidth: '28rem',
              width: '100%'
            }}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Success State */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  className="absolute inset-0 rounded-3xl flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 25%, #06b6d4 50%, #6366f1 75%, #8b5cf6 100%)',
                    zIndex: 9999,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    boxShadow: 'inset 0 0 50px rgba(59, 130, 246, 0.3), 0 0 50px rgba(139, 92, 246, 0.2)'
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
                      style={{
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)'
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                    >
                      <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {activeTab === 'signup' ? 'Account Created!' : 'Welcome Back!'}
                    </h3>
                    <p className="text-white/95 font-medium">
                      {activeTab === 'signup' 
                        ? 'Your account has been successfully created.' 
                        : 'You have been successfully signed in.'
                      }
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <div className="hidden md:block">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to NexodusAI
                </h2>
                <p className="text-foreground/60">
                  {activeTab === 'signin' ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              {['signin', 'signup'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                  onClick={() => handleTabChange(tab as 'signin' | 'signup')}
                  disabled={isLoading}
                >
                  {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="name" className="text-foreground/80 text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={getInputClassName('name')}
                      required={activeTab === 'signup'}
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                  )}
                </motion.div>
              )}

              <div>
                <Label htmlFor="email" className="text-foreground/80 text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={getInputClassName('email')}
                    required
                    disabled={isLoading}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground/80 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`${getInputClassName('password')} pr-10`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              {activeTab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="confirmPassword" className="text-foreground/80 text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`${getInputClassName('confirmPassword')} pr-10`}
                      required={activeTab === 'signup'}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'signin' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-foreground/60">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5" disabled={isLoading} />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors" disabled={isLoading}>
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{activeTab === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  <span>{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                )}
              </Button>
            </form>

            {/* Or divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="px-3 text-xs text-foreground/50">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              variant="secondary"
            >
              Continue with Google
            </Button>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-foreground/60">
              {activeTab === 'signin' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    onClick={() => handleTabChange('signup')}
                    disabled={isLoading}
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    onClick={() => handleTabChange('signin')}
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 