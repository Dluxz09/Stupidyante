import { Calendar, Sparkles, Clock, BookOpen, Layers, Plus, Trash2 } from 'lucide-react';
import { useOSStore } from '../../useOSStore';
import { playSound } from '../../utils/sounds';
import { useState, useEffect } from 'react';

export default function FocusHub() {
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  
  // Connect to global schedule store
  const schedule = useOSStore((state) => state.schedule);
  const addScheduleItemToStore = useOSStore((state) => state.addScheduleItem);
  const removeScheduleItemFromStore = useOSStore((state) => state.removeScheduleItem);

  const [newTime, setNewTime] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newRoom, setNewRoom] = useState('');
  
  const [feynmanText, setFeynmanText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/notes")
      .then(r => r.json())
      .then(data => {
        setNotes(data);
        if (data.length > 0) setSelectedNoteId(data[0].id);
      })
      .catch(console.error);
  }, []);

  const addClassItem = (e) => {
    e.preventDefault();
    if (!newCourse.trim()) return;
    playSound('pop');
    addScheduleItemToStore({ id: Date.now(), time: newTime || '10:00 AM', course: newCourse, room: newRoom || 'Room 101' });
    setNewTime('');
    setNewCourse('');
    setNewRoom('');
  };

  const removeClassItem = (id) => {
    playSound('close');
    removeScheduleItemFromStore(id);
  };

  const evaluateFeynman = async () => {
    playSound('pop');
    if (!feynmanText.trim() || !selectedNoteId) {
      setFeedback({ comment: 'Please select a note and write a short explanation first!' });
      return;
    }
    setIsEvaluating(true);
    setFeedback(null);
    try {
      const res = await fetch("http://localhost:8000/feynman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_id: Number(selectedNoteId), explanation: feynmanText })
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
      setFeedback({ comment: "Error connecting to AI." });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className={`h-full flex flex-col gap-6 font-mono text-sm overflow-y-auto no-scrollbar ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Calendar className={isDarkMode ? "text-sky-400" : "text-amber-600"} size={20} /> Today's Academic Rhythm & Feynman Tutor
        </h2>
        <p className={`text-xs opacity-80 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Your customizable schedule timeline paired with local AI concept explanation checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Editable Visual Schedule Timeline */}
        <div className={`p-5 rounded-xl border-2 flex flex-col gap-4 ${
          isDarkMode ? "bg-[#16181D] border-slate-700" : "bg-white border-amber-200"
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Layers size={14} /> Schedule Timeline
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">{schedule.length} Classes</span>
          </div>
          
          <div className="relative border-l-2 border-amber-400/40 ml-3 space-y-4 py-2 max-h-60 overflow-y-auto pr-2">
            {schedule.map((item, index) => (
              <div key={item.id} className="relative pl-6 group">
                <div className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 ${
                  index === 0 ? "bg-amber-500 border-white animate-pulse" : isDarkMode ? "bg-slate-800 border-slate-600" : "bg-amber-200 border-amber-400"
                }`} />
                <div className={`p-3 rounded-xl border relative flex justify-between items-start ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-amber-50/30 border-amber-100"
                }`}>
                  <div>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Clock size={12} /> {item.time}
                    </span>
                    <h4 className="font-bold text-xs mt-0.5">{item.course}</h4>
                    <span className="text-[10px] opacity-70">{item.room}</span>
                  </div>
                  <button 
                    onClick={() => removeClassItem(item.id)}
                    className="text-rose-500 opacity-60 hover:opacity-150 transition p-1"
                    title="Remove Class"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Schedule Form */}
          <form onSubmit={addClassItem} className="flex flex-col gap-2 pt-2 border-t border-amber-500/20">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">Add New Class</span>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Time (e.g., 04:00 PM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className={`p-2 rounded-lg border text-xs outline-none ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-amber-50/50 border-amber-200"}`}
              />
              <input 
                type="text" 
                placeholder="Room (e.g., Lab 2)"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                className={`p-2 rounded-lg border text-xs outline-none ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-amber-50/50 border-amber-200"}`}
              />
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Course Name..."
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className={`flex-1 p-2 rounded-lg border text-xs outline-none ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-amber-50/50 border-amber-200"}`}
              />
              <button 
                type="submit"
                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 ${
                  isDarkMode ? "bg-sky-600 text-white" : "bg-amber-400 text-amber-950"
                }`}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </form>
        </div>

        {/* Right: Feynman Technique AI Simulator */}
        <div className={`p-5 rounded-xl border-2 flex flex-col justify-between ${
          isDarkMode ? "bg-[#16181D] border-slate-700" : "bg-white border-amber-200"
        }`}>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70 flex items-center gap-1.5">
              <BookOpen size={14} /> Feynman Technique Simulator
            </h3>
            <p className="text-xs opacity-80 mb-3">Explain a complex concept simply. The local AI will check it for clarity and jargon.</p>
            <select 
              value={selectedNoteId}
              onChange={e => setSelectedNoteId(e.target.value)}
              className={`w-full mb-3 p-2 rounded-lg border-2 text-xs outline-none ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-amber-50/50 border-amber-200 text-slate-800"
              }`}
            >
              {notes.length === 0 ? <option value="">No notes available. Create one first!</option> : null}
              {notes.map(n => <option key={n.id} value={n.id}>{n.title || 'Untitled'}</option>)}
            </select>
            <textarea 
              value={feynmanText}
              onChange={(e) => setFeynmanText(e.target.value)}
              placeholder="State your explanation here..."
              className={`w-full h-28 p-3 rounded-lg border-2 resize-none outline-none text-xs ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-200 focus:border-sky-500" 
                  : "bg-amber-50/50 border-amber-200 text-slate-800 focus:border-amber-400"
              }`}
            />
            {feedback && (
              <div className={`mt-3 p-3 rounded-lg border text-xs font-medium ${
                isDarkMode ? "bg-sky-950/40 border-sky-800 text-sky-200" : "bg-amber-50 border-amber-300 text-amber-900"
              }`}>
                {feedback.score && <div className="font-bold text-sm mb-1">Score: {feedback.score}</div>}
                {feedback.comment}
              </div>
            )}
          </div>
          <button 
            onClick={evaluateFeynman}
            disabled={isEvaluating}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer active:translate-y-[1px] mt-3 disabled:opacity-50 ${
              isDarkMode 
                ? "bg-sky-600 hover:bg-sky-500 border-sky-800 text-white shadow-[2px_2px_0px_0px_#0f172a]" 
                : "bg-amber-400 hover:bg-amber-300 border-amber-600 text-amber-950 shadow-[2px_2px_0px_0px_#b45309]"
            }`}
          >
            <Sparkles size={14} /> {isEvaluating ? "Ollama Evaluates..." : "Critique My Understanding"}
          </button>
        </div>
      </div>
    </div>
  );
}