import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';
import { useOSStore } from '../useOSStore';

export default function AppWindow({ id, title, children }) {
  const windowData = useOSStore((state) => state.openWindows[id]);
  const closeApp = useOSStore((state) => state.closeApp);
  const toggleMinimize = useOSStore((state) => state.toggleMinimize);
  const focusApp = useOSStore((state) => state.focusApp);
  
  // Track if the window is fullscreen
  const [isMaximized, setIsMaximized] = useState(false);

  if (!windowData || windowData.isMinimized) return null;

  return (
    <Rnd
      default={{ 
        x: 80 + Math.random() * 40, 
        y: 40 + Math.random() * 40, 
        width: 850, 
        height: 600 
      }}
      minWidth={400}
      minHeight={350}
      bounds="parent"
      dragHandleClassName="window-header"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      onMouseDown={() => focusApp(id)}
      style={{ zIndex: windowData.zIndex }}
      // If maximized, we use Tailwind !important modifiers to force full screen
     className={`flex flex-col bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-xl overflow-hidden absolute text-slate-100 ${
        isMaximized ? '!w-full !h-[calc(100vh-48px)] !top-0 !left-0 !transform-none !rounded-none !border-0' : ''
      }`}
    >
      {/* Title Bar */}
      <div 
        onDoubleClick={() => setIsMaximized(!isMaximized)}
        className="window-header bg-slate-800/80 border-b border-slate-700 px-3 py-2 flex justify-between items-center cursor-move select-none"
      >
        <span className="font-medium text-xs text-slate-300 flex items-center gap-2">
          {title}
        </span>
        
        {/* Controls */}
        <div className="flex gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMinimize(id); }} 
            className="p-1 hover:bg-slate-700 rounded text-slate-400 transition"
          >
            <Minus size={13} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} 
            className="p-1 hover:bg-slate-700 rounded text-slate-400 transition cursor-pointer"
          >
            <Square size={12} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeApp(id); }} 
            className="p-1 hover:bg-red-600 hover:text-white rounded text-slate-400 transition cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* App Body */}
      <div className="flex-1 overflow-auto bg-slate-950/80 p-4">
        {children}
      </div>
    </Rnd>
  );
}