import { useState } from 'react';
import { Scan, Sparkles, CheckCircle } from 'lucide-react';

export default function CORScanner() {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleProcess = () => {
    if (!rawText.trim()) return;
    setLoading(true);

    // Mock AI Processing Delay (Replace with fetch to Java Backend later)
    setTimeout(() => {
      setExtractedData({
        studentName: "John David",
        studentId: "2023-10942-MN-0",
        program: "BS Information Technology",
        subjects: [
          { code: "INTE 301", name: "System Integration", room: "LAB 3", schedule: "Mon 8:00 AM - 11:00 AM" },
          { code: "COMP 202", name: "Data Structures", room: "RM 402", schedule: "Wed 1:00 PM - 4:00 PM" }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col gap-4 text-slate-200">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          <Scan size={18} /> Certificate of Registration (COR) Parser
        </h2>
        <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
          Air-Gapped Local Model
        </span>
      </div>

      {!extractedData ? (
        <div className="flex-1 flex flex-col gap-3">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste raw text from university COR here (Names, Schedule, Subjects)..."
            className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 resize-none"
          />
          <button
            onClick={handleProcess}
            disabled={loading || !rawText}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles size={14} />
            {loading ? "Ollama Parsing Schedule..." : "Extract Profile & Schedule"}
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto flex flex-col gap-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-4 flex gap-4 items-center">
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-600 rounded-full flex items-center justify-center text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">{extractedData.studentName}</h3>
              <p className="text-xs text-slate-400">{extractedData.program} | {extractedData.studentId}</p>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Parsed Schedule Deck</h4>
            <div className="space-y-2">
              {extractedData.subjects.map((sub, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800 text-xs flex justify-between">
                  <div>
                    <span className="font-bold text-cyan-400">{sub.code}</span> - {sub.name}
                  </div>
                  <div className="text-slate-400">{sub.room} | {sub.schedule}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setExtractedData(null)}
            className="text-xs text-slate-400 hover:text-white underline self-start"
          >
            Parse another COR
          </button>
        </div>
      )}
    </div>
  );
}