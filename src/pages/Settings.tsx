/**
 * Settings Page Component
 * 
 * This component handles user settings and configurations, including:
 * - OAuth integrations (Gmail)
 * - Account settings
 * - Status messages for OAuth operations
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Interface for OAuth operation status
 * Tracks the success/failure state and associated messages
 */
interface OAuthStatus {
  status: 'success' | 'error' | null;
  message: string | null;
}

/**
 * Settings Component
 * Manages and displays user settings and configuration options
 */
const Settings = () => {
  const [searchParams] = useSearchParams();
  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus>({ status: null, message: null });
  const [isGmailConnected, setIsGmailConnected] = useState<boolean>(false);

  // Effect to check Gmail connection status on component mount
  useEffect(() => {
    checkGmailConnection();
  }, []);

  // Effect to handle OAuth callback responses
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
      setIsGmailConnected(false);
      localStorage.removeItem('gmailConnected');
    }
  }, [searchParams]);

  // Function to check Gmail connection status
  const checkGmailConnection = async () => {
    try {
      // First check localStorage for cached status
      const cachedStatus = localStorage.getItem('gmailConnected');
      if (cachedStatus === 'true') {
        setIsGmailConnected(true);
        return;
      }

      // If not in cache, check with backend
      const response = await fetch('http://localhost:8000/api/users/google/check-connection/', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsGmailConnected(data.isConnected);
        if (data.isConnected) {
          localStorage.setItem('gmailConnected', 'true');
        }
      } else {
        setIsGmailConnected(false);
        localStorage.removeItem('gmailConnected');
      }
    } catch (error) {
      console.error('Failed to check Gmail connection:', error);
      setIsGmailConnected(false);
      localStorage.removeItem('gmailConnected');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* OAuth Status Messages - Display success/error notifications */}
      {oauthStatus.status === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{oauthStatus.message}</span>
        </div>
      )}

      {oauthStatus.status === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error! </strong>
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
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:8000/api/users/google/auth/', {
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
                  console.log('Received auth data:', data);
                  
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
                  console.error('Failed to initiate Gmail authentication:', error);
                  setOAuthStatus({
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Failed to initiate Gmail authentication'
                  });
                }
              }}
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
          {/* Add more settings options here */}
        </div>
      </div>
    </div>
  );
};

export default Settings; 