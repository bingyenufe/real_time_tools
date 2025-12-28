import React from 'react';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500/30">
      
      <nav className="fixed top-0 w-full z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                LinguaFlow
              </span>
            </div>
            
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
};