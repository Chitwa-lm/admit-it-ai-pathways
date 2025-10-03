import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Database, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const DatabaseConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('count')
        .limit(1);

      if (error) {
        setIsConnected(false);
        setError(error.message);
      } else {
        setIsConnected(true);
        setError(null);
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowStatus(false), 3000);
      }
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  if (!showStatus) return null;

  return (
    <div className={`fixed top-4 left-4 max-w-md p-4 rounded-lg shadow-lg z-50 ${
      isConnected === null 
        ? 'bg-blue-50 border border-blue-200' 
        : isConnected 
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isConnected === null && <Database className="w-5 h-5 text-blue-600 animate-pulse" />}
          {isConnected === true && <CheckCircle className="w-5 h-5 text-green-600" />}
          {isConnected === false && <AlertCircle className="w-5 h-5 text-red-600" />}
        </div>
        
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${
            isConnected === null 
              ? 'text-blue-900' 
              : isConnected 
                ? 'text-green-900'
                : 'text-red-900'
          }`}>
            {isConnected === null && 'Checking Database Connection...'}
            {isConnected === true && 'Database Connected'}
            {isConnected === false && 'Database Connection Failed'}
          </h4>
          
          {error && (
            <div className="mt-2">
              <p className="text-sm text-red-700">
                {error.includes('Invalid API key') 
                  ? 'Invalid Supabase API key. Please check your .env file.'
                  : error
                }
              </p>
              
              {error.includes('Invalid API key') && (
                <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                  <p className="font-medium">To fix this:</p>
                  <ol className="mt-1 space-y-1 list-decimal list-inside">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Copy the Project URL and anon key</li>
                    <li>Update your .env file with the correct values</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowStatus(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};