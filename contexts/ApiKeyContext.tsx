import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiKeyContextType } from '../types';

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKeyState(key);
  };

  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKeyState(null);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, removeApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};