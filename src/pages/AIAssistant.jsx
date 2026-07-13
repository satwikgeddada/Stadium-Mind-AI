import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello Operator Alpha. StadiumMind AI is online and monitoring all systems. You can ask me questions like 'Where is Gate B?' or 'Nearest Washroom?'.", 
      sender: 'ai' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const newUserMsg = { id: Date.now(), text: userText, sender: 'user' };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      
      const data = await res.json();
      
      const aiResponseText = data.reply || "Sorry, I couldn't process that request.";
      
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: aiResponseText, 
          sender: 'ai' 
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: "Connection to AI core lost. Please ensure the FastAPI backend is running at http://localhost:8000.", 
          sender: 'ai' 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card p-0 overflow-hidden relative">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
          <Bot className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="font-bold text-slate-100 flex items-center gap-2">
            StadiumMind Nexus <Sparkles className="w-4 h-4 text-amber-400" />
          </h2>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online & Analyzing
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-900/30 relative scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id} 
              className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-purple-600' : 'bg-blue-600/20 border border-blue-500/30'
              }`}>
                {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-sm shadow-lg shadow-purple-900/20' 
                  : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-sm shadow-xl'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[80%]"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-600/20 border border-blue-500/30">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-sm text-slate-400">Processing query...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-md z-10">
        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="E.g., Where is Gate B? or Nearest Washroom?" 
            className="glass-input flex-1 py-3 px-5 rounded-full bg-slate-900/60 focus:bg-slate-900/90"
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 rounded-full glass-button-primary flex items-center justify-center p-0 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
