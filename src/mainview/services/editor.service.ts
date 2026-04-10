import { toast } from "sonner";
import { electroview } from "@/services";
import type { ExportMediaOptions, MedialInFolderResult } from "~/shared/types";

export const getMedialInFolder = async (
  folderPath: string,
): Promise<MedialInFolderResult> => {
  const result = await electroview.rpc?.request.getMedialInFolder({
    folderPath,
  });
  toast.success(
    `Media files loaded successfully (${result?.counter.success}/${result?.counter.total})`,
  );
  if ((result?.counter.failed ?? 0) > 0) {
    toast.error(
      `Media files failed to load (${result?.counter.failed}/${result?.counter.total})`,
    );
  }
  return result ?? { rows: [], counter: { total: 0, success: 0, failed: 0 } };
};

export const checkFileExists = async (filePath: string) => {
  const result = await electroview.rpc?.request.checkFileExists({ filePath });
  return result ?? false;
};

export const exportMedia = async (options: ExportMediaOptions) => {
  const result = await electroview.rpc?.request.exportMedia(options);
  return result ?? false;
};

export const importMedia = async (options: { fullPath: string }) => {
  const result = await electroview.rpc?.request.importMedia(options);
  return result ?? [];
};
