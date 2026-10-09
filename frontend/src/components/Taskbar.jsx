import { Heart } from 'lucide-react'
import { useWindows } from '../store/useWindows'
import { APPS } from '../apps/registry'

export default function Taskbar() {
  const { windows, open, minimize, focus } = useWindows()
  const topZ = Math.max(0, ...windows.map((w) => w.z))

  return (
    <div className="absolute bottom-0 left-0 right-0 h-11 bg-[#ecdccf] border-t border-rose/30 flex items-center px-2 gap-2 z-[9999]">
      <div className="flex items-center gap-1.5 bg-rose text-white font-serif font-bold text-sm px-3 py-1 rounded">
        <Heart size={14} fill="white" /> Stupidyante
      </div>
      {windows.map((w) => {
        const app = APPS.find((a) => a.id === w.id)
        const active = !w.minimized && w.z === topZ
        return (
          <button
            key={w.id}
            onClick={() => (active ? minimize(w.id) : open(app))}
            className={`px-3 py-1 text-sm font-serif rounded border ${
              active ? 'bg-white border-rose' : 'bg-blush/60 border-transparent'
            }`}
          >
            {w.title}
          </button>
        )
      })}
    </div>
  )
}