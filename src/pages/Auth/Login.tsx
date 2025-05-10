/**
 * Authentication Page Component
 * 
 * A comprehensive login page that provides multiple authentication methods:
 * - Email/password authentication
 * - Social login (Google, GitHub, LinkedIn)
 * - Form validation with real-time feedback
 * - Animated UI elements for enhanced user experience
 * - Error handling with toast notifications
 * - Remember me functionality
 * - Password visibility toggle
 * 
 * @module Authentication
 * @category Pages
 */

// Essential imports for React and routing
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Global notification system
import { showSuccess, showError } from '../../utils/notifications';

// Icon imports for social login and UI elements
import { FaGoogle, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

// Animation related imports
import { motion, AnimationProps, AnimatePresence } from 'framer-motion';

// Decorative icon imports
import { 
    BookOpen, 
    Brain, 
    KeyRound, 
    Shield, 
    UserCircle, 
    Lock 
} from 'lucide-react';

/**
 * Interface for form validation errors
 * @interface FormErrors
 * @property {string} email - Error message for email field
 * @property {string} password - Error message for password field
 */
interface FormErrors {
    email: string;
    password: string;
}

/**
 * Props interface for the FloatingIcon component
 * @interface FloatingIconProps
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
 * Used to create engaging background elements
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

// Animation variants for the panels
const panelVariants = {
  enter: {
    x: "-100%",
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
  center: {
    x: "0%",
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
  exit: {
    x: "-100%",
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
  }
};

const formVariants = {
  enter: {
    x: -100,
    opacity: 0
  },
  center: {
    x: 0,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.4 }
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: { duration: 0.4 }
  }
};

/**
 * Main Authentication Component
 * Handles user login with email/password and social providers
 */
const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, error: authError, resetMessages } = useAuth();
    const [logoutToastShown, setLogoutToastShown] = useState(false);

    // Form state management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    // Clear auth messages and check if coming from logout
    useEffect(() => {
        resetMessages();
        
        // Check if user was redirected here after logout
        const fromLogout = location.state?.fromLogout;
        if (fromLogout && !logoutToastShown) {
            showSuccess('You have been logged out successfully');
            setLogoutToastShown(true);
        }
    }, [resetMessages, location.state, logoutToastShown]);

    // Effect to handle authentication state changes
    useEffect(() => {
        if (isAuthenticated) {
            showSuccess('Login successful!');
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Effect to handle auth errors
    useEffect(() => {
        if (authError) {
            // Remove the field error states since we're showing a notification
            setErrors({ 
                email: '', 
                password: '' 
            });

            // Show appropriate error message based on error type
            if (authError === 'NO_INTERNET') {
                showError('Unable to connect. Please check your internet connection and try again.');
            } else if (authError === 'SERVER_DOWN') {
                showError('Server is not responding. Please try again later.');
            } else if (authError === 'SERVER_ERROR') {
                showError('Server error. Please try again later.');
            } else {
                showError('Invalid email or password. Please try again.');
            }
            
            setIsLoading(false);
        }
    }, [authError]);

    // Clear errors when user starts typing
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setTouched(prev => ({ ...prev, email: true }));
        
        // Real-time email validation
        if (!value) {
            setErrors(prev => ({ ...prev, email: 'Email is required' }));
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
        } else {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setTouched(prev => ({ ...prev, password: true }));
        
        // Real-time password validation
        if (!value) {
            setErrors(prev => ({ ...prev, password: 'Password is required' }));
        } else if (value.length < 6) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
        } else if (!/[A-Z]/.test(value)) {
            setErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter' }));
        } else if (!/[a-z]/.test(value)) {
            setErrors(prev => ({ ...prev, password: 'Password must contain at least one lowercase letter' }));
        } else if (!/[0-9]/.test(value)) {
            setErrors(prev => ({ ...prev, password: 'Password must contain at least one number' }));
        } else {
            setErrors(prev => ({ ...prev, password: '' }));
        }
    };

    /**
     * Form Submission Handler
     * Validates form, attempts login, and handles errors
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Mark all fields as touched to show validation messages
        setTouched({ email: true, password: true });

        // Validate both fields
        const emailError = !email 
            ? 'Email is required' 
            : !/\S+@\S+\.\S+/.test(email)
            ? 'Please enter a valid email address'
            : '';

        const passwordError = !password
            ? 'Password is required'
            : password.length < 6
            ? 'Password must be at least 6 characters'
            : !/[A-Z]/.test(password)
            ? 'Password must contain at least one uppercase letter'
            : !/[a-z]/.test(password)
            ? 'Password must contain at least one lowercase letter'
            : !/[0-9]/.test(password)
            ? 'Password must contain at least one number'
            : '';

        // Update errors state
        const newErrors = {
            email: emailError,
            password: passwordError
        };
        setErrors(newErrors);

        // Check if there are any validation errors
        if (emailError || passwordError) {
            showError('Please fix the validation errors before submitting.');
            return;
        }

        setIsLoading(true);
        try {
            await login({ email, password });
        } catch {
            // Error is handled in the useEffect above
            setIsLoading(false);
        }
    };

    return (
        // Main container with gradient background
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
            {/* Decorative Floating Icons Section */}
            <FloatingIcon
                Icon={Shield}
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
                Icon={Lock}
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
                Icon={UserCircle}
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
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl min-h-[600px] flex overflow-hidden relative">
                    {/* Left Side - Login Form Section */}
                    <div className="w-full lg:w-1/2 p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                className="space-y-6"
                                initial="enter"
                                animate="center"
                                exit="exit"
                                variants={formVariants}
                                key="login-form"
                            >
                                <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
                                
                                {/* Social Login Options */}
                                <div className="flex gap-4">
                                    <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 hover:border-indigo-600 hover:shadow-md transition-all duration-200">
                                        <FaGoogle className="text-gray-600" />
                                    </button>
                                    <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 hover:border-indigo-600 hover:shadow-md transition-all duration-200">
                                        <FaGithub className="text-gray-600" />
                                    </button>
                                    <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 hover:border-indigo-600 hover:shadow-md transition-all duration-200">
                                        <FaLinkedinIn className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Divider between social and email login */}
                                <div className="relative flex items-center">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink mx-4 text-gray-600">or use your email</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                {/* Email/Password Login Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Email Input Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                                            className={`w-full px-4 py-3 rounded-lg border ${
                                                touched.email
                                                    ? errors.email
                                                        ? 'border-red-500 focus:ring-red-200'
                                                        : email
                                                            ? 'border-green-500 focus:ring-green-200'
                                                            : 'border-gray-200'
                                                    : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                                            placeholder="Enter your email"
                                        />
                                        {touched.email && errors.email && (
                                            <p className="mt-1 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Input Field with Show/Hide Toggle */}
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={handlePasswordChange}
                                                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                                className={`w-full px-4 py-3 rounded-lg border ${
                                                    touched.password
                                                        ? errors.password
                                                            ? 'border-red-500 focus:ring-red-200'
                                                            : password
                                                                ? 'border-green-500 focus:ring-green-200'
                                                                : 'border-gray-200'
                                                        : 'border-gray-200'
                                                } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible size={20} />
                                                ) : (
                                                    <AiOutlineEye size={20} />
                                                )}
                                            </button>
                                        </div>
                                        {touched.password && errors.password && (
                                            <p className="mt-1 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Forgot Password Section */}
                                    <div className="flex items-center justify-center">
                                        <Link 
                                            to="/forgot-password" 
                                            className="text-base font-medium text-indigo-600 hover:text-indigo-500 transition-all duration-200 hover:scale-105"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit Button with Loading State */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                                            isLoading
                                                ? 'bg-indigo-400 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                        } transition-all duration-200 flex items-center justify-center`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
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
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign in'
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side - Sign Up Promotion Section */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            className="absolute top-0 right-0 w-1/2 h-full hidden lg:block overflow-hidden"
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={panelVariants}
                            layout
                            key="colored-panel"
                        >
                            <div className="absolute inset-0 bg-gradient-to-l from-indigo-700 to-purple-500">
                                {/* Animated wave effects */}
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
                                
                                {/* Shimmering overlay */}
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
                            </div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col items-center justify-center px-12 text-center z-10">
                                <h2 className="text-4xl font-bold text-white mb-4">Hello, Friend!</h2>
                                <p className="text-white/90 text-lg mb-8">
                                New around here? Join us — we've got notes, resources, and career wisdom (minus the boring lectures).
                                </p>
                                <Link
                                    to="/register"
                                    state={{ direction: 'right' }}
                                    className="px-12 py-3 border border-white/90 rounded-full text-white text-lg font-semibold uppercase tracking-wide hover:bg-white/10 transition-all duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Auth;