/**
 * Reset Password Component
 * 
 * A secure password reset system that provides:
 * - Token-based password reset verification
 * - Password strength meter with visual feedback
 * - Real-time password validation
 * - Password visibility toggle
 * - Animated UI elements for better UX
 * - Comprehensive error handling
 * - Security measures against brute force
 * - Responsive design with decorative elements
 * - Toast notifications for user feedback
 * 
 * @module Authentication
 * @category Pages
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimationProps } from 'framer-motion';
import { Lock, KeyRound, ShieldCheck, Fingerprint, Key, RefreshCcw } from 'lucide-react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import authService from '../../services/auth/auth.service';

/**
 * Animation configuration for form transitions
 * Provides smooth enter/exit animations with easing
 * @constant
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
 * Password strength configuration with visual indicators
 * @constant
 * @property {Object} WEAK - Styling for weak passwords
 * @property {Object} MEDIUM - Styling for medium-strength passwords
 * @property {Object} STRONG - Styling for strong passwords
 */
const PASSWORD_STRENGTH = {
    WEAK: { label: 'Weak', color: 'text-red-500 border-red-500' },
    MEDIUM: { label: 'Medium', color: 'text-yellow-500 border-yellow-500' },
    STRONG: { label: 'Strong', color: 'text-green-500 border-green-500' }
};

/**
 * Props interface for the FloatingIcon component
 * @interface FloatingIconProps
 * @property {React.ElementType} Icon - The icon component to render
 * @property {string} className - CSS classes for styling
 * @property {string} [size] - Optional size override
 * @property {AnimationProps['animate']} animate - Animation configuration
 * @property {AnimationProps['transition']} transition - Transition configuration
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
 * Interface for form validation errors
 */
interface FormErrors {
    newPassword: string;
    confirmPassword: string;
}

/**
 * ResetPassword Component
 * Handles the password reset process
 */
const ResetPassword = () => {
    const navigate = useNavigate();
    const { uidb64, token } = useParams();
    
    // Form state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Validation state
    const [errors, setErrors] = useState<FormErrors>({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordStrength, setPasswordStrength] = useState<keyof typeof PASSWORD_STRENGTH>('WEAK');

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
        if (/[^A-Za-z0-9]/.test(value)) score++;
        
        if (score <= 2) return 'WEAK';
        if (score <= 4) return 'MEDIUM';
        return 'STRONG';
    };

    /**
     * Validates password against security requirements
     * @param password - The password to validate
     * @returns Error message if invalid, empty string if valid
     */
    const validatePassword = (password: string): string => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (password.length > 16) {
            return 'Password must not exceed 16 characters';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        return '';
    };

    /**
     * Handles form submission
     * Validates passwords and calls reset API
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords
        const passwordError = validatePassword(newPassword);
        const confirmError = newPassword !== confirmPassword ? 'Passwords do not match' : '';

        setErrors({
            newPassword: passwordError,
            confirmPassword: confirmError
        });

        if (passwordError || confirmError) {
            return;
        }

        if (!uidb64 || !token) {
            toast.error('Invalid reset link');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(uidb64, token, newPassword);
            toast.success('Password has been reset successfully');
            navigate('/auth');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
            toast.error(errorMessage);
            if (typeof errorMessage === 'string' && 
                (errorMessage.toLowerCase().includes('invalid') || 
                errorMessage.toLowerCase().includes('expired'))) {
                toast.error('The password reset link is invalid or has expired');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
            {/* Floating Icons */}
            <FloatingIcon
                Icon={KeyRound}
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
                Icon={ShieldCheck}
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
                Icon={Fingerprint}
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
                Icon={Key}
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
                Icon={RefreshCcw}
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
                Icon={Lock}
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
                    <div className="text-center mb-8">
                        <motion.div 
                            className="flex justify-center mb-4"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Lock className="h-12 w-12 text-indigo-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                        <p className="mt-2 text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    maxLength={16}
                                    onCopy={(e) => e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNewPassword(value);
                                        setPasswordStrength(calculatePasswordStrength(value));
                                        setErrors(prev => ({
                                            ...prev,
                                            newPassword: validatePassword(value)
                                        }));
                                    }}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.newPassword
                                            ? 'border-red-500 focus:ring-red-200'
                                            : newPassword
                                                ? 'border-green-500 focus:ring-green-200'
                                                : 'border-gray-200 focus:ring-indigo-200'
                                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                                    placeholder="Enter your new password"
                                    disabled={isLoading}
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
                            {/* Password Strength Indicator */}
                            {newPassword && (
                                <div className="mt-1 flex items-center space-x-2">
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
                            {errors.newPassword && (
                                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                                    {errors.newPassword}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    maxLength={16}
                                    onCopy={(e) => e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrors(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value !== newPassword ? 'Passwords do not match' : ''
                                        }));
                                    }}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.confirmPassword
                                            ? 'border-red-500 focus:ring-red-200'
                                            : confirmPassword
                                                ? confirmPassword === newPassword
                                                    ? 'border-green-500 focus:ring-green-200'
                                                    : 'border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:ring-indigo-200'
                                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                                    placeholder="Confirm your new password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? (
                                        <AiOutlineEyeInvisible size={20} />
                                    ) : (
                                        <AiOutlineEye size={20} />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                                    {errors.confirmPassword}
                                </p>
                            )}
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
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword; 