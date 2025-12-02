import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { Message } from '../types';

const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your DGX H100 architecture assistant. Ask me about the system topology, interconnects, or specific components.', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Format history for the service
      const historyForService = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToGemini(historyForService, userMsg.text);
      
      const aiMsg: Message = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white font-semibold flex items-center gap-2">
               <span className="text-emerald-400">⚡</span> AI Architect
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-900/90">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                   <div className="bg-slate-800 text-slate-400 p-3 rounded-lg text-xs italic">Thinking...</div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about the architecture..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded transition-colors disabled:opacity-50"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-4 shadow-lg transition-all hover:scale-105 flex items-center justify-center w-14 h-14"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatInterface;

