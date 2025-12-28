import React, { useEffect, useRef } from 'react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { Rocket, Play, Square, Lightbulb, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CuriosityPal: React.FC = () => {
  const { connect, disconnect, isConnected, isSpeaking, error } = useGeminiLive();
  const navigate = useNavigate();
  
  const handleConnect = () => {
    connect({
      voiceName: 'Kore', // A calm, gentle voice
      systemInstruction: `你的角色是“奇奇”，一个专门为5岁中国小朋友解答“十万个为什么”的百科全书小精灵。
      
      核心规则：
      1. **全程只说中文**。
      2. **极度耐心**：小朋友说话可能会结巴、停顿或逻辑不清。绝对不要打断他们！如果他们停顿了3秒以上，温柔地问：“然后呢？”或者“你在想什么呢？”
      3. **鼓励优先**：无论孩子问什么（哪怕是很傻的问题），第一句话必须是夸奖。例如：“哇，这个问题太棒了！”、“你观察得真仔细！”
      4. **简单易懂**：禁止使用成语或专业术语。把所有科学原理用“比喻”讲出来。
         - 错误：重力是地球的引力作用。
         - 正确：地球就像一个超级大的磁铁，把你吸在地面上，这样你就不会飞到太空里去啦！
      5. **激发好奇**：回答完问题后，永远反问一个有趣的小问题，引导孩子继续思考。
      `
    });
  };
  
  // Visualizer refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Visualizer effect (Science/Space colors)
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
        const baseRadius = 70;
        const amplitude = isSpeaking ? 25 : 8;
        const speed = isSpeaking ? 0.15 : 0.04;
        
        t += speed;
        
        ctx.beginPath();
        const radius = baseRadius + Math.sin(t) * amplitude;
        
        // Science Gradient (Cyan/Blue/Purple)
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
        if (isSpeaking) {
          gradient.addColorStop(0, '#22d3ee'); // Cyan-400
          gradient.addColorStop(0.5, '#3b82f6'); // Blue-500
          gradient.addColorStop(1, '#8b5cf6'); // Violet-500
        } else {
          gradient.addColorStop(0, '#67e8f9'); // Cyan-300
          gradient.addColorStop(1, '#06b6d4'); // Cyan-500
        }
        
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Cosmic glow
        ctx.shadowBlur = 40;
        ctx.shadowColor = isSpeaking ? '#a78bfa' : '#22d3ee';
        
        // Add little stars/particles when speaking
        if (isSpeaking) {
            ctx.fillStyle = '#ffffff';
            for(let i=0; i<3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = radius + Math.random() * 20;
                ctx.beginPath();
                ctx.arc(centerX + Math.cos(angle)*r, centerY + Math.sin(angle)*r, 2, 0, Math.PI*2);
                ctx.fill();
            }
        }

      } else {
        // Idle state
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
      
      {/* Header - Science Theme */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center gap-3">
          <Rocket className="w-8 h-8 text-cyan-400 fill-current" />
          小小科学家 (Curiosity Pal)
        </h2>
        <p className="text-gray-300 max-w-lg text-lg">
          我是奇奇！<br/>
          问我任何问题：为什么天空是蓝的？鱼儿怎么睡觉？🌍
        </p>
      </div>

      {/* Visualizer Area */}
      <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-full border-[6px] border-cyan-500/30 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-cyan-500/20">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 pointer-events-none text-center">
          {!isConnected && (
            <span className="text-gray-400 font-bold text-xl">点我开始！▶️</span>
          )}
          {isConnected && !isSpeaking && (
            <div className="flex flex-col items-center">
              <span className="text-cyan-300 font-bold text-2xl animate-pulse">我在听...</span>
              <span className="text-sm text-gray-400">(慢慢说，我不着急)</span>
            </div>
          )}
          {isConnected && isSpeaking && (
            <span className="text-white font-bold text-2xl drop-shadow-md">奇奇在思考... 🧠</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl font-bold text-center w-full">
            哎呀！出错了：{error}
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-full font-extrabold text-xl shadow-xl shadow-cyan-500/30 transition-all hover:scale-110 active:scale-95"
            >
              <Play className="w-8 h-8 fill-current" />
              我们聊天吧！
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Square className="w-6 h-6 fill-current" />
              停止
            </button>
          )}
        </div>

        {/* Kid friendly tips */}
        <div className="grid grid-cols-2 gap-4 w-full mt-4">
           <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700 flex flex-col items-center text-center">
             <Lightbulb className="w-6 h-6 mb-2 text-yellow-300 fill-yellow-300" />
             <span className="text-gray-200 font-bold">我想知道为什么...</span>
           </div>
           <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700 flex flex-col items-center text-center">
             <Globe className="w-6 h-6 mb-2 text-green-400 fill-green-400" />
             <span className="text-gray-200 font-bold">世界真奇妙！</span>
           </div>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-white text-base font-medium mt-4 hover:underline"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};