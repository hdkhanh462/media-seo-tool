import { create } from "zustand";
import { MediaWithExif } from "~/shared/types";

export type ActiveContent = "editor" | "settings";

interface AppState {
  activeContent: ActiveContent;
  selectedMedia: MediaWithExif | null;
  isMaximized: boolean;
  setActiveContent: (content: ActiveContent) => void;
  setSelectedMedia: (media: MediaWithExif | null) => void;
  toggleIsMaximized: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeContent: "editor",
  selectedMedia: null,
  isMaximized: true,
  setActiveContent: (content) => set({ activeContent: content }),
  setSelectedMedia: (media) => set({ selectedMedia: media }),
  toggleIsMaximized: () => set((prev) => ({ isMaximized: !prev.isMaximized })),
}));
