import { create } from "zustand";
import type { MediaWithExif } from "~/shared/types";

interface EditorState {
  activeTab: "media" | "queue";
  selectedMedia: MediaWithExif | null;
  editingMedia: MediaWithExif | null;
  mediaQueue: MediaWithExif[];
  setActiveTab: (tab: "media" | "queue") => void;
  setSelectedMedia: (media: MediaWithExif | null) => void;
  setEditingMedia: (media: MediaWithExif | null) => void;
  addMediaToQueue: (media: MediaWithExif) => void;
  updateMediaInQueue: (media: MediaWithExif) => void;
  removeMediaFromQueue: (media: MediaWithExif) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: "media",
  selectedMedia: null,
  editingMedia: null,
  mediaQueue: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedMedia: (media) => set({ selectedMedia: media }),
  setEditingMedia: (media) => set({ editingMedia: media }),
  addMediaToQueue: (media) =>
    set((state) => ({ mediaQueue: [...state.mediaQueue, media] })),
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
