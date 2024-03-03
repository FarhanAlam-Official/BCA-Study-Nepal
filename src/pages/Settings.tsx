import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface OAuthStatus {
  status: 'success' | 'error' | null;
  message: string | null;
}

const Settings = () => {
  const [searchParams] = useSearchParams();
  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus>({ status: null, message: null });

  useEffect(() => {
    const oauth = searchParams.get('oauth');
    const reason = searchParams.get('reason');

    if (oauth === 'success') {
      setOAuthStatus({
        status: 'success',
        message: 'Gmail authentication was successful!'
      });
    } else if (oauth === 'error') {
      setOAuthStatus({
        status: 'error',
        message: `Gmail authentication failed: ${reason || 'Unknown error'}`
      });
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* OAuth Status Messages */}
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

      {/* Settings Sections */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Gmail Integration</h3>
            <p className="text-gray-600 mb-4">
              Connect your Gmail account to enable sending emails through the application.
            </p>
            <button
              onClick={() => window.location.href = 'http://localhost:8000/api/users/google/auth/'}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              {oauthStatus.status === 'success' ? 'Reconnect Gmail' : 'Connect Gmail'}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Settings Sections */}
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