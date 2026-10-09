import { create } from 'zustand'

let zCounter = 10

export const useWindows = create((set, get) => ({
  windows: [],

  open: (app) => {
    const existing = get().windows.find((w) => w.id === app.id)
    if (existing) {
      set((s) => ({
        windows: s.windows.map((w) =>
          w.id === app.id ? { ...w, minimized: false, z: ++zCounter } : w
        ),
      }))
      return
    }
    const offset = get().windows.length * 30
    set((s) => ({
      windows: [
        ...s.windows,
        {
          id: app.id,
          title: app.title,
          x: 140 + offset,
          y: 90 + offset,
          width: app.width ?? 720,
          height: app.height ?? 460,
          minimized: false,
          maximized: false,
          z: ++zCounter,
        },
      ],
    }))
  },

  close: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
  focus: (id) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, z: ++zCounter } : w)) })),
  minimize: (id) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)) })),
  toggleMax: (id) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) })),
  update: (id, patch) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
}))