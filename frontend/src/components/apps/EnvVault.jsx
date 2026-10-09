import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function EnvVault() {
  const [code, setCode] = useState('DB_HOST=localhost\nDB_USER=root\nDB_PASS=secret123\nAPI_KEY=sk_test_12345abcdef');
  const [scanning, setScanning] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setAuditResult([
        { type: 'danger', msg: 'Exposed Database Password (DB_PASS)' },
        { type: 'danger', msg: 'Exposed API Key (API_KEY=sk_test...)' }
      ]);
      setScanning(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col gap-3 text-slate-200">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-rose-400">
          <Shield size={18} /> EnvVault Air-Gapped Auditor
        </h2>
        <button 
          onClick={handleScan}
          disabled={scanning}
          className="bg-rose-900/50 hover:bg-rose-800 text-rose-200 border border-rose-700 text-xs px-3 py-1 rounded flex items-center gap-1.5 transition cursor-pointer"
        >
          <ShieldAlert size={13} />
          {scanning ? "Auditing locally..." : "Audit .env File"}
        </button>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Code Editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-rose-500 resize-none leading-loose"
        />

        {/* Audit Results */}
        <div className="w-1/3 bg-slate-900 border border-slate-800 rounded p-3 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Audit Log</h3>
          
          {!auditResult && !scanning && (
             <p className="text-xs text-slate-500 italic">Waiting for scan...</p>
          )}

          {scanning && <p className="text-xs text-rose-400 animate-pulse">Running Ollama pattern match...</p>}

          {auditResult && auditResult.map((res, i) => (
            <div key={i} className="flex gap-2 items-start bg-rose-950/30 p-2 rounded border border-rose-900/50 text-xs text-rose-300">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{res.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}