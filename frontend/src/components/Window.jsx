import { Rnd } from 'react-rnd'
import { Minus, Maximize2, X } from 'lucide-react'
import { useWindows } from '../store/useWindows'

export default function Window({ win, children }) {
  const { close, minimize, toggleMax, focus, update } = useWindows()
  if (win.minimized) return null

  const maxed = win.maximized
  return (
    <Rnd
      position={maxed ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
      size={maxed ? { width: '100%', height: 'calc(100% - 44px)' } : { width: win.width, height: win.height }}
      minWidth={360}
      minHeight={240}
      bounds="parent"
      dragHandleClassName="win-handle"
      disableDragging={maxed}
      enableResizing={!maxed}
      style={{ zIndex: win.z }}
      onMouseDown={() => focus(win.id)}
      onDragStop={(e, d) => update(win.id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) =>
        update(win.id, { width: ref.offsetWidth, height: ref.offsetHeight, ...pos })
      }
    >
      <div className="h-full flex flex-col rounded-lg overflow-hidden border border-rose/40 shadow-2xl bg-cream">
        <div className="win-handle flex items-center justify-between px-3 py-2 bg-rose text-white cursor-move select-none">
          <span className="font-serif font-bold text-sm">{win.title}</span>
          <div className="flex gap-1.5">
            <button onClick={() => minimize(win.id)} className="p-1 rounded bg-white/20 hover:bg-white/30"><Minus size={13} /></button>
            <button onClick={() => toggleMax(win.id)} className="p-1 rounded bg-white/20 hover:bg-white/30"><Maximize2 size={13} /></button>
            <button onClick={() => close(win.id)} className="p-1 rounded bg-red-700 hover:bg-red-600"><X size={13} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </Rnd>
  )
}