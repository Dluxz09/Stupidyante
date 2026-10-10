import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Cloud, HardDrive, Loader2 } from 'lucide-react';
import { useOSStore } from '../useOSStore';
import { playSound } from '../utils/sounds';

export default function LocalAgent({ onClose }) {
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  const schedule = useOSStore((state) => state.schedule);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your hybrid AI copilot. I'm aware of your notes and schedule. Ask me anything!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [modelUsed, setModelUsed] = useState(null);
  
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    playSound('click');
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Build context string from global state and DB
      let contextStr = `Current Schedule: ${JSON.stringify(schedule)}\n`;
      
      // Attempt to fetch notes quickly to bundle in context
      try {
        const resNotes = await fetch("http://localhost:8000/notes");
        const notesData = await resNotes.json();
        contextStr += `Saved Notes: ${JSON.stringify(notesData.map(n => n.title))}\n`;
      } catch (e) {
        contextStr += "Could not load notes.\n";
      }

      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, context: contextStr })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || data.error }]);
      if (data.model) setModelUsed(data.model);
      playSound('pop');
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to AI backend." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed bottom-24 right-8 w-80 h-96 rounded-2xl border-4 flex flex-col shadow-xl z-[9000] overflow-hidden ${
      isDarkMode 
        ? "bg-[#1E2028] border-slate-700 shadow-[4px_4px_0px_0px_#0f172a]" 
        : "bg-white border-amber-300 shadow-[4px_4px_0px_0px_#fde047]"
    }`}>
      {/* Header */}
      <div className={`p-3 flex justify-between items-center border-b-2 ${
        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-amber-100 border-amber-200"
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className={isDarkMode ? "text-sky-400" : "text-amber-600"} />
          <h3 className={`font-bold text-sm ${isDarkMode ? "text-slate-200" : "text-amber-900"}`}>LocalAgent Copilot</h3>
        </div>
        <button onClick={() => { playSound('close'); onClose(); }} className="hover:opacity-70">
          <X size={16} className={isDarkMode ? "text-slate-400" : "text-amber-800"} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 font-mono text-xs">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"}`}>
            <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
              msg.role === 'user' 
                ? isDarkMode ? "bg-sky-600 text-white rounded-br-sm" : "bg-amber-400 text-amber-950 rounded-br-sm"
                : isDarkMode ? "bg-slate-800 text-slate-200 rounded-bl-sm" : "bg-slate-100 border text-slate-800 rounded-bl-sm"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`p-2.5 rounded-xl flex items-center gap-2 ${
              isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
            }`}>
              <Loader2 size={12} className="animate-spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Model Indicator */}
      {modelUsed && (
        <div className={`px-3 py-1 text-[9px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider ${
          modelUsed.includes('Gemini') 
            ? isDarkMode ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-600"
            : isDarkMode ? "bg-amber-950/50 text-amber-400" : "bg-rose-50 text-rose-600"
        }`}>
          {modelUsed.includes('Gemini') ? <Cloud size={10} /> : <HardDrive size={10} />}
          Powered by {modelUsed}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className={`p-2 border-t-2 flex gap-2 ${
        isDarkMode ? "bg-slate-900 border-slate-700" : "bg-amber-50/50 border-amber-200"
      }`}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your notes..."
          className={`flex-1 px-3 py-2 rounded-lg text-xs outline-none ${
            isDarkMode ? "bg-slate-800 text-white placeholder-slate-500" : "bg-white text-slate-800 border placeholder-slate-400"
          }`}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isTyping}
          className={`p-2 rounded-lg disabled:opacity-50 transition-all ${
            isDarkMode ? "bg-sky-600 text-white hover:bg-sky-500" : "bg-amber-400 text-amber-950 hover:bg-amber-300"
          }`}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
