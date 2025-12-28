import React, { useEffect, useRef } from 'react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { Mic, MicOff, Play, Square, Activity, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EnglishTutor: React.FC = () => {
  const { connect, disconnect, isConnected, isSpeaking, error } = useGeminiLive();
  const navigate = useNavigate();
  
  // Visualizer refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Simple visualizer effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Base circle
      const centerX = width / 2;
      const centerY = height / 2;
      
      if (isConnected) {
        // Animation params based on state
        const baseRadius = 60;
        const amplitude = isSpeaking ? 20 : 5;
        const speed = isSpeaking ? 0.2 : 0.05;
        
        t += speed;
        
        ctx.beginPath();
        const radius = baseRadius + Math.sin(t) * amplitude;
        
        // Gradient for the orb
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
        if (isSpeaking) {
          gradient.addColorStop(0, '#818cf8'); // Indigo-400
          gradient.addColorStop(1, '#4f46e5'); // Indigo-600
        } else {
          gradient.addColorStop(0, '#34d399'); // Emerald-400
          gradient.addColorStop(1, '#059669'); // Emerald-600
        }
        
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = isSpeaking ? '#6366f1' : '#10b981';
      } else {
        // Idle state
        ctx.beginPath();
        ctx.fillStyle = '#374151'; // Gray-700
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    // Set canvas size
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isConnected, isSpeaking]);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <span className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
            <Mic className="w-6 h-6" />
          </span>
          English Tutor
        </h2>
        <p className="text-gray-400 max-w-lg">
          Practice speaking English at your own pace. The AI is patient and will wait for you to finish your sentences.
        </p>
      </div>

      {/* Visualizer Area */}
      <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-full border-4 border-gray-800 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-gray-950/50">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Status Text Overlay */}
        <div className="relative z-10 pointer-events-none">
          {!isConnected && (
            <span className="text-gray-500 font-medium">Ready to start</span>
          )}
          {isConnected && !isSpeaking && (
            <span className="text-emerald-400 font-medium animate-pulse">Listening...</span>
          )}
          {isConnected && isSpeaking && (
            <span className="text-indigo-200 font-medium">Speaking...</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm text-center w-full">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isConnected ? (
            <button
              onClick={connect}
              className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-6 h-6 fill-current" />
              Start Conversation
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Square className="w-6 h-6 fill-current" />
              End Session
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 w-full mt-4">
           <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex flex-col items-center text-center">
             <Activity className="w-5 h-5 mb-2 text-indigo-400" />
             <span className="text-gray-300 font-medium">Patient Mode</span>
             <span className="text-xs mt-1">Waits 2-3s for silence</span>
           </div>
           <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex flex-col items-center text-center">
             <Volume2 className="w-5 h-5 mb-2 text-emerald-400" />
             <span className="text-gray-300 font-medium">Full Duplex</span>
             <span className="text-xs mt-1">Natural interruption supported</span>
           </div>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-white text-sm mt-4 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};