import { useState } from 'react';
import { FileText, Plus, Save, Trash2 } from 'lucide-react';
import { useOSStore } from '../../useOSStore';
import { playSound } from '../../utils/sounds';

export default function SanctuaryNotes() {
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  
  const [notes, setNotes] = useState([
    { id: 1, title: 'Web Development Basics', content: 'React is a JavaScript library for building user interfaces. Components are reusable pieces of UI.' },
    { id: 2, title: 'Database Administration', content: 'Remember to index foreign keys and optimize MySQL queries using EXPLAIN.' }
  ]);
  const [activeNoteId, setActiveNoteId] = useState(1);
  const [savedStatus, setSavedStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const updateTitle = (e) => {
    const val = e.target.value;
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, title: val } : n));
    setSavedStatus(false);
  };

  const updateContent = (e) => {
    const val = e.target.value;
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content: val } : n));
    setSavedStatus(false);
  };

  const createNewNote = () => {
    playSound('pop');
    const newNote = { id: Date.now(), title: 'Untitled Note', content: '' };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (id, e) => {
    e.stopPropagation();
    playSound('close');
    const updated = notes.filter(n => n.id !== id);
    if (updated.length === 0) {
      const fallback = { id: Date.now(), title: 'Blank Note', content: '' };
      setNotes([fallback]);
      setActiveNoteId(fallback.id);
    } else {
      setNotes(updated);
      if (activeNoteId === id) setActiveNoteId(updated[0].id);
    }
  };

  const handleSaveToBackend = async () => {
    if (!activeNote.content.trim()) return;
    playSound('pop');
    setIsSaving(true);
    try {
      await fetch("http://localhost:8000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: activeNote.content })
      });
      setSavedStatus(true);
    } catch (err) {
      console.error("Failed to save to backend:", err);
      alert("Error saving note to local database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`h-full flex flex-col gap-4 font-mono text-sm ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className={isDarkMode ? "text-amber-400" : "text-amber-600"} size={20} /> Sanctuary Notes
          </h2>
          <p className={`text-xs opacity-80 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Your private workspace for coursework and thoughts.
          </p>
        </div>
        <button 
          onClick={createNewNote}
          className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer active:translate-y-[1px] ${
            isDarkMode 
              ? "bg-amber-600 hover:bg-amber-500 border-amber-800 text-white shadow-[2px_2px_0px_0px_#0f172a]" 
              : "bg-amber-400 hover:bg-amber-300 border-amber-600 text-amber-950 shadow-[2px_2px_0px_0px_#b45309]"
          }`}
        >
          <Plus size={14} /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Sidebar Note List */}
        <div className={`p-2 rounded-xl border-2 overflow-y-auto flex flex-col gap-2 ${
          isDarkMode ? "bg-[#101217] border-slate-700" : "bg-amber-50/50 border-amber-200"
        }`}>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => { playSound('click'); setActiveNoteId(note.id); }}
              className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                note.id === activeNoteId 
                  ? isDarkMode ? "bg-slate-800 border-slate-600 text-amber-300" : "bg-white border-amber-400 font-bold shadow-sm"
                  : isDarkMode ? "bg-slate-900/50 border-slate-800 hover:bg-slate-800" : "bg-white/60 border-amber-100 hover:bg-white"
              }`}
            >
              <span className="truncate text-xs">{note.title || 'Untitled Note'}</span>
              {notes.length > 1 && (
                <button onClick={(e) => deleteNote(note.id, e)} className="text-rose-500 hover:opacity-80 p-1">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Note Editor */}
        <div className={`md:col-span-2 p-4 rounded-xl border-2 flex flex-col gap-3 ${
          isDarkMode ? "bg-[#101217] border-slate-700" : "bg-white border-amber-200"
        }`}>
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              value={activeNote.title}
              onChange={updateTitle}
              placeholder="Note Title..."
              className={`w-full p-2.5 rounded-lg border-2 font-bold text-sm outline-none ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500" 
                  : "bg-amber-50/30 border-amber-200 text-slate-800 focus:border-amber-400"
              }`}
            />
            <button 
              onClick={handleSaveToBackend}
              disabled={isSaving}
              className={`px-3 py-2.5 rounded-lg border-2 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50 ${
                savedStatus ? "bg-emerald-500 text-white border-emerald-700" : isDarkMode ? "bg-slate-800 border-slate-700 text-amber-300" : "bg-amber-100 border-amber-300 text-amber-900"
              }`}
              title="Save Note"
            >
              <Save size={14} /> {isSaving ? "Saving..." : savedStatus ? "Saved!" : "Save"}
            </button>
          </div>
          <textarea 
            value={activeNote.content}
            onChange={updateContent}
            placeholder="Type your notes here..."
            className={`w-full flex-1 p-3 rounded-lg border-2 resize-none outline-none text-xs leading-relaxed ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 text-slate-200 focus:border-amber-500" 
                : "bg-amber-50/30 border-amber-200 text-slate-800 focus:border-amber-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
}