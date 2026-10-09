import { Shield, Sparkles } from 'lucide-react';
import { useOSStore } from '../../useOSStore';
import { playSound } from '../../utils/sounds';

export default function EnvVault() {
  const isDarkMode = useOSStore((state) => state.isDarkMode);

  return (
    <div className={`h-full flex flex-col gap-4 font-mono text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Shield className={isDarkMode ? "text-emerald-400" : "text-emerald-600"} size={20} /> EnvVault Secret Auditor
        </h2>
        <p className={`text-xs opacity-80 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Review configuration files for sensitive data before pushing to GitHub.
        </p>
      </div>

      <div className={`p-4 rounded-xl border-2 flex flex-col gap-3 flex-1 ${
        isDarkMode ? "bg-[#101217] border-slate-700" : "bg-white border-amber-200"
      }`}>
        <div className="flex justify-between items-center text-xs font-bold opacity-70">
          <span>.env sample config</span>
          <span className="text-emerald-500 font-bold">● Secure</span>
        </div>
        <pre className={`p-3 rounded-lg border text-xs font-mono overflow-auto flex-1 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-emerald-300" : "bg-amber-50/50 border-amber-100 text-emerald-800"
        }`}>
{`DB_HOST=localhost
DB_USER=root
DB_PASS=secret123
API_KEY=sk_live_samplekey589201`}
        </pre>
        <button 
          onClick={() => playSound('pop')}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer active:translate-y-[1px] ${
            isDarkMode 
              ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white shadow-[2px_2px_0px_0px_#0f172a]" 
              : "bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-white shadow-[2px_2px_0px_0px_#047857]"
          }`}
        >
          <Sparkles size={14} /> Audit Configuration
        </button>
      </div>
    </div>
  );
}