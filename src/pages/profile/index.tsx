/**
 * Profile Page Component
 * 
 * A comprehensive user profile management interface that provides:
 * - Profile information display and editing
 * - Profile picture management with image compression
 * - Social media links management
 * - Skills and interests management with tag-based input
 * - Profile completion tracking with visual feedback
 * - Responsive layout with animated transitions
 * 
 * The component uses various hooks for state management:
 * - useAuth: For authentication and user data
 * - useState: For local state management
 * - useEffect: For side effects like cleanup
 * - useRef: For file input reference
 * 
 * @module Profile
 */

import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService, { User as AuthUser } from '../../services/auth/auth.service';
import { UserCircle, Mail, Phone, School, BookOpen, LogOut, Edit2, UserIcon, FileText, Share2, Facebook, Twitter, Linkedin, Github, Brain, Code, Heart, X, Save, ImageIcon } from 'lucide-react';
import type { AnimationProps } from 'framer-motion';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { showSuccess, showError } from '../../utils/notifications';

/**
 * Props for the FloatingIcon component
 * Used to create animated decorative icons in the profile page background
 */
interface FloatingIconProps {
  Icon: React.ElementType;    // The icon component to render
  className: string;          // CSS classes for styling
  size?: string;             // Optional size override
  animate: AnimationProps['animate'];       // Framer Motion animation props
  transition: AnimationProps['transition']; // Framer Motion transition props
}

/**
 * FloatingIcon Component
 * Renders animated decorative icons using Framer Motion
 * Used to create visual interest in the profile page background
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
 * Calculates the profile completion percentage and returns appropriate styling
 * 
 * @param user - The user object containing profile information
 * @returns Object containing:
 * - color: The color to use for the completion indicator (green/yellow/red)
 * - percentage: The completion percentage (0-100)
 * - isComplete: Whether the profile is 100% complete
 */
const calculateProfileCompletion = (user: AuthUser) => {
  const fields = [
    'first_name',
    'last_name',
    'email',
    'phone_number',
    'college',
    'semester',
    'bio',
    'profile_picture',
    'interests',
    'skills'
  ] as const;

  const socialFields = [
    'facebook_url',
    'twitter_url',
    'linkedin_url',
    'github_url'
  ] as const;

  let completedFields = 0;
  const totalFields = fields.length + socialFields.length;

  // Check required fields
  fields.forEach(field => {
    if (user[field]) {
      if (Array.isArray(user[field])) {
        // For arrays (interests, skills), check if they have items
        if (user[field]?.length > 0) completedFields++;
      } else {
        completedFields++;
      }
    }
  });

  // Check social fields
  socialFields.forEach(field => {
    if (user[field]) completedFields++;
  });

  const percentage = Math.round((completedFields / totalFields) * 100);
  const isComplete = percentage === 100;

  // Return color, percentage, and isComplete based on completion
  if (percentage >= 80) {
    return { color: 'rgb(34, 197, 94)', percentage, isComplete }; // green-500
  } else if (percentage >= 50) {
    return { color: 'rgb(234, 179, 8)', percentage, isComplete }; // yellow-500
  } else {
    return { color: 'rgb(239, 68, 68)', percentage, isComplete }; // red-500
  }
};

/**
 * Extracts initials from user's name for avatar placeholder
 * 
 * @param user - The user object containing name information
 * @returns A string of 1-2 characters representing the user's initials
 */
const getUserInitials = (user: AuthUser | null) => {
  if (!user) return '??';
  
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  
  // Handle cases where either name could be empty
  if (!firstName && !lastName) return user.username?.substring(0, 2).toUpperCase() || '??';
  if (!firstName) return lastName.substring(0, 2).toUpperCase();
  if (!lastName) return firstName.substring(0, 2).toUpperCase();
  
  // Default case: first letter of first name + first letter of last name
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Compresses an image file before upload
 * Uses browser-image-compression library for optimal compression
 * 
 * @param file - The file to compress
 * @returns A compressed File object or the original file if compression fails
 */
const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], compressedFile.name, {
      type: compressedFile.type
    });
  } catch (error) {
    // Keep this console.error as it's essential for debugging compression issues
    console.error('Error compressing image:', error);
    return file;
  }
};

/**
 * Truncates bio text to specified length
 * 
 * @param bio - The bio text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated bio text with ellipsis
 */
const truncateBio = (bio: string, maxLength: number = 200) => {
  if (!bio || bio.length <= maxLength) return bio;
  return bio.substring(0, maxLength) + '...';
};

/**
 * ProfileCompletionBadge Component
 * Displays a visual indicator of profile completion status
 * Shows percentage or checkmark based on completion level
 */
const ProfileCompletionBadge: React.FC<{ user: AuthUser }> = ({ user }) => {
  const completion = calculateProfileCompletion(user);
  
  return (
    <div className="absolute -bottom-2 -right-2 group/badge">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`${completion.isComplete ? 'bg-green-500' : 'bg-white'} rounded-full shadow-lg p-2 cursor-help`}
      >
        {completion.isComplete ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <div className="text-sm font-semibold" style={{ color: completion.color }}>
            {completion.percentage}%
          </div>
        )}
      </motion.div>
      
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover/badge:block">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-1.5 px-2.5 shadow-lg whitespace-nowrap">
          {completion.isComplete ? 'Profile Complete!' : 'Profile Completion'}
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Profile Component
 * 
 * Handles the display and management of user profile information.
 * Features include:
 * - Profile information display and editing
 * - Profile picture upload with preview and compression
 * - Social media links management
 * - Skills and interests management with tag-like input
 * - Responsive layout with animated transitions
 * - Profile completion tracking with visual feedback
 * - Error handling with user-friendly notifications
 * - Authentication state management
 */
const Profile = () => {
  /**
   * State Management:
   * - user, isAuthenticated, isLoading: Authentication state from useAuth hook
   * - isEditing: Controls profile edit mode
   * - profileLoading: Loading state during profile updates
   * - imagePreview: Temporary URL for profile picture preview
   * - formData: Form state containing all profile fields
   */
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
    college: user?.college || '',
    semester: user?.semester || '',
    bio: user?.bio || '',
    profile_picture: null as File | null,
    facebook_url: user?.facebook_url || '',
    twitter_url: user?.twitter_url || '',
    linkedin_url: user?.linkedin_url || '',
    github_url: user?.github_url || '',
    interests: user?.interests || [],
    skills: user?.skills || [],
    currentSkill: '',
    currentInterest: ''
  });

  // Get member since date - safe access with proper typing
  const createdAt = user && 
    'created_at' in user ? 
    (user as { created_at: string }).created_at : 
    new Date().toISOString();

  /**
   * Effect: Initialize form data when user data is available
   * Updates form fields with current user data
   */
  useEffect(() => {
    if (user) {
      // Set initial form data from user data
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        college: user.college || '',
        semester: user.semester?.toString() || '',
        bio: user.bio || '',
        profile_picture: null,
        facebook_url: user.facebook_url || '',
        twitter_url: user.twitter_url || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        interests: user.interests || [],
        skills: user.skills || [],
        currentSkill: '',
        currentInterest: ''
      });
    }
  }, [user]);

  /**
   * Effect: Cleanup image preview URL
   * Revokes object URL when component unmounts or editing is cancelled
   */
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Redirect if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth" />;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full"
        />
      </div>
    );
  }

  /**
   * Handles changes to form input fields
   * Updates the formData state with new values
   * 
   * @param e - Change event from input element
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles changes to array-based inputs (skills and interests)
   * Processes comma-separated values and updates the respective arrays
   * 
   * @param name - The array field to update ('skills' or 'interests')
   * @param value - The new input value
   */
  const handleArrayChange = (name: 'skills' | 'interests', value: string) => {
    // Store the current input value
    setFormData(prev => ({
      ...prev,
      [name === 'skills' ? 'currentSkill' : 'currentInterest']: value
    }));

    // If the last character is a comma, process the input
    if (value.endsWith(',')) {
      // Get the new item (remove the comma and trim)
      const newItem = value.slice(0, -1).trim();
      
      if (newItem && !formData[name].includes(newItem)) {
        // Add the new item to the array if it's not already there
        setFormData(prev => ({
          ...prev,
          [name]: [...prev[name], newItem],
          [name === 'skills' ? 'currentSkill' : 'currentInterest']: '' // Clear the input
        }));
      } else {
        // Just clear the input if item is empty or duplicate
        setFormData(prev => ({
          ...prev,
          [name === 'skills' ? 'currentSkill' : 'currentInterest']: ''
        }));
      }
    }
  };

  /**
   * Handles keyboard events for skills and interests inputs
   * Processes Enter key for adding items and Backspace for removing
   * 
   * @param e - Keyboard event
   * @param name - The array field being edited
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, name: 'skills' | 'interests') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      
      if (value) {
        // Add comma if not present and process
        handleArrayChange(name, value + ',');
      }
    } else if (e.key === 'Backspace' && e.currentTarget.value === '' && formData[name].length > 0) {
      // Remove the last item when backspace is pressed on empty input
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        [name]: prev[name].slice(0, -1)
      }));
    }
  };

  /**
   * Handles profile picture file selection
   * Validates file type and size, compresses image, and creates preview
   * 
   * @param e - File input change event
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        showError('Please upload a valid image file (JPG, PNG, or GIF)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size should not exceed 5MB');
        return;
      }

      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(compressedFile);
        setImagePreview(previewUrl);
        
        setFormData(prev => ({
          ...prev,
          profile_picture: compressedFile
        }));
      } catch (error) {
        console.error('Error handling file:', error);
        showError('Error processing image. Please try again.');
      }
    }
  };

  /**
   * Handles form submission for profile updates
   * Processes form data, handles file uploads, and manages error states
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    interface ErrorResponseData {
      [key: string]: string | string[] | unknown;
    }

    try {
      await authService.testTokenValidity();
      
      const formDataToSend = new FormData();
      
      // Process all form fields except profile_picture and input states
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'profile_picture' && key !== 'currentSkill' && key !== 'currentInterest') {
          if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            if (key === 'semester') {
              formDataToSend.append(key, value ? value.toString() : '');
            } else {
              formDataToSend.append(key, value.toString());
            }
          }
        }
      });

      // Handle profile picture upload
      if (formData.profile_picture instanceof File) {
        formDataToSend.append('profile_picture', formData.profile_picture);
      }
      
      const updatedUser = await authService.updateProfile(formDataToSend);
      
      if (updateUser) {
        // Use type assertion while avoiding 'any'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateUser(updatedUser as any);
      }
      
      setIsEditing(false);
      
      // Prevent scroll jump by waiting for state updates
      setTimeout(() => {
        showSuccess('Profile updated successfully!');
      }, 100);
      
      // Smooth scroll to top after update
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      // Essential error logging for debugging
      console.error('Profile update failed:', err);
      
      if (err && typeof err === 'object') {
        // Handle authentication errors
        if ('message' in err && typeof err.message === 'string' && 
            (err.message.includes('authentication') || err.message.includes('token'))) {
          showError('Authentication failed. Please log in again.');
          setTimeout(() => logout(), 2000);
          return;
        }
        
        // Handle API error responses
        if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response) {
          const errorResponse = err.response as { data: string | ErrorResponseData; status?: number };
          
          // Handle authentication errors (401/403)
          if (errorResponse.status === 401 || errorResponse.status === 403) {
            showError('Authorization failed. Please log in again.');
            setTimeout(() => logout(), 2000);
            return;
          }
          
          // Process error data for user display
          const errorData = errorResponse.data;
          let errorMessage = '';
          
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData && typeof errorData === 'object') {
            errorMessage = Object.entries(errorData as Record<string, unknown>)
              .map(([key, value]) => {
                const errorText = Array.isArray(value) 
                  ? value.join(', ') 
                  : (typeof value === 'string' ? value : JSON.stringify(value));
                return `${key}: ${errorText}`;
              })
              .join('\n');
          }
          
          showError(errorMessage || 'Update failed. Please try again.');
        } else {
          showError('Network error. Please try again later.');
        }
      } else {
        showError('An unexpected error occurred.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  /**
   * Handles user logout
   * Calls logout function from auth context
   */
  const handleLogout = () => {
    logout();
  };

  /**
   * Handles cancellation of edit mode
   * Cleans up preview URL and resets form state
   */
  const handleCancel = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setFormData(prev => ({
      ...prev,
      profile_picture: null
    }));
    setIsEditing(false);
  };

  return (
    <>
    <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white pt-16 pb-12 relative overflow-hidden"
      >
        {/* Decorative Floating Icons */}
        <FloatingIcon
          Icon={UserCircle}
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
          Icon={Mail}
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
          Icon={Phone}
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
          Icon={School}
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
          Icon={LogOut}
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

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm p-8 relative overflow-hidden">
            {/* Decorative header elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute left-1/4 bottom-0 w-24 h-24 bg-white rounded-full transform translate-y-1/2"></div>
              <div className="absolute right-1/4 top-1/2 w-16 h-16 bg-white rounded-full transform -translate-y-1/2"></div>
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
                <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`absolute -inset-1 rounded-full ${
                  calculateProfileCompletion(user).percentage >= 80
                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                    : calculateProfileCompletion(user).percentage >= 50
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    : 'bg-gradient-to-r from-red-400 to-red-500'
                } opacity-75 blur-sm`}></div>

                {/* Profile Picture */}
                  {user.profile_picture ? (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white bg-white">
                    <motion.img
                      initial={{ scale: 1.0 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      src={user.profile_picture}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                  </div>
                ) : (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {getUserInitials(user)}
                    </div>
                  </div>
                )}

                {/* Profile Completion Badge */}
                <ProfileCompletionBadge user={user} />
              </motion.div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:justify-between">
                  <div className="space-y-3 max-w-md">
                    <motion.h1 
                      className="text-3xl md:text-4xl font-bold text-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {user.first_name} {user.last_name}
                    </motion.h1>
                    
                    <motion.div 
                      className="flex flex-col md:flex-row items-center md:items-start gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {user.college && (
                        <span className="text-indigo-200 flex items-center gap-2">
                          <School className="w-4 h-4" />
                          {user.college}
                        </span>
                      )}
                    </motion.div>

                    <motion.p 
                      className="text-indigo-100 font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      @{user.username}
                    </motion.p>

                    {/* Bio Section - Simplified and truncated */}
                    {user.bio && (
                      <p
                        className="text-indigo-100/90 text-sm leading-relaxed max-h-20 overflow-hidden text-ellipsis max-w-md w-[120%]"
                      >
                        {truncateBio(user.bio)}
                      </p>
                    )}
              </div>
                  
                  <div className="space-y-4 ml-auto">
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {!isEditing && (
              <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium 
                                   border border-white/20 shadow-lg flex items-center gap-2 hover:shadow-xl 
                                   transition-all duration-300"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </motion.button>
                      )}
                      
              <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.25)" }}
                        whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                        className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium 
                                 border border-white/20 shadow-lg flex items-center gap-2 hover:border-red-500/30 
                                 hover:shadow-xl transition-all duration-300"
              >
                        <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>

                    {/* Status Badges */}
              <motion.div 
                      className="flex flex-wrap justify-center md:justify-end gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-white">Active Now</span>
                      </div>
                      
                      <div className="bg-indigo-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full"></div>
                        <span className="text-xs text-white">Member since {new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                      </div>

                      {user.is_verified && (
                        <div className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
                          <span className="text-xs text-white">Verified Account</span>
                        </div>
                      )}
              </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-8">
            {isEditing ? (
              <motion.form 
                onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {/* First Name */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-indigo-600" />
                        First Name
                      </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-indigo-600" />
                        Last Name
                      </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>

                    {/* Email */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    {/* Phone Number */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-indigo-600" />
                        Phone Number
                      </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>

                    {/* College */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <School className="w-5 h-5 text-indigo-600" />
                        College
                      </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>

                    {/* Semester */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Semester
                      </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                    </div>

                    {/* Bio */}
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Bio <span className="text-xs text-gray-500 ml-1">(Max 200 characters)</span>
                      </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      maxLength={200}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                    <p className="mt-1 text-xs text-right text-gray-500">
                      {formData.bio.length}/200 characters
                    </p>
                </div>

                    {/* Profile Picture */}
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-indigo-600" />
                        Profile Picture
                      </label>
                      <div className="mt-2 flex items-center gap-x-3">
                        {/* Profile Picture Preview */}
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                          {imagePreview || user?.profile_picture ? (
                            <img
                              src={imagePreview || user?.profile_picture}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {getUserInitials(user)}
                              </div>
                            </div>
                          )}
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Change
                        </motion.button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended: Square image, max 5MB (JPG, PNG, or GIF)
                      </p>
                    </div>

                    {/* Social Media Links */}
                    <div className="col-span-full">
                      <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-indigo-600" />
                        Social Media Links
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Facebook className="w-5 h-5 text-indigo-600" />
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            name="facebook_url"
                            value={formData.facebook_url}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/yourusername"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Twitter className="w-5 h-5 text-indigo-600" />
                            Twitter URL
                          </label>
                          <input
                            type="url"
                            name="twitter_url"
                            value={formData.twitter_url}
                            onChange={handleInputChange}
                            placeholder="https://twitter.com/yourusername"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Linkedin className="w-5 h-5 text-indigo-600" />
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/yourusername"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Github className="w-5 h-5 text-indigo-600" />
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            name="github_url"
                            value={formData.github_url}
                            onChange={handleInputChange}
                            placeholder="https://github.com/yourusername"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills & Interests */}
                    <div className="col-span-full">
                      <h3 className="text-base font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-600" />
                        Skills & Interests
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Code className="w-5 h-5 text-indigo-600" />
                            Skills (comma-separated)
                          </label>
                          <div className="relative">
                            <textarea
                              name="skills"
                              value={formData.currentSkill}
                              onChange={(e) => handleArrayChange('skills', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, 'skills')}
                              rows={3}
                              placeholder="Type skills and press Enter or add comma to separate them (e.g., JavaScript,Java, Python, React, Node.js)"
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                            {formData.skills.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                  <motion.span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-300 hover:text-indigo-900 transition-colors duration-200"
                                    whileHover={{ 
                                      scale: 1.05,
                                      boxShadow: "0 4px 8px rgba(99, 102, 241, 0.15)",
                                    }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {skill}
                                    {isEditing && (
                                      <motion.button
                                        type="button"
                                        whileHover={{ 
                                          scale: 1.1,
                                          backgroundColor: "rgba(99, 102, 241, 0.1)"
                                        }}
                    whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          setFormData(prev => ({
                                            ...prev,
                                            skills: prev.skills.filter((_, i) => i !== index)
                                          }));
                                        }}
                                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                      >
                                        <X size={14} />
                                      </motion.button>
                                    )}
                                  </motion.span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-indigo-600" />
                            Interests (comma-separated)
                          </label>
                          <div className="relative">
                            <textarea
                              name="interests"
                              value={formData.currentInterest}
                              onChange={(e) => handleArrayChange('interests', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, 'interests')}
                              rows={3}
                              placeholder="Type interests and press Enter or add comma to separate them (e.g., Web Development, Machine Learning, UI/UX Design)"
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                            {formData.interests.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {formData.interests.map((interest, index) => (
                                  <motion.span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-300 hover:text-indigo-900 transition-colors duration-200"
                                    whileHover={{ 
                                      scale: 1.05,
                                      boxShadow: "0 4px 8px rgba(99, 102, 241, 0.15)",
                                    }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {interest}
                                    {isEditing && (
                                      <motion.button
                                        type="button"
                                        whileHover={{ 
                                          scale: 1.1,
                                          backgroundColor: "rgba(99, 102, 241, 0.1)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          setFormData(prev => ({
                                            ...prev,
                                            interests: prev.interests.filter((_, i) => i !== index)
                                          }));
                                        }}
                                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                      >
                                        <X size={14} />
                                      </motion.button>
                                    )}
                                  </motion.span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                  <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 font-medium flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={profileLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 font-medium flex items-center justify-center min-w-[100px] gap-2"
                  >
                    {profileLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : (
                      <>
                          <Save className="w-4 h-4" />
                          Save
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
                <div className="space-y-8">
                  {/* Contact & Education Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Card */}
                <motion.div 
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)",
                        borderColor: "rgba(79, 70, 229, 0.3)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg mr-3">
                            <Mail className="h-5 w-5 text-indigo-600" />
                          </div>
                          <h3 className="text-base font-medium text-gray-900">Contact Information</h3>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:p-6 space-y-4">
                  <motion.div 
                          className="group"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors duration-200">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                            <span className="group-hover:text-indigo-600 transition-colors duration-200">{user.email}</span>
                          </dd>
                  </motion.div>
                  <motion.div 
                          className="group"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors duration-200">Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                            <span className="group-hover:text-indigo-600 transition-colors duration-200">{user.phone_number || 'Not specified'}</span>
                          </dd>
                        </motion.div>
                      </div>
                  </motion.div>

                    {/* Education Card */}
                  <motion.div 
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)",
                        borderColor: "rgba(79, 70, 229, 0.3)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg mr-3">
                            <School className="h-5 w-5 text-indigo-600" />
                          </div>
                          <h3 className="text-base font-medium text-gray-900">Education</h3>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:p-6 space-y-4">
                  <motion.div 
                          className="group"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors duration-200">College</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                            <School className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                            <span className="group-hover:text-indigo-600 transition-colors duration-200">{user.college || 'Not specified'}</span>
                          </dd>
                  </motion.div>
                  <motion.div 
                          className="group"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors duration-200">Semester</dt>
                          <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                            <span className="group-hover:text-indigo-600 transition-colors duration-200">{user.semester || 'Not specified'}</span>
                          </dd>
                  </motion.div>
                      </div>
                  </motion.div>
                  </div>

                  {/* Bio Section */}
                    <motion.div 
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
                    whileHover={{ 
                      boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)",
                      borderColor: "rgba(79, 70, 229, 0.3)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg mr-3">
                          <UserIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="text-base font-medium text-gray-900">About</h3>
                      </div>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {user.bio || 'No bio information added yet.'}
                      </p>
                    </div>
                    </motion.div>

                  {/* Skills & Interests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills */}
                    <motion.div 
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)",
                        borderColor: "rgba(79, 70, 229, 0.3)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg mr-3">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h3 className="text-base font-medium text-gray-900">Skills</h3>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        {user.skills && user.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, index) => (
                              <motion.span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                whileHover={{ 
                                  scale: 1.05, 
                                  backgroundColor: "rgb(165, 180, 252)",
                                  color: "rgb(55, 48, 163)"
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                  duration: 0.2,
                                  delay: 0.4 + (index * 0.05)
                                }}
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No skills added yet.</p>
                        )}
                      </div>
                </motion.div>

                    {/* Interests */}
                <motion.div 
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)",
                        borderColor: "rgba(79, 70, 229, 0.3)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg mr-3">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <h3 className="text-base font-medium text-gray-900">Interests</h3>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        {user.interests && user.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.interests.map((interest, index) => (
                              <motion.span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-300 hover:text-indigo-900 transition-colors duration-200"
                                whileHover={{ 
                                  scale: 1.05,
                                  boxShadow: "0 4px 8px rgba(99, 102, 241, 0.15)",
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                {interest}
                              </motion.span>
                            ))}
              </div>
                        ) : (
                          <p className="text-sm text-gray-500">No interests added yet.</p>
            )}
          </div>
        </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </motion.div>
    </>
  );
};

export default Profile; 