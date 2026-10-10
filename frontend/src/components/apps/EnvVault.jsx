import { Shield, Sparkles, AlertTriangle, AlertCircle } from 'lucide-react';
import { useOSStore } from '../../useOSStore';
import { playSound } from '../../utils/sounds';
import { useState } from 'react';

export default function EnvVault() {
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  
  const [envText, setEnvText] = useState(`DB_HOST=localhost\nDB_USER=root\nDB_PASS=secret123\nAPI_KEY=sk_live_samplekey589201`);
  const [findings, setFindings] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = async () => {
    playSound('pop');
    if (!envText.trim()) return;
    
    setIsAuditing(true);
    setFindings(null);
    try {
      const res = await fetch("http://localhost:8000/env-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: envText })
      });
      const data = await res.json();
      setFindings(data);
    } catch (err) {
      console.error(err);
      setFindings([{ type: 'danger', msg: 'Error connecting to local AI.' }]);
    } finally {
      setIsAuditing(false);
    }
  };

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
          <span>.env config content</span>
          {findings && findings.length === 0 ? (
            <span className="text-emerald-500 font-bold">● Secure</span>
          ) : findings && findings.length > 0 ? (
            <span className="text-rose-500 font-bold">● Vulnerabilities Found</span>
          ) : (
            <span className="text-amber-500 font-bold">● Unaudited</span>
          )}
        </div>
        
        <textarea 
          value={envText}
          onChange={(e) => setEnvText(e.target.value)}
          className={`p-3 rounded-lg border text-xs font-mono overflow-auto flex-1 outline-none resize-none ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-emerald-300 focus:border-emerald-500" : "bg-amber-50/50 border-amber-100 text-emerald-800 focus:border-emerald-500"
          }`}
        />

        {findings && findings.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 max-h-32 overflow-y-auto">
            {findings.map((f, i) => (
              <div key={i} className={`p-2.5 rounded border text-[11px] flex items-start gap-2 ${
                f.type === 'danger' 
                  ? (isDarkMode ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700")
                  : (isDarkMode ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700")
              }`}>
                <div className="mt-0.5 shrink-0">
                  {f.type === 'danger' ? <AlertTriangle size={14} /> : <AlertCircle size={14} />}
                </div>
                <span>{f.msg}</span>
              </div>
            ))}
          </div>
        )}

        {findings && findings.length === 0 && (
          <div className={`p-2.5 rounded border text-[11px] font-bold text-center ${
            isDarkMode ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}>
            No sensitive keys detected! Good to go.
          </div>
        )}

        <button 
          onClick={handleAudit}
          disabled={isAuditing}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-2 transition-all cursor-pointer active:translate-y-[1px] disabled:opacity-50 mt-2 ${
            isDarkMode 
              ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white shadow-[2px_2px_0px_0px_#0f172a]" 
              : "bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-white shadow-[2px_2px_0px_0px_#047857]"
          }`}
        >
          <Sparkles size={14} /> {isAuditing ? "Auditing Config..." : "Audit Configuration"}
        </button>
      </div>
    </div>
  );
}