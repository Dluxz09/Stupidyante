import { useState } from 'react';
import { Clock, Calendar, MessageSquare, Play, Square, Cpu, CheckCircle } from 'lucide-react';

export default function FocusHub() {
  const [explanation, setExplanation] = useState('');
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const handleCritique = () => {
    if (!explanation.trim()) return;
    setIsCritiquing(true);
    
    // Simulate Ollama Feynman Tutor processing
    setTimeout(() => {
      setFeedback({
        score: "85%",
        comment: "Good grasp of the basics. However, you used the term 'API' without explaining it simply. Remember, the Feynman technique requires you to explain it so a beginner can understand. Try replacing 'API' with 'a digital messenger'.",
      });
      setIsCritiquing(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col gap-4 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
          <Clock size={18} /> Focus Hub & Feynman Tutor
        </h2>
        <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Cpu size={10} /> Local Tutor Active
        </span>
      </div>

      <div className="flex-1 flex gap-4 h-full overflow-hidden">
        
        {/* Left Sidebar: Timer & Schedule */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* Pomodoro Timer */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center gap-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Study Session</h3>
            <div className="text-4xl font-mono text-cyan-400 font-light my-2">25:00</div>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimerRunning(!timerRunning)}
                className={`p-2 rounded-full flex items-center justify-center transition cursor-pointer ${timerRunning ? 'bg-rose-900 text-rose-400 hover:bg-rose-800' : 'bg-cyan-900 text-cyan-400 hover:bg-cyan-800'}`}
              >
                {timerRunning ? <Square size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Mini Schedule */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 overflow-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1">
              <Calendar size={14} /> Today
            </h3>
            <div className="bg-slate-950 p-2 rounded border-l-2 border-cyan-500 text-xs">
              <div className="font-bold text-slate-300">INTE 301</div>
              <div className="text-slate-500">8:00 AM - 11:00 AM</div>
            </div>
            <div className="bg-slate-950 p-2 rounded border-l-2 border-indigo-500 text-xs">
              <div className="font-bold text-slate-300">Hackathon Deadline</div>
              <div className="text-slate-500">10:00 AM</div>
            </div>
          </div>
        </div>

        {/* Right Main Area: Feynman Simulator */}
        <div className="w-2/3 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-indigo-400" /> 
              Feynman Technique Simulator
            </h3>
            <p className="text-[10px] text-slate-500">
              Explain a concept as simply as possible. The local AI will check it against your Sanctuary Notes for clarity and jargon.
            </p>
          </div>

          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Type your explanation here... (e.g., 'System integration is when...')"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />

          <button 
            onClick={handleCritique}
            disabled={isCritiquing || !explanation.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isCritiquing ? "Analyzing explanation..." : "Critique My Understanding"}
          </button>

          {/* Feedback Area */}
          {feedback && (
            <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-lg p-3 flex flex-col gap-2 mt-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                  <CheckCircle size={14} className="text-emerald-400"/> AI Critique
                </span>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-900/50 px-2 py-0.5 rounded">
                  Clarity: {feedback.score}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                {feedback.comment}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}