import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';

export default function SanctuaryNotes() {
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  const handleSummarize = () => {
    if (!note.trim()) return;
    setSummarizing(true);

    setTimeout(() => {
      setSummary("Summary: Key points cover operating system architecture, offline-first local AI execution, and secure client-side schedule extraction.");
      setSummarizing(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col gap-3 text-slate-200">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
          <FileText size={18} /> Sanctuary Notes
        </h2>
        <button
          onClick={handleSummarize}
          disabled={summarizing || !note}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-xs px-3 py-1 rounded flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
        >
          <Sparkles size={13} />
          {summarizing ? "Summarizing..." : "Local AI Summarize"}
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type or paste lecture notes here..."
        className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
      />

      {summary && (
        <div className="bg-cyan-950/40 border border-cyan-800/60 p-3 rounded-lg text-xs text-cyan-200">
          <p className="font-semibold mb-1 text-cyan-400">AI Summary:</p>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}