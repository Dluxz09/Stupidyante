import { useState } from 'react';
import { Scan, Sparkles, Check } from 'lucide-react';
import { useOSStore } from '../../useOSStore';
import { playSound } from '../../utils/sounds';

export default function CORScanner() {
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  const [scanned, setScanned] = useState(false);

  return (
    <div className={`h-full flex flex-col gap-6 font-mono text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Scan className={isDarkMode ? "text-sky-400" : "text-amber-600"} size={20} /> Certificate of Registration (COR) Parser
          </h2>
          <p className={`text-xs opacity-80 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Paste raw text from university COR here to extract schedule and details.
          </p>
        </div>
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
          isDarkMode ? "bg-sky-950/50 border-sky-800 text-sky-300" : "bg-amber-100 border-amber-300 text-amber-900"
        }`}>
          Air-Gapped Local Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col gap-3">
          <textarea 
            placeholder="Paste text copied from your COR here..."
            className={`w-full h-48 p-3 rounded-xl border-2 resize-none outline-none text-xs ${
              isDarkMode 
                ? "bg-[#101217] border-slate-700 text-slate-200 focus:border-sky-500" 
                : "bg-white border-amber-200 text-slate-800 focus:border-amber-400"
            }`}
          />
          <button 
            onClick={() => { playSound('pop'); setScanned(true); }}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer active:translate-y-[1px] ${
              isDarkMode 
                ? "bg-sky-600 hover:bg-sky-500 border-sky-800 text-white shadow-[2px_2px_0px_0px_#0f172a]" 
                : "bg-amber-400 hover:bg-amber-300 border-amber-600 text-amber-950 shadow-[2px_2px_0px_0px_#b45309]"
            }`}
          >
            <Sparkles size={16} /> Extract Details
          </button>
        </div>

        <div className={`p-4 rounded-xl border-2 flex flex-col justify-between ${
          isDarkMode ? "bg-[#101217] border-slate-700" : "bg-white border-amber-200"
        }`}>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">Student ID Preview</h3>
            <div className={`p-3 rounded-lg border text-xs space-y-2 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-amber-50/50 border-amber-100"
            }`}>
              <p><strong>Name:</strong> {scanned ? "Alex Rivera" : "Your Name Here"}</p>
              <p><strong>Student No:</strong> {scanned ? "2026-08192" : "----"}</p>
              <p><strong>Program:</strong> {scanned ? "B.S. Information Technology" : "----"}</p>
            </div>
          </div>
          <div className="text-[10px] opacity-60">
            Securely processed on your local machine.
          </div>
        </div>
      </div>
    </div>
  );
}