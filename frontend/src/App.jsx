import { useOSStore } from './useOSStore';
import AppWindow from './components/AppWindow';
import CORScanner from './components/apps/CORScanner';
import SanctuaryNotes from './components/apps/SanctuaryNotes';
import BrainForge from './components/apps/BrainForge';
import EnvVault from './components/apps/EnvVault';
import FocusHub from './components/apps/FocusHub';
import { FileText, Scan, Brain, Shield, Clock } from 'lucide-react';

const APPS = [
  { id: 'cor-scanner', title: 'COR Scanner & Custom ID', icon: Scan },
  { id: 'sanctuary-notes', title: 'Sanctuary Notes', icon: FileText },
  { id: 'brainforge', title: 'BrainForge Quizcards', icon: Brain },
  { id: 'env-vault', title: 'EnvVault', icon: Shield },
  { id: 'focus-hub', title: 'Focus Hub', icon: Clock },
];

export default function App() {
  const openApp = useOSStore((state) => state.openApp);
  const openWindows = useOSStore((state) => state.openWindows);
  const focusApp = useOSStore((state) => state.focusApp);

  return (
   <div className="w-screen h-screen bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-slate-100 overflow-hidden relative flex flex-col select-none">
      
      {/* Desktop Grid Area */}
      <div className="flex-1 p-6 grid grid-rows-6 grid-flow-col gap-4 w-max z-0">
        {APPS.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => openApp(app.id, app.title)}
              className="flex flex-col items-center gap-2 p-3 w-28 rounded-lg hover:bg-white/10 transition group text-center cursor-pointer"
            >
              <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-105 transition shadow-lg">
                <Icon size={24} />
              </div>
              <span className="text-xs text-slate-300 font-medium leading-tight drop-shadow">
                {app.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Open Windows */}
      {openWindows['cor-scanner'] && (
        <AppWindow id="cor-scanner" title="COR Scanner & Custom ID">
          <CORScanner />
        </AppWindow>
      )}

      {openWindows['sanctuary-notes'] && (
        <AppWindow id="sanctuary-notes" title="Sanctuary Notes">
          <SanctuaryNotes />
        </AppWindow>
      )}

      {/* Placeholders for the remaining 3 apps */}
     {openWindows['focus-hub'] && (
        <AppWindow id="focus-hub" title="Focus Hub">
          <FocusHub />
        </AppWindow>
      )}

      {openWindows['brainforge'] && (
        <AppWindow id="brainforge" title="BrainForge Quizcards">
          <BrainForge />
        </AppWindow>
      )}

      {openWindows['env-vault'] && (
        <AppWindow id="env-vault" title="EnvVault">
          <EnvVault />
        </AppWindow>
      )}

      {/* Bottom Taskbar */}
      <div className="h-12 bg-slate-900/80 backdrop-blur border-t border-slate-800 px-4 flex items-center justify-between z-[9999] relative">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="text-xs font-bold px-3 py-1.5 bg-cyan-600 rounded text-white shadow shadow-cyan-900/50">
            Stupidyante OS
          </div>
          <div className="h-4 w-[1px] bg-slate-700 mx-1" />
          
          {/* Active App Tabs */}
          {Object.values(openWindows).map((win) => (
            <button
              key={win.id}
              onClick={() => focusApp(win.id)}
              className={`px-3 py-1.5 rounded text-xs transition whitespace-nowrap ${
                win.isMinimized 
                  ? 'opacity-60 bg-slate-800 hover:bg-slate-700' 
                  : 'bg-slate-700 text-cyan-300 font-medium shadow-inner'
              }`}
            >
              {win.title}
            </button>
          ))}
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 uppercase tracking-wider ml-4 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Air-Gapped | Local AI
        </div>
      </div>

    </div>
  );
}