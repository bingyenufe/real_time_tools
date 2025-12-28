import React, { useEffect, useRef } from 'react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { Sparkles, Play, Square, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const KidsEnglish: React.FC = () => {
  const { connect, disconnect, isConnected, isSpeaking, error } = useGeminiLive();
  const navigate = useNavigate();
  
  const handleConnect = () => {
    connect({
      voiceName: 'Puck', // A more playful voice
      systemInstruction: `You are a cheerful, playful, and extremely patient English teacher for a 5-year-old child. 
      The child mainly speaks Chinese and knows only about 10 English words.
      
      Your main tasks:
      1. When the child asks "What is [Chinese Word] in English?", answer clearly with the English word.
      2. Repeat the English word slowly and ask the child to say it with you.
      3. If they try to say it (even imperfectly), praise them enthusiastically! (e.g., "Wow! Great job!", "You are so smart!").
      4. If appropriate, ask a very simple follow-up question using that word.
      
      Important behavior:
      - The child speaks very slowly and may pause for 3-5 seconds between words. DO NOT INTERRUPT. Wait until they are completely finished.
      - Use simple vocabulary.
      - Be warm, encouraging, and fun.
      - You can use a little bit of Chinese to explain if they are stuck, but try to use English.
      - IGNORE short silences or background noise, assume the child is still thinking.
      `
    });
  };
  
  // Visualizer refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Visualizer effect (Warm colors for kids)
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
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      if (isConnected) {
        const baseRadius = 70; // Slightly larger for kids
        const amplitude = isSpeaking ? 25 : 8;
        const speed = isSpeaking ? 0.15 : 0.04;
        
        t += speed;
        
        ctx.beginPath();
        // Bouncy playful shape
        const radius = baseRadius + Math.sin(t) * amplitude;
        
        // Warm Gradient (Orange/Pink/Yellow)
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
        if (isSpeaking) {
          gradient.addColorStop(0, '#fcd34d'); // Amber-300
          gradient.addColorStop(0.5, '#fb923c'); // Orange-400
          gradient.addColorStop(1, '#db2777'); // Pink-600
        } else {
          gradient.addColorStop(0, '#f9a8d4'); // Pink-300
          gradient.addColorStop(1, '#f472b6'); // Pink-400
        }
        
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Fun glow
        ctx.shadowBlur = 40;
        ctx.shadowColor = isSpeaking ? '#fbbf24' : '#ec4899';
      } else {
        // Idle state - nice warm circle
        ctx.beginPath();
        ctx.fillStyle = '#4b5563'; 
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

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
      
      {/* Header - Kid Friendly */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400 fill-current" />
          Kids English Buddy
        </h2>
        <p className="text-gray-300 max-w-lg text-lg">
          Ask me: "What is 苹果 in English?" <br/>
          I'll help you learn new words! 🎈
        </p>
      </div>

      {/* Visualizer Area */}
      <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-full border-[6px] border-orange-500/30 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-orange-500/20">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Kid friendly status */}
        <div className="relative z-10 pointer-events-none text-center">
          {!isConnected && (
            <span className="text-gray-400 font-bold text-xl">Tap Play! ▶️</span>
          )}
          {isConnected && !isSpeaking && (
            <div className="flex flex-col items-center">
              <span className="text-pink-300 font-bold text-2xl animate-bounce">I'm listening...</span>
              <span className="text-sm text-gray-400">(Take your time)</span>
            </div>
          )}
          {isConnected && isSpeaking && (
            <span className="text-white font-bold text-2xl drop-shadow-md">I'm talking! 🗣️</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl font-bold text-center w-full">
            Oops! {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white px-10 py-5 rounded-full font-extrabold text-xl shadow-xl shadow-orange-500/30 transition-all hover:scale-110 active:scale-95"
            >
              <Play className="w-8 h-8 fill-current" />
              Let's Play!
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Square className="w-6 h-6 fill-current" />
              Stop
            </button>
          )}
        </div>

        {/* Kid friendly tips */}
        <div className="grid grid-cols-2 gap-4 w-full mt-4">
           <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700 flex flex-col items-center text-center">
             <Star className="w-6 h-6 mb-2 text-yellow-400 fill-yellow-400" />
             <span className="text-gray-200 font-bold">You are doing great!</span>
           </div>
           <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700 flex flex-col items-center text-center">
             <Heart className="w-6 h-6 mb-2 text-pink-500 fill-pink-500" />
             <span className="text-gray-200 font-bold">I will wait for you</span>
           </div>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-white text-base font-medium mt-4 hover:underline"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};