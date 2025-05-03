/**
 * Forgot Password Page Component
 * 
 * Handles the password reset request process with features including:
 * - Email validation
 * - Rate limiting for resend requests
 * - Animated UI elements
 * - Error handling and user feedback
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimationProps } from 'framer-motion';
import { Mail, KeyRound, ShieldCheck, Undo2, MailQuestion, SendHorizonal } from 'lucide-react';
import authService from '../../services/auth/auth.service';

/**
 * Animation variants for form transitions
 */
const formVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
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

// Rate limiting constant
const RESEND_COOLDOWN = 60; // 60 seconds cooldown for resend

/**
 * ForgotPassword Component
 * Handles the password reset request flow
 */
const ForgotPassword = () => {
    // Form state
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState('');
    
    // Rate limiting state
    const [resendCountdown, setResendCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    /**
     * Countdown timer for rate limiting
     * Decrements the resend countdown and enables resend when it reaches 0
     */
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (resendCountdown > 0) {
            timer = setTimeout(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [resendCountdown]);

    /**
     * Validates email format using regex
     * @param email - The email to validate
     * @returns boolean indicating if email is valid
     */
    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    /**
     * Validates email and sets error state
     * @param value - The email value to validate
     * @returns boolean indicating if validation passed
     */
    const validateEmail = (value: string) => {
        setTouched(true);
        if (!value) {
            setError('Email is required');
            return false;
        }
        if (!isValidEmail(value)) {
            setError('Please enter a valid email address');
            return false;
        }
        setError('');
        return true;
    };

    /**
     * Handles email input changes and validates on the fly
     */
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (touched) {
            validateEmail(value);
        }
    };

    /**
     * Handles resend request with rate limiting
     */
    const handleResend = async () => {
        if (!canResend) return;
        
        setCanResend(false);
        setResendCountdown(RESEND_COOLDOWN);
        setIsLoading(true);
        
        try {
            const response = await authService.forgotPassword(email);
            toast.info(response.detail, {
                position: "top-center",
                autoClose: 6000
            });
        } catch {
            toast.error('Failed to resend email. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handles form submission
     * Validates email and sends password reset request
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.forgotPassword(email);
            setEmailSent(true);
            setResendCountdown(RESEND_COOLDOWN);
            setCanResend(false);
            toast.info(response.detail, {
                position: "top-center",
                autoClose: 6000
            });
        } catch (error: unknown) {
            interface ApiError {
                status: string;
                detail: string;
            }
            
            const isApiError = (error: unknown): error is ApiError => {
                return error !== null && typeof error === 'object' && 'detail' in error &&
                    typeof (error as Record<string, unknown>).detail === 'string';
            };
            
            if (isApiError(error)) {
                toast.error(error.detail);
            } else {
                toast.error('An unexpected error occurred. Please try again later.');
            }
            
            setEmailSent(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
            {/* Floating Icons */}
            <FloatingIcon
                Icon={Mail}
                className="absolute hidden md:block h-24 w-24 right-[15%] top-[20%]"
                animate={{ 
                    x: [0, 60, -40, 0],
                    y: [0, -40, 30, 0],
                    rotate: [0, 25, -25, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ 
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut" 
                }}
            />

            <FloatingIcon
                Icon={KeyRound}
                className="absolute hidden md:block h-20 w-20 left-[40%] top-[10%]"
                animate={{ 
                    x: [0, -50, 30, 0],
                    y: [0, 40, -30, 0],
                    rotate: [0, -20, 20, 0],
                    scale: [1, 0.9, 1.1, 1]
                }}
                transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            />

            <FloatingIcon
                Icon={ShieldCheck}
                className="absolute hidden md:block h-[4.5rem] w-[4.5rem] right-[40%] bottom-[10%]"
                animate={{
                    x: [0, 40, 80, 40, 0],
                    y: [0, -40, 0, 40, 0],
                    rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                    duration: 12,
                    ease: "easeInOut",
                    repeat: Infinity
                }}
            />

            <FloatingIcon
                Icon={Undo2}
                className="absolute hidden md:block h-[4.5rem] w-[4.5rem] left-[15%] bottom-[15%]"
                animate={{
                    x: [0, 100, -50, 30, 0],
                    y: [0, -60, 80, -20, 0],
                    rotate: [0, 20, -25, 15, 0],
                }}
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Infinity
                }}
            />

            <FloatingIcon
                Icon={MailQuestion}
                className="absolute hidden md:block h-20 w-20 right-[15%] bottom-[30%]"
                animate={{ 
                    x: [0, 40, -50, 0],
                    y: [0, -50, 40, 0],
                    rotate: [0, -35, 35, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ 
                    duration: 11,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            <FloatingIcon
                Icon={SendHorizonal}
                className="absolute hidden md:block h-16 w-16 left-[10%] top-[30%]"
                animate={{
                    x: [0, 60, -60, 0],
                    y: [0, -40, 40, 0],
                    rotate: [0, 10, -10, 0],
                }}
                transition={{
                    duration: 6,
                    ease: [0.68, -0.55, 0.27, 1.55],
                    repeat: Infinity
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
                <motion.div
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8"
                    initial="initial"
                    animate="animate"
                    variants={formVariants}
                >
                    {!emailSent ? (
                        <>
                            <div className="text-center mb-8">
                                <motion.div 
                                    className="flex justify-center mb-4"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Mail className="h-12 w-12 text-indigo-600" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                                <p className="mt-2 text-gray-600">
                                    Enter your email address and we'll send you instructions to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onBlur={() => validateEmail(email)}
                                            className={`block w-full px-4 py-3 rounded-lg border ${
                                                touched
                                                    ? error
                                                        ? 'border-red-500 focus:ring-red-200'
                                                        : email
                                                            ? 'border-green-500 focus:ring-green-200'
                                                            : 'border-gray-200'
                                                    : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                                            placeholder="Enter your email"
                                            disabled={isLoading}
                                        />
                                        {touched && error && (
                                            <p className="mt-1 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                                        isLoading
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    } transition-all duration-200 flex items-center justify-center`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
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
                                            Sending Link....
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-center mb-4">
                                <motion.div 
                                    className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20 
                                    }}
                                >
                                    <Mail className="h-6 w-6 text-indigo-600" />
                                </motion.div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
                            
                            <p className="text-gray-600 mb-2">
                                We've sent a reset link to:
                                <br />
                                <span className="font-medium text-gray-800">{email}</span>
                            </p>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                                <p className="text-blue-500 text-sm">
                                    If an account exists with this email, you'll receive link to reset your password.
                                </p>
                            </div>

                            <p className="text-gray-500 text-sm mb-6">
                                Please check your spam folder if you don't see it in your inbox.
                            </p>

                            <div className="flex flex-col items-center space-y-4">
                                <motion.button
                                    onClick={handleResend}
                                    disabled={!canResend || isLoading}
                                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                                        !canResend || isLoading
                                            ? 'bg-indigo-300 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    } transition-all duration-200 flex items-center justify-center`}
                                    whileHover={canResend ? { scale: 1.02 } : undefined}
                                    whileTap={canResend ? { scale: 0.98 } : undefined}
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
                                            Resending...
                                        </>
                                    ) : resendCountdown > 0 ? (
                                        `Resend in ${resendCountdown}s`
                                    ) : (
                                        'Resend Link'
                                    )}
                                </motion.button>

                                <Link
                                    to="/auth"
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword; 