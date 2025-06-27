/**
 * OTP Verification Component
 * 
 * A secure and user-friendly OTP verification system that provides:
 * - 6-digit OTP input with auto-focus navigation
 * - Clipboard paste support for convenience
 * - Rate-limited resend functionality
 * - Real-time validation and error handling
 * - Animated transitions and loading states
 * - Cancellation flow with confirmation
 * - Accessibility features
 * - Toast notifications for user feedback
 * 
 * @module Authentication
 * @category Components
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, X, AlertTriangle, ArrowLeft } from 'lucide-react';
import { AxiosError } from 'axios';
import authService from '../../services/auth/auth.service';
import { showSuccess, showError, showInfo } from '../../utils/notifications';

/**
 * Props interface for OTPVerification component
 * @interface OTPVerificationProps
 * @property {string} email - User's email address for verification
 * @property {() => void} onVerificationSuccess - Callback for successful verification
 * @property {() => Promise<void>} onResendOTP - Callback to request new OTP
 * @property {() => void} onCancel - Callback to cancel verification
 * @property {boolean} isLoading - Loading state from parent component
 */
interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onResendOTP: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * Interface for API error response data
 * @interface ErrorResponseData
 * @property {string} [message] - Optional error message
 * @property {string} [detail] - Optional error detail
 */
interface ErrorResponseData {
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

/**
 * Animation configuration for form transitions
 * Provides smooth enter/exit animations with easing
 * @constant
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
 * OTPVerification Component
 * Handles the OTP verification process for email confirmation
 */
const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationSuccess,
  onResendOTP,
  onCancel,
  isLoading: isLoadingProp
}) => {
  // Form state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  /**
   * Countdown timer for resend functionality
   * Enables resend button after countdown reaches 0
   */
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  /**
   * Handles OTP input changes
   * Validates input and manages auto-focus
   */
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  /**
   * Handles backspace key for OTP input
   * Manages focus when deleting digits
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  /**
   * Handles paste event for OTP input
   * Validates and distributes pasted digits
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  /**
   * Handles OTP verification
   * Validates and submits OTP to backend
   */
  const handleVerify = async () => {
    if (isLoadingProp) return;
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
        showError('Please enter the complete 6-digit verification code');
        return;
    }

    try {
        setIsLoading(true);
        await authService.verifyOTP(email, otpString);
        await onVerificationSuccess();
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ErrorResponseData>;
        const errorData = axiosError.response?.data;
        const errorMessage = 
            errorData?.message || 
            errorData?.detail || 
            (error instanceof Error ? error.message : 'Invalid verification code. Please try again.');
        
        showError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  /**
   * Handles OTP resend request
   * Manages rate limiting and loading states
   */
  const handleResend = async () => {
    if (isLoadingProp || !canResend) return;
    
    try {
        setIsLoading(true);
        await onResendOTP();
        setResendCountdown(30);
        setCanResend(false);
        showSuccess('A new verification code has been sent to your email');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to resend verification code. Please try again.';
        showError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };
  
  /**
   * Initiates cancel confirmation flow
   */
  const handleCancel = async () => {
    if (isLoadingProp || isLoading) return;
    setShowCancelConfirm(true);
  };
  
  /**
   * Handles confirmed cancellation
   * Calls API to cancel registration
   */
  const handleConfirmCancel = async () => {
    try {
        setIsCancelling(true);
        await authService.cancelRegistration(email);
        showInfo('Registration cancelled successfully');
        onCancel();
    } catch (error: unknown) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to cancel registration';
        showError(errorMessage);
    } finally {
        setIsCancelling(false);
        setShowCancelConfirm(false);
    }
  };
  
  /**
   * Returns to OTP verification from cancel confirmation
   */
  const handleCancelGoBack = () => {
    setShowCancelConfirm(false);
  };

  return (
    <motion.div
      className="space-y-6 min-h-[500px] flex flex-col"
      initial="enter"
      animate="center"
      exit="exit"
      variants={formVariants}
    >
      {!showCancelConfirm ? (
        // Normal OTP verification UI
        <>
          <div className="text-center">
            <motion.div 
              className="flex justify-center mb-4 mt-8"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="h-16 w-16 text-indigo-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="mt-2 text-gray-600">
              We've sent a verification code to:
            </p>
            <p className="mt-1 text-indigo-600 font-medium">
              {email}
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 mt-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200"
                disabled={isLoading || isLoadingProp || isCancelling}
              />
            ))}
          </div>

          {/* Verify Button */}
          <motion.button
            onClick={handleVerify}
            disabled={isLoading || isLoadingProp || isCancelling || otp.join('').length !== 6}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
              isLoading || isLoadingProp || isCancelling || otp.join('').length !== 6
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } transition-all duration-200 flex items-center justify-center mt-6`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading || isLoadingProp ? (
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
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </motion.button>

          {/* Push the action buttons to the bottom with flex-grow */}
          <div className="flex-grow"></div>

          {/* Action Buttons Row */}
          <div className="flex justify-between items-center mt-auto pb-4">
            {/* Resend Option */}
            <button
              onClick={handleResend}
              disabled={!canResend || isLoading || isLoadingProp || isCancelling}
              className={`text-sm ${
                canResend && !isLoading && !isLoadingProp && !isCancelling
                  ? 'text-indigo-600 hover:text-indigo-700'
                  : 'text-gray-400'
              } transition-colors duration-200 flex items-center`}
            >
              <RefreshCw size={16} className="mr-2" />
              {canResend ? 'Resend Code' : `Resend in ${resendCountdown}s`}
            </button>
            
            {/* Cancel Button - With solid background */}
            <motion.button
              onClick={handleCancel}
              disabled={isLoading || isLoadingProp || isCancelling}
              className={`px-3.5 py-2 rounded-md ${
                isLoading || isLoadingProp || isCancelling 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600'
              } transition-all duration-200 text-sm font-medium shadow-sm flex items-center`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X size={16} className="mr-1.5" />
              Cancel Registration
            </motion.button>
          </div>
        </>
      ) : (
        // Cancel Confirmation UI
        <motion.div 
          className="flex flex-col items-center justify-center flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="bg-red-50 rounded-xl p-6 w-full max-w-md border border-red-200 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Cancel Registration?</h3>
            <p className="text-gray-600 text-center mb-6">
              This will remove your registration data and you'll need to start over if you want to register later.
            </p>
            <div className="flex flex-col gap-3">
              <motion.button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className={`py-2.5 px-4 rounded-lg ${
                  isCancelling ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                } text-white font-medium shadow-sm flex items-center justify-center`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCancelling ? (
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
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X size={16} className="mr-2" />
                    Yes, Cancel Registration
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={handleCancelGoBack}
                disabled={isCancelling}
                className="py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={16} className="mr-2" />
                No, Go Back
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OTPVerification; 