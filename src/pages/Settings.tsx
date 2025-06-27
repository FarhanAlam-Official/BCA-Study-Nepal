/**
 * Settings Page Component
 * 
 * A comprehensive settings management interface that handles user configurations
 * and third-party service integrations.
 * 
 * Features:
 * - OAuth integration with Gmail
 * - Persistent connection state management
 * - Real-time status updates and notifications
 * - Error handling and user feedback
 * - Responsive layout design
 * 
 * Technical Implementation:
 * - Uses localStorage for connection state persistence
 * - Implements OAuth 2.0 flow for Gmail
 * - Handles callback responses and error states
 * - Provides visual feedback for all operations
 */

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * OAuth Status Interface
 * Tracks the state and feedback of OAuth operations
 * 
 * @property status - Current operation status (success/error/null)
 * @property message - User-friendly status message
 */
interface OAuthStatus {
  status: 'success' | 'error' | null;
  message: string | null;
}

/**
 * API Configuration
 * Centralized API endpoint configuration
 */
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    GMAIL_CHECK: '/api/users/google/check-connection/',
    GMAIL_AUTH: '/api/users/google/auth/',
  }
};

/**
 * Settings Component
 * Main settings interface component that manages user configurations
 * and third-party service integrations.
 */
const Settings = () => {
  // URL parameters for OAuth callback handling
  const [searchParams] = useSearchParams();
  
  // State management
  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus>({ status: null, message: null });
  const [isGmailConnected, setIsGmailConnected] = useState<boolean>(false);

  /**
   * Connection Error Handler
   * Centralizes connection error handling logic
   */
  const handleConnectionError = useCallback(() => {
    setIsGmailConnected(false);
    localStorage.removeItem('gmailConnected');
  }, []);

  /**
   * Gmail Connection Check
   * Verifies the current Gmail connection status using both
   * local storage and backend validation
   */
  const checkGmailConnection = useCallback(async () => {
    try {
      // Check cached connection status first
      const cachedStatus = localStorage.getItem('gmailConnected');
      if (cachedStatus === 'true') {
        setIsGmailConnected(true);
        return;
      }

      // Verify connection with backend
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GMAIL_CHECK}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsGmailConnected(data.isConnected);
        if (data.isConnected) {
          localStorage.setItem('gmailConnected', 'true');
        }
      } else {
        handleConnectionError();
      }
    } catch (error) {
      handleConnectionError();
      console.error('Gmail connection check failed:', error);
    }
  }, [handleConnectionError]);

  /**
   * Gmail Authentication Handler
   * Initiates the Gmail OAuth flow
   */
  const handleGmailAuth = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GMAIL_AUTH}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate Gmail authentication');
      }
      
      const data = await response.json();
      
      if (data.auth_url) {
        if (data.state) {
          localStorage.setItem('oauth_state', data.state);
        }
        window.location.assign(data.auth_url);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Gmail authentication initiation failed:', error);
      setOAuthStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to initiate Gmail authentication'
      });
    }
  };

  /**
   * Initial Connection Check
   * Verifies Gmail connection status on component mount
   */
  useEffect(() => {
    checkGmailConnection();
  }, [checkGmailConnection]);

  /**
   * OAuth Callback Handler
   * Processes OAuth response parameters and updates connection state
   */
  useEffect(() => {
    const oauth = searchParams.get('oauth');
    const reason = searchParams.get('reason');

    if (oauth === 'success') {
      setOAuthStatus({
        status: 'success',
        message: 'Gmail authentication was successful!'
      });
      setIsGmailConnected(true);
      localStorage.setItem('gmailConnected', 'true');
    } else if (oauth === 'error') {
      setOAuthStatus({
        status: 'error',
        message: `Gmail authentication failed: ${reason || 'Unknown error'}`
      });
      handleConnectionError();
    }
  }, [searchParams, handleConnectionError]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Status Notifications */}
      {oauthStatus.status && (
        <div className={`
          ${oauthStatus.status === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}
          px-4 py-3 rounded relative mb-6 border
        `}>
          <strong className="font-bold">{oauthStatus.status === 'success' ? 'Success! ' : 'Error! '}</strong>
          <span className="block sm:inline">{oauthStatus.message}</span>
        </div>
      )}

      {/* Email Integration Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Gmail Integration</h3>
            <p className="text-gray-600 mb-4">
              {isGmailConnected 
                ? 'Your Gmail account is connected. You can send emails through the application.'
                : 'Connect your Gmail account to enable sending emails through the application.'}
            </p>
            <button
              onClick={handleGmailAuth}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              {isGmailConnected ? 'Reconnect Gmail' : 'Connect Gmail'}
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <div className="space-y-4">
          {/* Additional account settings can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Settings; 