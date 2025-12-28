import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageSquare, ArrowRight, Lock, Sparkles, Rocket } from 'lucide-react';
import { ToolCardProps } from '../types';

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, status, color, path }) => {
  const navigate = useNavigate();
  const isLocked = status === 'coming-soon';

  return (
    <div 
      onClick={() => !isLocked && path && navigate(path)}
      className={`relative group p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-all duration-300 overflow-hidden ${!isLocked ? 'cursor-pointer hover:border-gray-700 hover:shadow-2xl hover:shadow-indigo-500/10' : 'opacity-60 cursor-not-allowed'}`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-gray-800 text-white group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {isLocked ? (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700">
            Coming Soon
          </span>
        ) : (
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
          <Lock className="w-8 h-8 text-gray-500" />
        </div>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
  const tools: ToolCardProps[] = [
    {
      title: "English Tutor",
      description: "Real-time conversation practice designed for beginners. The AI listens patiently and corrects gently.",
      icon: <Mic className="w-6 h-6" />,
      status: 'active',
      path: '/english-tutor',
      color: 'bg-indigo-500'
    },
    {
      title: "Kids English",
      description: "A fun, playful buddy for 5-year-olds. Ask 'What is apple in English?' and start learning!",
      icon: <Sparkles className="w-6 h-6" />,
      status: 'active',
      path: '/kids-english',
      color: 'bg-orange-500'
    },
    {
      title: "小小科学家 (Curiosity Pal)",
      description: "Why is the sky blue? Ask me anything in Chinese! I explain the world's wonders to curious minds.",
      icon: <Rocket className="w-6 h-6" />,
      status: 'active',
      path: '/curiosity-pal',
      color: 'bg-cyan-500'
    },
    {
      title: "Debate Partner",
      description: "Challenge your critical thinking by debating complex topics with an adaptive AI opponent.",
      icon: <MessageSquare className="w-6 h-6" />,
      status: 'coming-soon',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Real-Time AI Suite
        </h1>
        <p className="text-lg text-gray-400">
          Experience the next generation of low-latency AI interactions. 
          Select a tool below to begin your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <ToolCard key={index} {...tool} />
        ))}
      </div>
    </div>
  );
};