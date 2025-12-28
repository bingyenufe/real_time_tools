import React from 'react';

export interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  removeApiKey: () => void;
}

export interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  status: 'active' | 'coming-soon';
  color: string;
}

// Audio Utils Types
export interface AudioBlob {
  data: string;
  mimeType: string;
}