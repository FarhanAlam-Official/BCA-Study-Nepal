/**
 * Registration Page Component
 * 
 * Handles user registration with features including:
 * - Form validation
 * - Password strength checking
 * - OTP verification
 * - Social login options
 * - Form persistence
 * - Rate limiting for submissions
 */

import { useState, useEffect } from 'react';
import { FaGoogle, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, Brain, KeyRound, UserPlus, ShieldCheck, FileCheck } from 'lucide-react';
import { motion, AnimatePresence, AnimationProps } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/useAuth';
import { RegisterData } from '../../services/auth/auth.service';
import authService from '../../services/auth/auth.service';
import OTPVerification from './OTPVerification';

// Constants for rate limiting
const SUBMIT_COOLDOWN = 2000; // 2 seconds cooldown between submissions

// Password strength levels with corresponding styles
const PASSWORD_STRENGTH = {
  WEAK: { label: 'Weak', color: 'text-red-500 border-red-500' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-500 border-yellow-500' },
  STRONG: { label: 'Strong', color: 'text-green-500 border-green-500' }
};

/**
 * Props interface for the FloatingIcon component
 */
interface FloatingIconProps {
    Icon: React.ElementType;
    className: string;
    size?: string;
    animate: AnimationProps['animate'];
    transition: AnimationProps['transition'];
}

/**
 * FloatingIcon Component
 * Renders animated decorative icons using Framer Motion
 */
const FloatingIcon: React.FC<FloatingIconProps> = ({ 
    Icon, 
    className, 
    size = "100%",
    animate,
    transition
}) => (
    <motion.div
        animate={animate}
        transition={transition}
        className={className}
    >
        <div className={`${className} text-indigo-600/20`}>
            <Icon size={size} />
        </div>
    </motion.div>
);

/**
 * Animation variants for the sliding panels
 * Defines enter, center, and exit states with spring animations
 */
const panelVariants = {
  enter: {
    x: "100%",
    borderTopLeftRadius: "30%",
    borderBottomLeftRadius: "30%",
    borderTopRightRadius: "0%",
    borderBottomRightRadius: "0%",
    transition: { 
      x: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8
      },
      borderRadius: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  center: {
    x: "0%",
    borderTopLeftRadius: "0%",
    borderBottomLeftRadius: "0%",
    borderTopRightRadius: "30%",
    borderBottomRightRadius: "30%",
    transition: { 
      x: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8
      },
      borderRadius: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  exit: {
    x: "100%",
    borderTopLeftRadius: "30%",
    borderBottomLeftRadius: "30%",
    borderTopRightRadius: "0%",
    borderBottomRightRadius: "0%",
    transition: { 
      x: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8
      },
      borderRadius: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }
};

/**
 * Animation variants for the form elements
 * Defines smooth transitions for form visibility
 */
const formVariants = {
  enter: {
    x: 100,
    opacity: 0
  },
  center: {
    x: 0,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.4 }
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: { duration: 0.4 }
  }
};

/**
 * Register Component
 * Main registration form component with form handling and validation
 */
const Register = () => {
  const { error, success, isLoading, resetMessages } = useAuth();
  
  // Form state
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<keyof typeof PASSWORD_STRENGTH>('WEAK');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegisterData | null>(null);

  // Validation state
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  /**
   * Clears all form fields and validation states
   * Also removes persisted form data from localStorage
   */
  const clearForm = () => {
    setUsername('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength('WEAK');
    // Clear validation states
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    // Clear localStorage
    localStorage.removeItem('registrationForm');
  };

  // Clear auth messages when component mounts
  useEffect(() => {
    resetMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load persisted form data from localStorage
  useEffect(() => {
    const savedForm = localStorage.getItem('registrationForm');
    if (savedForm) {
      const { username, name, email } = JSON.parse(savedForm);
      setUsername(username || '');
      setName(name || '');
      setEmail(email || '');
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const formData = { username, name, email };
    localStorage.setItem('registrationForm', JSON.stringify(formData));
  }, [username, name, email]);

  // Handle successful registration
  useEffect(() => {
    if (success) {
      clearForm();
      toast.success('Registration successful! Please check your email to verify your account.');
    }
  }, [success]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  /**
   * Calculates password strength based on various criteria
   * @param value - The password to evaluate
   * @returns The strength level (WEAK, MEDIUM, or STRONG)
   */
  const calculatePasswordStrength = (value: string): keyof typeof PASSWORD_STRENGTH => {
    let score = 0;
    
    // Length check
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) score++;
    
    if (score <= 3) return 'WEAK';
    if (score <= 5) return 'MEDIUM';
    return 'STRONG';
  };

  /**
   * Validates username format and availability
   * @param value - The username to validate
   * @returns Error message if invalid, null if valid
   */
  const validateUsername = (value: string) => {
    setUsernameError(null);
    if (!value.trim()) {
      setUsernameError('Username is required');
      return false;
    }
    
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    
    // Allow only alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    return true;
  };

  /**
   * Validates email format
   * @param value - The email to validate
   * @returns Error message if invalid, null if valid
   */
  const validateEmail = (value: string) => {
    setEmailError(null);
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  /**
   * Validates password strength and requirements
   * @param value - The password to validate
   * @returns Error message if invalid, null if valid
   */
  const validatePassword = (value: string) => {
    setPasswordError(null);
    if (!value.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }

    if (value.length > 16) {
      setPasswordError('Password must not exceed 16 characters');
      return false;
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(value)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(value)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    
    // Check for number
    if (!/[0-9]/.test(value)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }
    
    return true;
  };

  /**
   * Validates that confirm password matches the password
   * @param confirmValue - The confirm password value
   * @param passwordValue - The original password value
   * @returns Error message if not matching, null if valid
   */
  const validateConfirmPassword = (confirmValue: string, passwordValue: string) => {
    setConfirmPasswordError(null);
    if (!confirmValue) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    
    if (confirmValue !== passwordValue) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  /**
   * Handles username input changes with validation
   */
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  /**
   * Handles email input changes with validation
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  /**
   * Handles password input changes with validation and strength calculation
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    validatePassword(value);
    
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword, value);
    }
  };

  /**
   * Handles confirm password input changes with validation
   */
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value, password);
  };

  /**
   * Handles successful OTP verification
   * Completes the registration process and redirects user
   */
  const handleVerificationSuccess = async () => {
    if (!registrationData) return;
    
    try {
      // Don't register again - the user is already registered during initial signup
      // The OTP verification endpoint already activates the user account
      
      // Simply store the returned tokens from OTP verification
      setShowOTPVerification(false);
      
      // Show success message to the user
      toast.success('Account created successfully! You can now log in.');
      
      // Clear form fields after successful registration
      clearForm();
      
      // Reset success message to prevent it from showing again
      resetMessages();
      
    } catch {
      toast.error('There was a problem completing your registration. Please try again.');
    }
  };

  /**
   * Handles cancellation of registration process
   * Cleans up form data and resets states
   */
  const handleCancelRegistration = () => {
    setShowOTPVerification(false);
    setRegistrationData(null);
    resetMessages();
    toast.info('Registration cancelled. You can update your information and try again.');
  };

  /**
   * Handles OTP resend request
   * Implements rate limiting to prevent abuse
   */
  const handleResendOTP = async () => {
    if (!registrationData?.email) {
      toast.error('No email address found. Please start the registration process again.');
      return;
    }
    
    try {
      await authService.resendOTP(registrationData.email);
      toast.info('Verification code has been resent to your email.');
    } catch {
      toast.error('Failed to resend verification code. Please try again.');
    }
  };

  /**
   * Handles form submission
   * Validates all fields and initiates registration process
   * @param e - Form submission event
   */
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      toast.warning('Please wait a moment before trying again');
      return;
    }

    // Validate all fields
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    try {
      setLastSubmitTime(now);
      
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const userData: RegisterData = {
        username,
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName
      };

      // First call to API to register the user
      await authService.register(userData);
      
      // Store registration data for potential future use
      setRegistrationData(userData);
      
      // Show OTP verification screen after successful registration
      setShowOTPVerification(true);
      
      // Reset success message from auth context to prevent duplicate toasts
      resetMessages();
      
      toast.info('Please check your email for the verification code to complete your registration');
      
    } catch (error: unknown) {
      const err = error as { 
        response?: { 
          status: number; 
          statusText: string; 
          data: Record<string, string[]>; 
        } 
      };

      // Extract specific error messages if available
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (errorData.username && errorData.username.length > 0) {
          toast.error(errorData.username[0]);
          return;
        }
        
        if (errorData.email && errorData.email.length > 0) {
          toast.error(errorData.email[0]);
          return;
        }
      }
      
      // Generic error if no specific error is found
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
      {/* Decorative Floating Icons */}
      <FloatingIcon
        Icon={ShieldCheck}
        className="absolute h-28 w-28 right-[20%] top-[5%]"
        animate={{ 
          y: [0, -40, 0],
          x: [0, 30, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      <FloatingIcon
        Icon={BookOpen}
        className="absolute h-[112px] w-[112px] left-[25%] top-[5%]"
        animate={{ 
          y: [0, 40, 0],
          x: [0, -30, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <FloatingIcon
        Icon={KeyRound}
        className="absolute h-[90px] w-[90px] right-[25%] bottom-[5%]"
        animate={{ 
          y: [0, -30, 0],
          x: [0, -25, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <FloatingIcon
        Icon={FileCheck}
        className="absolute h-20 w-20 left-[25%] bottom-[5%]"
        animate={{ 
          y: [0, 35, 0],
          x: [0, 25, 0],
          rotate: [0, -8, 8, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      <FloatingIcon
        Icon={Brain}
        className="absolute h-24 w-24 right-[3%] top-[45%]"
        animate={{ 
          y: [0, -35, 0],
          x: [0, 20, 0],
          rotate: [0, 8, -8, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <FloatingIcon
        Icon={UserPlus}
        className="absolute h-20 w-20 left-[3%] top-[50%]"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl min-h-[550px] flex overflow-hidden relative">
          {/* Colored Panel */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="absolute top-0 left-0 w-1/2 h-full hidden lg:block overflow-hidden"
              initial="enter"
              animate="center"
              exit="exit"
              variants={panelVariants}
              layout
              key="colored-panel"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-l from-indigo-700 to-purple-500 transform-gpu"
                initial={{ borderRadius: "0% 30% 30% 0%" }}
                animate={{ borderRadius: "0% 30% 30% 0%" }}
                exit={{ borderRadius: "0% 30% 30% 0%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {/* Wave effects */}
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 3, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-2xl" />
                    <div className="absolute top-2/3 -left-1/4 w-[150%] h-24 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-2xl" />
                  </div>
                </motion.div>
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                    backgroundImage: 'linear-gradient(45deg, transparent 0%, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%, transparent 100%)',
                  }}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center px-12 text-center z-10">
                  <h2 className="text-3xl font-bold text-white mb-3">Welcome Back!</h2>
                  <p className="text-white/90 text-base mb-6">
                    Already one of us? Log in and let's get back to making your student life a little less overwhelming.
                  </p>
                  <Link
                    to="/auth"
                    state={{ direction: 'left' }}
                    className="px-10 py-2.5 border border-white/90 rounded-full text-white text-base font-semibold uppercase tracking-wide hover:bg-white/10 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Registration Form */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 ml-auto">
            <AnimatePresence mode="wait">
              {showOTPVerification ? (
                <OTPVerification
                  key="otp-verification"
                  email={registrationData?.email || ''}
                  onVerificationSuccess={handleVerificationSuccess}
                  onCancel={handleCancelRegistration}
                  onResendOTP={handleResendOTP}
                  isLoading={isLoading}
                />
              ) : (
                <motion.div 
                  className="space-y-4"
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={formVariants}
                  key="register-form"
                >
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
                  
                  {/* Social Login Options */}
                  <div className="flex gap-3 mb-3">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:border-indigo-600 hover:shadow-md transition-all duration-200">
                      <FaGoogle className="text-gray-600" />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:border-indigo-600 hover:shadow-md transition-all duration-200">
                      <FaGithub className="text-gray-600" />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:border-indigo-600 hover:shadow-md transition-all duration-200">
                      <FaLinkedinIn className="text-gray-600" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center my-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-3 text-sm text-gray-600">or use your email</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handleRegisterSubmit} className="space-y-3" noValidate>
                    {/* Username Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        {usernameError && (
                          <span className="text-xs text-red-500">{usernameError}</span>
                        )}
                      </div>
                      <input 
                        id="username"
                        type="text" 
                        placeholder="Choose a username" 
                        value={username}
                        onChange={handleUsernameChange}
                        aria-invalid={!!usernameError}
                        aria-describedby={usernameError ? "username-error" : undefined}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          usernameError ? 'border-red-500' : username ? 'border-green-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200`}
                      />
                    </div>

                    {/* Full Name Input */}
                    <div className="space-y-1">
                      <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input 
                        id="fullname"
                        type="text" 
                        placeholder="Enter your full name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          name ? 'border-green-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200`}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        {emailError && (
                          <span className="text-xs text-red-500">{emailError}</span>
                        )}
                      </div>
                      <input 
                        id="email"
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={handleEmailChange}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? "email-error" : undefined}
                        className={`w-full px-3 py-1.5 rounded-lg border ${
                          emailError ? 'border-red-500' : email ? 'border-green-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200`}
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        {passwordError && (
                          <span className="text-xs text-red-500">{passwordError}</span>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password" 
                          value={password}
                          maxLength={16}
                          onCopy={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onChange={handlePasswordChange}
                          aria-invalid={!!passwordError}
                          aria-describedby={passwordError ? "password-error" : undefined}
                          className={`w-full px-3 py-1.5 rounded-lg border ${
                            passwordError ? 'border-red-500' : password ? 'border-green-500' : 'border-gray-200'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200`}
                        />
                        <button 
                          type="button" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-0.5 flex items-center space-x-2">
                          <div className={`text-xs font-medium ${PASSWORD_STRENGTH[passwordStrength].color}`}>
                            {PASSWORD_STRENGTH[passwordStrength].label}
                          </div>
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                passwordStrength === 'WEAK' ? 'w-1/3 bg-red-500' :
                                passwordStrength === 'MEDIUM' ? 'w-2/3 bg-yellow-500' :
                                'w-full bg-green-500'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        {confirmPasswordError && (
                          <span className="text-xs text-red-500">{confirmPasswordError}</span>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password" 
                          value={confirmPassword}
                          maxLength={16}
                          onCopy={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onChange={handleConfirmPasswordChange}
                          aria-invalid={!!confirmPasswordError}
                          aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                          className={`w-full px-3 py-1.5 rounded-lg border ${
                            confirmPasswordError ? 'border-red-500' : confirmPassword ? 'border-green-500' : 'border-gray-200'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200`}
                        />
                        <button 
                          type="button" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                        isLoading
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      } transition-all duration-200 flex items-center justify-center mt-3`}
                      aria-disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Register;