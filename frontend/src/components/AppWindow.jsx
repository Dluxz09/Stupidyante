import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';
import { useOSStore } from '../useOSStore';
import { playSound } from '../utils/sounds';

export default function AppWindow({ id, title, children }) {
  const windowData = useOSStore((state) => state.openWindows[id]);
  const closeApp = useOSStore((state) => state.closeApp);
  const toggleMinimize = useOSStore((state) => state.toggleMinimize);
  const focusApp = useOSStore((state) => state.focusApp);
  
  const isDarkMode = useOSStore((state) => state.isDarkMode);
  const [isMaximized, setIsMaximized] = useState(false);

  if (!windowData || windowData.isMinimized) return null;

  return (
    <Rnd
      default={{ 
        x: 180 + (Math.random() * 30), 
        y: 50 + (Math.random() * 20), 
        width: 820, 
        height: 550 
      }}
      minWidth={400}
      minHeight={350}
      bounds="parent"
      dragHandleClassName="window-header"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      onMouseDown={() => focusApp(id)}
      style={{ zIndex: windowData.zIndex }}
      className={`flex flex-col rounded-2xl overflow-hidden absolute transition-all duration-150 border-4 font-mono ${
        isDarkMode 
          ? "bg-[#1E2028] border-slate-700 shadow-[8px_8px_0px_0px_#0f172a] text-slate-100" 
          : "bg-[#FEFCE8] border-amber-300 shadow-[8px_8px_0px_0px_#fde047] text-slate-800"
      } ${
        isMaximized ? '!w-full !h-[calc(100vh-56px)] !top-0 !left-0 !transform-none !rounded-none !border-0' : ''
      }`}
    >
      {/* Title Bar */}
      <div 
        onDoubleClick={() => setIsMaximized(!isMaximized)}
        className={`window-header px-4 py-3 flex justify-between items-center cursor-move select-none border-b-4 ${
          isDarkMode 
            ? "bg-[#2A2E3D] border-slate-700 text-slate-200" 
            : "bg-amber-100 border-amber-300 text-amber-900"
        }`}
      >
        <span className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          {title}
        </span>
        
        {/* Window Control Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); playSound('pop'); toggleMinimize(id); }} 
            className={`p-1 rounded border-2 transition active:translate-y-[1px] cursor-pointer ${
              isDarkMode 
                ? "bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-300" 
                : "bg-white border-amber-300 hover:bg-amber-50 text-amber-800"
            }`}
            title="Minimize"
          >
            <Minus size={12} strokeWidth={3} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); playSound('pop'); setIsMaximized(!isMaximized); }} 
            className={`p-1 rounded border-2 transition active:translate-y-[1px] cursor-pointer ${
              isDarkMode 
                ? "bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-300" 
                : "bg-white border-amber-300 hover:bg-amber-50 text-amber-800"
            }`}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <Square size={11} strokeWidth={3} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); playSound('close'); closeApp(id); }} 
            className={`p-1 rounded border-2 transition active:translate-y-[1px] cursor-pointer ${
              isDarkMode 
                ? "bg-rose-950 border-rose-800 hover:bg-rose-900 text-rose-200" 
                : "bg-rose-100 border-rose-300 hover:bg-rose-200 text-rose-600"
            }`}
            title="Close"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* App Body Container */}
      <div className={`flex-1 overflow-auto p-5 ${
        isDarkMode ? "bg-[#16181D] text-slate-200" : "bg-white text-slate-800"
      }`}>
        {children}
      </div>
    </Rnd>
  );
}