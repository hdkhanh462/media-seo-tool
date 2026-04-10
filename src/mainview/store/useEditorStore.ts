import { create } from "zustand";
import type { ExportType, MediaInQueue } from "~/shared/types";

export type EditorTab = "media" | "queue";

interface EditorState {
  activeTab: EditorTab;
  exportType: ExportType;
  mediaQueue: MediaInQueue[];
  selectedMedia: MediaInQueue | null;
  selectFolderPath: string | null;
  setActiveTab: (tab: EditorTab) => void;
  setExportType: (type: ExportType) => void;
  setSelectedMedia: (media: MediaInQueue | null) => void;
  setSelectFolderPath: (path: string | null) => void;
  setMediaQueue: (mediaQueue: MediaInQueue[]) => void;
  addMediaToQueue: (media: MediaInQueue) => void;
  updateMediaInQueue: (media: MediaInQueue) => void;
  removeMediaFromQueue: (media: MediaInQueue) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: "media",
  exportType: "xlsx",
  mediaQueue: [],
  selectedMedia: null,
  selectFolderPath: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExportType: (type) => set({ exportType: type }),
  setSelectedMedia: (media) => set({ selectedMedia: media }),
  setSelectFolderPath: (path) => set({ selectFolderPath: path }),
  setMediaQueue: (mediaQueue) => set({ mediaQueue }),
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
