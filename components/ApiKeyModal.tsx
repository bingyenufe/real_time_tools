import React, { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import { Key, Lock } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { apiKey, setApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState('');

  if (apiKey) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 10) {
      setApiKey(inputValue.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-500/20 p-4 rounded-full">
            <Key className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Enter Gemini API Key</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          To use these real-time tools, you need to provide your own Google Gemini API key. 
          Your key is stored locally in your browser and never sent to our servers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            Access Tools
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            Get an API Key from Google AI Studio
          </a>
        </div>
      </div>
    </div>
  );
};