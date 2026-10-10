import { useState, useEffect } from 'react';
import { useOSStore } from './useOSStore';
import AppWindow from './components/AppWindow';
import CORScanner from './components/apps/CORScanner';
import SanctuaryNotes from './components/apps/SanctuaryNotes';
import BrainForge from './components/apps/BrainForge';
import EnvVault from './components/apps/EnvVault';
import FocusHub from './components/apps/FocusHub';
import LocalAgent from './components/LocalAgent';
import { 
  FileText, Scan, Brain, Shield, Clock, 
  Sun, Moon, Volume2, Maximize, Sparkles, Heart, Calendar, Play, Pause, RotateCcw, Coffee
} from 'lucide-react';
import bgMountains from './assets/bg-mountains.png';
import { playSound } from './utils/sounds';

const APPS = [
  { id: 'cor-scanner', title: 'Scanner', icon: Scan, color: 'text-rose-500' },
  { id: 'sanctuary-notes', title: 'Notes', icon: FileText, color: 'text-amber-600' },
  { id: 'brainforge', title: 'Quiz', icon: Brain, color: 'text-indigo-500' },
  { id: 'env-vault', title: 'Vault', icon: Shield, color: 'text-emerald-600' },
  { id: 'focus-hub', title: 'Focus Hub', icon: Clock, color: 'text-sky-600' },
];

export default function App() {
  const openApp = useOSStore((state) => state.openApp);
  const openWindows = useOSStore((state) => state.openWindows);
  const focusApp = useOSStore((state) => state.focusApp);
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  const toggleTheme = useOSStore((state) => state.toggleTheme);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Global Taskbar Pomodoro & Break Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' or 'break'
  const [showAgent, setShowAgent] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => setPomodoroSeconds((prev) => prev - 1), 1000);
    } else if (pomodoroSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      
      // Play sound alarm
      playSound('pop');
      setTimeout(() => playSound('pop'), 300);
      setTimeout(() => playSound('pop'), 600);

      // Trigger Native Browser System Notification (shows even when tabbed out)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(timerMode === 'focus' ? "⏰ Focus Session Complete!" : "☕ Break Time Over!", {
          body: timerMode === 'focus' ? "Great job! Time for a 5-minute break." : "Time to head back to your study sanctuary.",
          icon: "/favicon.ico"
        });
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds, timerMode]);

  const switchMode = (mode) => {
    playSound('pop');
    setIsTimerRunning(false);
    setTimerMode(mode);
    setPomodoroSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`w-screen h-screen overflow-hidden fixed inset-0 select-none font-mono transition-colors duration-500 ${
        isDarkMode ? "bg-[#1E2028]" : "bg-[#FEFCE8]"
      }`}
    >
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          isDarkMode ? "opacity-15" : "opacity-35"
        }`}
        style={{ backgroundImage: `url(${bgMountains})` }}
      />
      
      <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
        isDarkMode 
          ? "bg-[linear-gradient(to_right,#ffffff08_2px,transparent_2px),linear-gradient(to_bottom,#ffffff08_2px,transparent_2px)] bg-[size:32px_32px]" 
          : "bg-[linear-gradient(to_right,#fef08a40_2px,transparent_2px),linear-gradient(to_bottom,#fef08a40_2px,transparent_2px)] bg-[size:32px_32px]"
      }`} />

      <div className="relative z-10 w-full h-full flex flex-col">
        
        {/* Prominent Digital Clock & Date Badge */}
        <div className={`absolute top-10 right-12 pointer-events-none text-right transition-colors duration-500 ${
          isDarkMode ? "text-slate-200" : "text-amber-950"
        }`}>
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full font-bold shadow-sm border ${
              isDarkMode 
                ? "bg-slate-800 border-slate-700 text-slate-300" 
                : "bg-amber-100 border-amber-300 text-amber-900"
            }`}>
              <Calendar size={12} className={isDarkMode ? "text-sky-400" : "text-amber-600"} /> 
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className={`font-mono text-7xl font-bold tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.15)] ${
            isDarkMode ? "text-white" : "text-amber-900"
          }`}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <p className={`font-mono text-xs font-bold tracking-wide uppercase mt-2 opacity-90 italic ${
            isDarkMode ? "text-slate-400" : "text-amber-800"
          }`}>
            &ldquo;Academic Sanctuary Workspace&rdquo;
          </p>
        </div>

        {/* Desktop Grid Area */}
        <div className="flex-1 p-8 grid grid-rows-6 grid-flow-col gap-6 w-max z-10">
          {APPS.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => { playSound('pop'); openApp(app.id, app.title); }}
                className={`group flex flex-col items-center justify-center gap-2 p-3 w-24 h-24 rounded-2xl transition-all duration-200 cursor-pointer active:translate-y-1 active:shadow-none border-4 ${
                  isDarkMode 
                    ? "bg-[#2A2E3D] border-slate-700 shadow-[4px_4px_0px_0px_#0f172a] text-slate-100 hover:bg-[#34394A]" 
                    : "bg-white border-amber-300 shadow-[4px_4px_0px_0px_#fde047] text-slate-800 hover:bg-amber-50/50"
                }`}
              >
                <Icon size={26} className={`${app.color} group-hover:scale-110 transition-transform`} strokeWidth={2.5} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-center">
                  {app.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Open Windows */}
        {openWindows['cor-scanner'] && <AppWindow id="cor-scanner" title="COR Scanner & Custom ID"><CORScanner /></AppWindow>}
        {openWindows['sanctuary-notes'] && <AppWindow id="sanctuary-notes" title="Sanctuary Notes"><SanctuaryNotes /></AppWindow>}
        {openWindows['brainforge'] && <AppWindow id="brainforge" title="BrainForge Quizcards"><BrainForge /></AppWindow>}
        {openWindows['env-vault'] && <AppWindow id="env-vault" title="EnvVault"><EnvVault /></AppWindow>}
        {openWindows['focus-hub'] && <AppWindow id="focus-hub" title="Focus Hub & Schedule"><FocusHub /></AppWindow>}

        {/* Floating AI Copilot Circle */}
        <button 
          onClick={() => { playSound('pop'); setShowAgent(!showAgent); }}
          title="Ask LocalAgent"
          className={`fixed bottom-20 right-8 z-[9000] w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer border-4 active:translate-y-1 active:shadow-none ${
            showAgent ? "opacity-0 pointer-events-none" : "opacity-100"
          } ${
            isDarkMode 
              ? "bg-sky-600 text-yellow-200 border-slate-700 shadow-[4px_4px_0px_0px_#0f172a] hover:bg-sky-500" 
              : "bg-amber-300 text-slate-900 border-amber-500 shadow-[4px_4px_0px_0px_#eab308] hover:bg-amber-200"
        }`}>
          <Sparkles size={26} strokeWidth={2.5} />
        </button>

        {showAgent && <LocalAgent onClose={() => setShowAgent(false)} />}

        {/* Global Taskbar */}
        <div className={`fixed bottom-0 left-0 w-full h-14 border-t-4 px-4 flex items-center justify-between z-[9999] transition-colors duration-300 ${
          isDarkMode 
            ? "bg-[#181A20] border-slate-700 text-slate-200" 
            : "bg-[#FEF08A] border-amber-300 text-amber-950"
        }`}>
          {/* Left: Branding & Open App Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mr-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 shrink-0 ${
              isDarkMode 
                ? "bg-[#2A2E3D] border-slate-700 text-sky-300" 
                : "bg-white border-amber-300 text-amber-800 shadow-[2px_2px_0px_0px_#fde047]"
            }`}>
              <Heart size={16} strokeWidth={2.5} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span className="font-mono font-bold text-xs uppercase tracking-widest">Stupidyante</span>
            </div>
            
            <div className={`h-6 w-[2px] mx-1 rounded-full shrink-0 ${isDarkMode ? "bg-slate-700" : "bg-amber-300"}`} />
            
            {Object.values(openWindows).map((win) => (
              <button
                key={win.id}
                onClick={() => { playSound('click'); focusApp(win.id); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 shrink-0 active:translate-y-[1px] active:shadow-none ${
                  win.isMinimized 
                    ? isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-slate-500' 
                      : 'bg-white/50 border-amber-300 text-amber-700/60'
                    : isDarkMode 
                      ? 'bg-slate-700 border-slate-500 text-white shadow-[2px_2px_0px_0px_#0f172a]'
                      : 'bg-amber-400 border-amber-600 text-amber-950 shadow-[2px_2px_0px_0px_#b45309]'
                }`}
              >
                {win.title}
              </button>
            ))}
          </div>

          {/* Right: Taskbar Timer Widget & System Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Pomodoro / Break Timer Widget */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border-2 text-xs font-bold ${
              isDarkMode ? "bg-slate-900 border-slate-700 text-sky-300" : "bg-white border-amber-300 text-amber-900 shadow-sm"
            }`}>
              {timerMode === 'focus' ? <Clock size={14} className={isTimerRunning ? "animate-spin" : ""} /> : <Coffee size={14} className="text-amber-500 animate-bounce" />}
              <span>{formatTime(pomodoroSeconds)}</span>
              
              <button 
                onClick={() => { playSound('pop'); setIsTimerRunning(!isTimerRunning); }}
                className="p-1 hover:opacity-80 transition cursor-pointer"
                title={isTimerRunning ? "Pause" : "Start"}
              >
                {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
              </button>
              
              <button 
                onClick={() => switchMode(timerMode === 'focus' ? 'break' : 'focus')}
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold transition cursor-pointer ${
                  timerMode === 'focus' ? "bg-amber-500/20 text-amber-500" : "bg-sky-500/20 text-sky-400"
                }`}
                title="Switch Mode"
              >
                {timerMode === 'focus' ? 'Break' : 'Focus'}
              </button>

              <button 
                onClick={() => { playSound('pop'); setIsTimerRunning(false); setPomodoroSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60); }}
                className="p-1 hover:opacity-80 transition cursor-pointer"
                title="Reset"
              >
                <RotateCcw size={11} />
              </button>
            </div>

            <div className={`h-6 w-[2px] mx-0.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-amber-300"}`} />

            <button onClick={() => playSound('pop')} className={`p-2 rounded-xl border-2 transition cursor-pointer active:translate-y-[1px] active:shadow-none ${
              isDarkMode 
                ? "bg-[#2A2E3D] border-slate-700 text-slate-300 shadow-[2px_2px_0px_0px_#0f172a]" 
                : "bg-white border-amber-300 text-amber-800 shadow-[2px_2px_0px_0px_#fde047]"
            }`}>
              <Volume2 size={16} strokeWidth={2.5} />
            </button>
            
            <button onClick={() => playSound('pop')} className={`p-2 rounded-xl border-2 transition cursor-pointer active:translate-y-[1px] active:shadow-none ${
              isDarkMode 
                ? "bg-[#2A2E3D] border-slate-700 text-slate-300 shadow-[2px_2px_0px_0px_#0f172a]" 
                : "bg-white border-amber-300 text-amber-800 shadow-[2px_2px_0px_0px_#fde047]"
            }`}>
              <Maximize size={16} strokeWidth={2.5} />
            </button>

            <div className={`h-6 w-[2px] mx-0.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-amber-300"}`} />

            <button 
              onClick={() => { playSound('pop'); toggleTheme(); }} 
              className={`p-2 rounded-xl border-2 transition cursor-pointer active:translate-y-[1px] active:shadow-none ${
                isDarkMode 
                  ? "bg-amber-400 border-amber-600 text-slate-950 shadow-[2px_2px_0px_0px_#b45309]" 
                  : "bg-slate-800 border-slate-950 text-amber-300 shadow-[2px_2px_0px_0px_#0f172a]"
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}