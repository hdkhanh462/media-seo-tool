import { create } from "zustand";
import type { MediaWithExif } from "~/shared/types";

export type EditorTab = "media" | "queue";

interface EditorState {
  activeTab: EditorTab;
  selectedMedia: MediaWithExif | null;
  mediaQueue: MediaWithExif[];
  setActiveTab: (tab: EditorTab) => void;
  setSelectedMedia: (media: MediaWithExif | null) => void;
  addMediaToQueue: (media: MediaWithExif) => void;
  updateMediaInQueue: (media: MediaWithExif) => void;
  removeMediaFromQueue: (media: MediaWithExif) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: "media",
  selectedMedia: null,
  mediaQueue: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedMedia: (media) => set({ selectedMedia: media }),
  addMediaToQueue: (media) =>
    set((state) => {
      if (state.mediaQueue.some((m) => m.name === media.name)) {
        return { mediaQueue: state.mediaQueue };
      }
      return { mediaQueue: [...state.mediaQueue, media] };
    }),
  updateMediaInQueue: (media) =>
    set((state) => ({
      mediaQueue: state.mediaQueue.map((m) =>
        m.name === media.name ? media : m,
      ),
    })),
  removeMediaFromQueue: (media) =>
    set((state) => ({
      mediaQueue: state.mediaQueue.filter((m) => m.name !== media.name),
    })),
}));
