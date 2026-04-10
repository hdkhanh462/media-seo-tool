import { create } from "zustand";
import type { ExportType, MediaWithExif } from "~/shared/types";

export type EditorTab = "media" | "queue";

interface EditorState {
  activeTab: EditorTab;
  exportType: ExportType;
  mediaQueue: MediaWithExif[];
  selectedMedia: MediaWithExif | null;
  selectFolderPath: string | null;
  setActiveTab: (tab: EditorTab) => void;
  setExportType: (type: ExportType) => void;
  setSelectedMedia: (media: MediaWithExif | null) => void;
  setSelectFolderPath: (path: string | null) => void;
  setMediaQueue: (mediaQueue: MediaWithExif[]) => void;
  addMediaToQueue: (media: MediaWithExif) => void;
  updateMediaInQueue: (media: MediaWithExif) => void;
  removeMediaFromQueue: (media: MediaWithExif) => void;
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
