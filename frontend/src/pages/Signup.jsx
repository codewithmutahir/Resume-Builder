import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { FileText, Mail, Lock, User, Chrome, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { validateEmail, validatePassword, validateName, validatePasswordMatch, getPasswordStrength } from '../utils/validation';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailExists, setEmailExists] = useState(false);
  const [emailProvider, setEmailProvider] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  const { signup, signInWithGoogle, checkEmailExists } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    if (name) {
      const validation = validateName(name);
      setNameError(validation.valid ? '' : validation.message);
    } else {
      setNameError('');
    }
  }, [name]);

  // Debounced email validation and existence check
  useEffect(() => {
    if (email) {
      const validation = validateEmail(email);
      
      if (!validation.valid) {
        setEmailError(validation.message);
        setEmailExists(false);
        setEmailProvider(null);
        return;
      }
      
      // Clear error while checking
      setEmailError('');
      setCheckingEmail(true);
      
      // Debounce email existence check (wait 800ms after user stops typing)
      const timeoutId = setTimeout(async () => {
        try {
          console.log('Checking email existence for:', email);
          const emailCheck = await checkEmailExists(email);
          
          console.log('Email check result:', emailCheck);
          
          if (emailCheck && emailCheck.exists) {
            console.log('Email exists with provider:', emailCheck.provider);
            setEmailExists(true);
            setEmailProvider(emailCheck.provider);
            
            const errorMessage = emailCheck.provider === 'google'
              ? 'This email is already registered with Google. Please sign in with Google instead.'
              : emailCheck.provider === 'email'
              ? 'This email is already registered. Please sign in instead.'
              : 'This email is already registered. Please sign in instead.';
            setEmailError(errorMessage);
          } else {
            console.log('Email is available');
            setEmailExists(false);
            setEmailProvider(null);
            setEmailError('');
          }
        } catch (error) {
          console.error('Error checking email existence in Signup:', error);
          // On error, don't assume email is available - show warning
          setEmailExists(false);
          setEmailProvider(null);
          setEmailError('Could not verify email availability. Please try again.');
        } finally {
          setCheckingEmail(false);
        }
      }, 800);
      
      return () => {
        clearTimeout(timeoutId);
        setCheckingEmail(false);
      };
    } else {
      setEmailError('');
      setEmailExists(false);
      setEmailProvider(null);
      setCheckingEmail(false);
    }
  }, [email, checkEmailExists]);

  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordError(validation.valid ? '' : validation.message);
      setPasswordStrength(validation.strength || 0);
    } else {
      setPasswordError('');
      setPasswordStrength(0);
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword) {
      const validation = validatePasswordMatch(password, confirmPassword);
      setConfirmPasswordError(validation.valid ? '' : validation.message);
    } else {
      setConfirmPasswordError('');
    }
  }, [confirmPassword, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordMatch(password, confirmPassword);

    setNameError(nameValidation.valid ? '' : nameValidation.message);
    setEmailError(emailValidation.valid ? '' : emailValidation.message);
    setPasswordError(passwordValidation.valid ? '' : passwordValidation.message);
    setConfirmPasswordError(confirmPasswordValidation.valid ? '' : confirmPasswordValidation.message);

    if (!nameValidation.valid || !emailValidation.valid || !passwordValidation.valid || !confirmPasswordValidation.valid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Double-check email doesn't exist before submitting
    if (emailExists) {
      toast.error('Please use a different email or sign in with your existing account');
      return;
    }

    // Final email check before signup
    setCheckingEmail(true);
    try {
      const finalEmailCheck = await checkEmailExists(email);
      if (finalEmailCheck && finalEmailCheck.exists) {
        setEmailExists(true);
        setEmailProvider(finalEmailCheck.provider);
        const errorMessage = finalEmailCheck.provider === 'google'
          ? 'This email is already registered with Google. Please sign in with Google instead.'
          : 'This email is already registered. Please sign in instead.';
        setEmailError(errorMessage);
        toast.error(errorMessage);
        setCheckingEmail(false);
        return;
      }
    } catch (checkError) {
      console.error('Final email check failed:', checkError);
      // Continue with signup attempt - AuthContext will catch it
    } finally {
      setCheckingEmail(false);
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      navigate('/');
    } catch (error) {
      // If email already exists with Google, navigate to login
      if (error.code === 'auth/email-already-in-use' && error.provider === 'google') {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Vibrant Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 via-primary/8 to-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-accent/10 via-primary/8 to-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 bg-white border border-primary/20 shadow-2xl shadow-primary/10 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-xl" />
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <motion.div
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 mb-4 relative overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <FileText className="w-8 h-8 text-white relative z-10" />
            </motion.div>
            <h1 className="text-3xl font-light bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2 tracking-tight">
              Resume Builder
            </h1>
            <p className="text-sm text-muted-foreground">Create your account</p>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 bg-white hover:bg-muted border border-border shadow-sm"
            variant="outline"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or sign up with email</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${nameError ? 'text-destructive' : name && !nameError ? 'text-green-500' : 'text-muted-foreground'}`} />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 pr-10 ${nameError ? 'border-destructive focus-visible:ring-destructive' : name && !nameError ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                />
                {name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {nameError ? (
                      <XCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {nameError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {nameError}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${emailError ? 'text-destructive' : email && !emailError && !checkingEmail ? 'text-green-500' : 'text-muted-foreground'}`} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 pr-10 ${emailError ? 'border-destructive focus-visible:ring-destructive' : email && !emailError && !checkingEmail ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                />
                {email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {checkingEmail ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : emailError ? (
                      <XCircle className="w-5 h-5 text-destructive" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {checkingEmail && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Checking email availability...
                </p>
              )}
              {emailError && !checkingEmail && (
                <p className="text-xs text-destructive flex items-start gap-1">
                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
              {email && !emailError && !checkingEmail && !emailExists && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Email is available
                </p>
              )}
              {emailExists && emailProvider === 'google' && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 This email is registered with Google. Use the "Continue with Google" button above to sign in.
                  </p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${passwordError ? 'text-destructive' : password && !passwordError ? 'text-green-500' : 'text-muted-foreground'}`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-20 ${passwordError ? 'border-destructive focus-visible:ring-destructive' : password && !passwordError ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {password && (
                    <>
                      {passwordError ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {password && (
                <>
                  {passwordError ? (
                    <p className="text-xs text-destructive flex items-start gap-1">
                      <XCircle className="w-3 h-3 mt-0.5" />
                      <span>{passwordError}</span>
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Strong password
                      </p>
                      {passwordStrength > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  passwordStrength <= 1 ? 'bg-red-500 w-1/5' :
                                  passwordStrength === 2 ? 'bg-orange-500 w-2/5' :
                                  passwordStrength === 3 ? 'bg-yellow-500 w-3/5' :
                                  passwordStrength === 4 ? 'bg-blue-500 w-4/5' :
                                  'bg-green-500 w-full'
                                }`}
                              />
                            </div>
                            <span className={`text-xs font-medium ${getPasswordStrength(passwordStrength).color}`}>
                              {getPasswordStrength(passwordStrength).label}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {!password && (
                <p className="text-xs text-muted-foreground">
                  Must contain: 8+ characters, uppercase, lowercase, number, special character
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${confirmPasswordError ? 'text-destructive' : confirmPassword && !confirmPasswordError ? 'text-green-500' : 'text-muted-foreground'}`} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-20 ${confirmPasswordError ? 'border-destructive focus-visible:ring-destructive' : confirmPassword && !confirmPasswordError ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {confirmPassword && (
                    <>
                      {confirmPasswordError ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {confirmPasswordError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {confirmPasswordError}
                </p>
              )}
              {confirmPassword && !confirmPasswordError && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                loading || 
                checkingEmail ||
                !!nameError || 
                !!emailError || 
                !!passwordError || 
                !!confirmPasswordError || 
                emailExists ||
                !name || 
                !email || 
                !password || 
                !confirmPassword
              }
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : checkingEmail ? 'Checking email...' : emailExists ? 'Email already exists' : 'Create Account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm space-y-2">
            <p>
              <span className="text-muted-foreground">Already have an account? </span>
              <Link
                to="/login"
                className="text-primary hover:text-accent font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
            <p className="text-muted-foreground">
              <a
                href="https://seotools.elitesolutionusa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Free SEO Tools by Elite Solution
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;

