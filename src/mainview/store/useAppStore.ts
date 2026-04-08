import { create } from "zustand";

export type ActiveContent = "editor" | "settings";

interface AppState {
  activeContent: ActiveContent;
  setActiveContent: (content: ActiveContent) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeContent: "editor",

  setActiveContent: (content) => set({ activeContent: content }),
}));
