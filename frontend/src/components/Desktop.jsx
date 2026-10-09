import { useEffect, useState } from 'react'
import { APPS } from '../apps/registry'
import { useWindows } from '../store/useWindows'
import Window from './Window'
import Taskbar from './Taskbar'

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
      <div className="text-[10px] tracking-[0.3em] text-rose font-semibold">♥ OUR SANCTUARY OF MEMORIES</div>
      <div className="font-serif text-6xl">{now.toLocaleTimeString()}</div>
      <div className="tracking-widest text-sm">
        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
      </div>
    </div>
  )
}

export default function Desktop() {
  const { windows, open } = useWindows()

  return (
    <div className="relative h-full w-full">
      <Clock />

      <div className="absolute top-6 left-4 flex flex-col gap-5">
        {APPS.map((app) => (
          <button
            key={app.id}
            onDoubleClick={() => open(app)}
            onClick={() => open(app)}
            className="flex flex-col items-center w-20 gap-1 group"
          >
            <div className="w-14 h-14 rounded-xl bg-white/80 shadow-md border border-rose/20 grid place-items-center group-hover:scale-105 transition">
              <app.icon className="text-rose" />
            </div>
            <span className="font-serif text-xs text-center leading-tight">{app.title}</span>
          </button>
        ))}
      </div>

      {windows.map((w) => {
        const App = APPS.find((a) => a.id === w.id).component
        return (
          <Window key={w.id} win={w}>
            <App />
          </Window>
        )
      })}

      {/* AI pill placeholder — wired up in Step 8 */}
      <button className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#1c1c1c] text-white px-6 py-3 rounded-full font-medium shadow-xl">
        Ask LocalAgent
      </button>

      <Taskbar />
    </div>
  )
}