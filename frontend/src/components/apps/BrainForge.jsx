import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Check, X, RotateCcw, Sliders } from 'lucide-react';
import { useOSStore } from '../../useOSStore';
import { playSound } from '../../utils/sounds';

export default function BrainForge() {
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  
  // Customization Settings State
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [questionCount, setQuestionCount] = useState(3);
  const [model, setModel] = useState('Local AI - Ollama (Llama 3)');
  const [isGenerating, setIsGenerating] = useState(false);

  // Quiz Session State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Fetch notes on load
  useEffect(() => {
    fetch("http://localhost:8000/notes")
      .then(r => r.json())
      .then(data => {
        setNotes(data);
        if (data.length > 0) setSelectedNoteId(data[0].id);
      })
      .catch(console.error);
  }, []);

  // Generate dynamic questions based on user settings
  const handleRegenerate = async (e) => {
    if (e) e.preventDefault();
    if (!selectedNoteId) {
      alert("Please select a study material / note first.");
      return;
    }
    playSound('pop');
    setIsGenerating(true);

    try {
      const res = await fetch(`http://localhost:8000/quiz/${selectedNoteId}?count=${questionCount}`, {
        method: "POST"
      });
      const data = await res.json();
      
      if (data.questions) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setIsFinished(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating quiz with AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelect = (option) => {
    if (selectedOption !== null) return;
    playSound('pop');
    setSelectedOption(option.id);
    if (option.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className={`h-full flex flex-col gap-6 font-mono text-sm overflow-y-auto no-scrollbar ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      {/* Header Area */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h2 className="text-lg font-bold mb-1">BrainForge Quizcards</h2>
          <p className={`text-xs opacity-80 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Customizable practice studio powered by local AI.
          </p>
        </div>
      </div>

      {/* 2-Column Layout: Settings on Left, Quiz Studio on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
        
        {/* LEFT COLUMN: Settings & Customization Panel */}
        <div className={`p-5 rounded-xl border-2 flex flex-col gap-4 ${
          isDarkMode ? "bg-[#16181D] border-slate-700" : "bg-white border-amber-200 shadow-sm"
        }`}>
          <div className="flex items-center gap-2 border-b pb-2 border-amber-500/20">
            <Sliders size={15} className="text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Quiz Settings</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold block mb-1 opacity-80">Study Material</label>
              <select 
                value={selectedNoteId}
                onChange={(e) => setSelectedNoteId(e.target.value)}
                className={`w-full p-2 rounded-lg border-2 text-xs outline-none ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-amber-50/50 border-amber-200 text-slate-800"
                }`}
              >
                {notes.length === 0 ? <option value="">No notes available!</option> : null}
                {notes.map(n => <option key={n.id} value={n.id}>{n.title || 'Untitled'}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold block mb-1 opacity-80">Questions ({questionCount})</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer mt-1"
              />
            </div>



            <div>
              <label className="text-[11px] font-bold block mb-1 opacity-80">Local AI Model</label>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={`w-full p-2 rounded-lg border-2 text-xs outline-none ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-amber-50/50 border-amber-200 text-slate-800"
                }`}
              >
                <option value="Local AI - Ollama (Llama 3)">Local AI - Ollama (Llama 3)</option>
                <option value="Local AI - Mistral 7B">Local AI - Mistral 7B</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleRegenerate}
            disabled={isGenerating}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer active:translate-y-[1px] mt-2 disabled:opacity-50 ${
              isDarkMode 
                ? "bg-indigo-600 hover:bg-indigo-500 border-indigo-800 text-white shadow-[2px_2px_0px_0px_#0f172a]" 
                : "bg-amber-400 hover:bg-amber-300 border-amber-600 text-amber-950 shadow-[2px_2px_0px_0px_#b45309]"
            }`}
          >
            <Sparkles size={14} /> {isGenerating ? "Ollama Forging..." : "Regenerate Quiz"}
          </button>
        </div>

        {/* RIGHT COLUMN: Active Quiz or Score Card */}
        <div className={`md:col-span-2 p-6 rounded-xl border-2 flex flex-col justify-between min-h-[360px] ${
          isDarkMode ? "bg-[#16181D] border-slate-700" : "bg-white border-amber-200 shadow-sm"
        }`}>
          {isFinished ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 my-auto py-10">
              <Sparkles size={36} className="text-amber-500 animate-bounce" />
              <h3 className="text-xl font-bold">Session Completed! 🎉</h3>
              <p className="text-xs opacity-80">
                Score: <strong className="text-amber-500 text-base">{score}</strong> / <strong className="text-base">{questions.length}</strong>
              </p>
              <button 
                onClick={handleRegenerate}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                  isDarkMode ? "bg-indigo-600 text-white border-indigo-800" : "bg-amber-400 text-amber-950 border-amber-600"
                }`}
              >
                <RotateCcw size={14} /> Practice Again
              </button>
            </div>
          ) : currentQ ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                {/* Progress Bar */}
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">Question {currentIndex + 1} of {questions.length}</span>
                  <span className="text-xs font-bold opacity-70">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className={`w-full h-2 rounded-full mb-5 ${isDarkMode ? "bg-slate-800" : "bg-amber-100"}`}>
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <h3 className="text-sm font-bold mb-4 leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options List with Smooth Highlights */}
                <div className="space-y-2.5 mb-6">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    let highlightStyle = isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-amber-50/40 border-amber-200 text-slate-800";
                    
                    if (selectedOption !== null) {
                      if (opt.correct) {
                        highlightStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold shadow-sm";
                      } else if (isSelected && !opt.correct) {
                        highlightStyle = "bg-rose-500/20 border-rose-500 text-rose-400 shadow-sm";
                      }
                    } else if (isSelected) {
                      highlightStyle = "bg-amber-500/10 border-amber-500 text-amber-600";
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelect(opt)}
                        className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${highlightStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                            isDarkMode ? "bg-slate-800 text-slate-300" : "bg-amber-100 text-amber-900"
                          }`}>
                            {opt.id}
                          </span>
                          <span className="text-xs">{opt.text}</span>
                        </div>
                        {selectedOption !== null && opt.correct && <Check size={16} className="text-emerald-500" />}
                        {selectedOption === opt.id && !opt.correct && <X size={16} className="text-rose-500" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Next Button */}
              <div className="flex justify-end pt-3 border-t border-amber-500/20">
                <button 
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border-2 transition-all ${
                    selectedOption === null 
                      ? "opacity-40 cursor-not-allowed bg-slate-500 border-slate-600 text-white" 
                      : isDarkMode ? "bg-indigo-600 hover:bg-indigo-500 border-indigo-800 text-white cursor-pointer" : "bg-amber-400 hover:bg-amber-300 border-amber-600 text-amber-950 cursor-pointer shadow-[2px_2px_0px_0px_#b45309]"
                  }`}
                >
                  {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"} <ChevronRight size={15} />
                </button>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}