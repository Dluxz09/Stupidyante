import { useState } from 'react';
import { Brain, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

export default function BrainForge() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasQuiz, setHasQuiz] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate local AI reading the MySQL database
    setTimeout(() => {
      setHasQuiz(true);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col gap-4 text-slate-200">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          <Brain size={18} /> BrainForge Quizcards
        </h2>
        <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
          Local DB Source
        </span>
      </div>

      {!hasQuiz ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-xs text-slate-400 text-center max-w-xs">
            Select a saved Sanctuary Note to autonomously generate a study deck using the local LLM.
          </p>
          <select className="bg-slate-900 border border-slate-700 text-xs p-2 rounded text-slate-300 outline-none w-64">
            <option>Note: System Integration Architectures</option>
            <option>Note: React Component Lifecycles</option>
          </select>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-2 rounded flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
            {generating ? "Generating Deck..." : "Generate Quiz Deck"}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {/* Flashcard */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-sm h-48 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center p-6 text-center cursor-pointer hover:border-cyan-500 transition shadow-lg relative perspective-1000"
          >
            <p className="text-sm font-medium text-slate-200">
              {isFlipped ? "An architecture where all UI, logic, and data processing occur on the user's device without cloud APIs." : "Define an Offline-First Architecture."}
            </p>
            <span className="absolute bottom-3 right-4 text-[10px] text-slate-500">Click to flip</span>
          </div>

          {/* Controls */}
          <div className="flex gap-4 items-center">
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition cursor-pointer"><ArrowLeft size={16}/></button>
            <span className="text-xs text-slate-400 font-mono">Card 1 of 12</span>
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition cursor-pointer"><ArrowRight size={16}/></button>
          </div>
        </div>
      )}
    </div>
  );
}