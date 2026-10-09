import { create } from 'zustand';

export const useOSStore = create((set) => ({
  openWindows: {}, 
  activeZIndex: 10,
  isDarkMode: true, 

  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  openApp: (id, title, icon) => set((state) => {
    const nextZ = state.activeZIndex + 1;
    return {
      activeZIndex: nextZ,
      openWindows: {
        ...state.openWindows,
        [id]: { id, title, icon, isMinimized: false, zIndex: nextZ }
      }
    };
  }),

  closeApp: (id) => set((state) => {
    const updated = { ...state.openWindows };
    delete updated[id];
    return { openWindows: updated };
  }),

  toggleMinimize: (id) => set((state) => ({
    openWindows: {
      ...state.openWindows,
      [id]: { ...state.openWindows[id], isMinimized: !state.openWindows[id].isMinimized }
    }
  })),

  focusApp: (id) => set((state) => {
    if (!state.openWindows[id]) return state;
    const nextZ = state.activeZIndex + 1;
    return {
      activeZIndex: nextZ,
      openWindows: {
        ...state.openWindows,
        [id]: { ...state.openWindows[id], isMinimized: false, zIndex: nextZ }
      }
    };
  })
}));