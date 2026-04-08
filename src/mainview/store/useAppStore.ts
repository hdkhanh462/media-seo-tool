import { create } from "zustand";

export type ActiveContent = "editor" | "settings";

interface AppState {
  activeContent: ActiveContent;
  isMaximized: boolean;
  setActiveContent: (content: ActiveContent) => void;
  toggleIsMaximized: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeContent: "editor",
  isMaximized: false,
  setActiveContent: (content) => set({ activeContent: content }),
  toggleIsMaximized: () => set((prev) => ({ isMaximized: !prev })),
}));
