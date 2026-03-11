
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VAS_ICONS } from '../config/icons';
import { X, Send, Sparkles, MapPin, Zap, Brain, MessageSquare, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  systemContext: any;
}

type Message = {
  role: 'user' | 'assistant' | 'thinking';
  content: string;
  type?: 'text' | 'map' | 'insight';
  sources?: any[];
};

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, language, systemContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const t = {
    title: language === 'ar' ? 'مساعد VAS الذكي' : 'VAS AI Assistant',
    placeholder: language === 'ar' ? 'اسأل عن حالة النظام، الضيوف، أو المواقع...' : 'Ask about system status, VIPs, or locations...',
    thinking: language === 'ar' ? 'جاري التحليل العميق...' : 'Deep analysis in progress...',
    fastResponse: language === 'ar' ? 'استجابة سريعة' : 'Fast Response',
    strategic: language === 'ar' ? 'تحليل استراتيجي' : 'Strategic Analysis',
    maps: language === 'ar' ? 'بحث جغرافي' : 'Map Intelligence',
  };

  const handleSendMessage = async (mode: 'fast' | 'strategic' | 'map') => {
    if (!input.trim() || isTyping) return;

    const userQuery = input;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsTyping(true);

    // Initializing Gemini client per guidelines with direct process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      if (mode === 'strategic') {
        setMessages(prev => [...prev, { role: 'thinking', content: t.thinking }]);
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Context: ${JSON.stringify(systemContext)}. User Query: ${userQuery}`,
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: "You are VAS AI, a strategic security analyst. Provide deep insights based on the current system state. Use Markdown formatting."
          },
        });
        setMessages(prev => prev.filter(m => m.role !== 'thinking'));
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || '', type: 'insight' }]);
      } 
      else if (mode === 'map') {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userQuery,
          config: {
            tools: [{ googleMaps: {} }],
            systemInstruction: "You are a logistics assistant for VAS. Use Google Maps to find nearby facilities like hospitals, hotels, or restaurants for VIP arrivals."
          },
        });
        // Extracting grounding chunks as per guidelines for maps grounding
        const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || '', type: 'map', sources: urls }]);
      } 
      else {
        // Fast mode: using 'gemini-flash-lite-latest' as recommended alias
        const response = await ai.models.generateContent({
          model: 'gemini-flash-lite-latest',
          contents: userQuery,
          config: {
            systemInstruction: "You are a helpful assistant for the VIP Arrival System. Give extremely concise and fast answers."
          },
        });
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || '' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] animate-pulse">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black dark:text-white leading-tight">{t.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multi-Model Hybrid Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <Brain size={64} className="text-indigo-500" />
              <div className="max-w-xs">
                <p className="text-sm font-black dark:text-white uppercase tracking-widest">{language === 'ar' ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I assist you today?'}</p>
                <p className="text-xs text-slate-500 mt-2 font-bold">{language === 'ar' ? 'يمكنني تحليل البيانات، العثور على المواقع، أو تقديم تقارير سريعة' : 'I can analyze data, find locations, or provide quick reports'}</p>
              </div>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-6 rounded-[28px] ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : m.role === 'thinking'
                  ? 'bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-indigo-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 dark:text-slate-100'
              }`}>
                {m.role === 'thinking' && <Loader2 className="w-4 h-4 animate-spin mb-2 text-indigo-500" />}
                <p className={`text-sm leading-relaxed ${m.role === 'thinking' ? 'font-black italic text-indigo-500' : 'font-medium'}`}>
                  {m.content}
                </p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <p className="text-[9px] font-black uppercase text-slate-400">Sources</p>
                    {m.sources.map((s: any, idx) => (
                      <a key={idx} href={s.maps?.uri || s.web?.uri} target="_blank" className="block text-[10px] text-indigo-500 underline font-bold truncate">
                        {s.maps?.title || s.web?.title || 'External Resource'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length-1].role !== 'thinking' && (
             <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Input & Modes */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 space-y-4 shrink-0 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleSendMessage('fast')} className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
              <Zap size={14} /> {t.fastResponse}
            </button>
            <button onClick={() => handleSendMessage('strategic')} className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
              <Brain size={14} /> {t.strategic}
            </button>
            <button onClick={() => handleSendMessage('map')} className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
              <MapPin size={14} /> {t.maps}
            </button>
          </div>

          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage('fast')}
              placeholder={t.placeholder}
              className="w-full p-5 pr-32 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[28px] text-sm font-bold dark:text-white outline-none focus:border-indigo-600 transition-all shadow-xl"
            />
            <button 
              onClick={() => handleSendMessage('fast')}
              className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'left-4' : 'right-4'} w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-700 active:scale-95 transition-all`}
            >
              <Send size={20} className={language === 'ar' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
