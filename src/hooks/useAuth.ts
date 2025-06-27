/**
 * Custom hook for accessing authentication context throughout the application.
 * This hook provides access to authentication state and methods from the AuthContext.
 */

import { useContext } from 'react';
import AuthContext, { AuthContextType } from '../context/AuthContext';

/**
 * Hook to access authentication context
 * @returns {AuthContextType} The authentication context containing user state and auth methods
 * @throws {Error} If used outside of AuthProvider context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 