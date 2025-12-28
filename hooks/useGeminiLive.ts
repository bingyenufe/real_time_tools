import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import { useApiKey } from '../contexts/ApiKeyContext';

interface ConnectConfig {
  systemInstruction: string;
  voiceName?: string;
}

export const useGeminiLive = () => {
  const { apiKey } = useApiKey();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [error, setError] = useState<string | null>(null);
  
  // Audio Contexts and Nodes
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  
  // Session Management
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close()).catch(() => {});
        sessionPromiseRef.current = null;
    }

    // Cleanup Audio Inputs
    if (inputSourceRef.current) inputSourceRef.current.disconnect();
    if (processorRef.current) processorRef.current.disconnect();
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    
    // Cleanup Audio Outputs
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();

    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  const connect = useCallback(async ({ systemInstruction, voiceName = 'Kore' }: ConnectConfig) => {
    if (!apiKey) {
      setError("Please enter your API Key first.");
      return;
    }

    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Setup Output Node
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);

      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Connect to Gemini Live
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            
            // Setup Input Processing
            if (!inputAudioContextRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
            
            inputSourceRef.current = source;
            processorRef.current = scriptProcessor;
          },
          onmessage: async (message: LiveServerMessage) => {
            const outputCtx = outputAudioContextRef.current;
            if (!outputCtx || !outputNodeRef.current) return;

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio) {
              setIsSpeaking(true);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              try {
                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  outputCtx,
                  24000,
                  1
                );
                
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNodeRef.current);
                
                source.addEventListener('ended', () => {
                  audioSourcesRef.current.delete(source);
                  if (audioSourcesRef.current.size === 0) {
                     setIsSpeaking(false);
                  }
                });
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
              } catch (e) {
                console.error("Error decoding audio", e);
              }
            }

            // Handle Interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
                console.log("Interrupted");
              for (const source of audioSourcesRef.current) {
                source.stop();
              }
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Session error:", err);
            setError("Connection Error. Please check your API key.");
            disconnect();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          },
          systemInstruction: systemInstruction,
        },
      });

    } catch (err) {
      console.error(err);
      setError("Failed to initialize session.");
      setIsConnected(false);
    }
  }, [apiKey, disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
    isSpeaking,
    error,
  };
};