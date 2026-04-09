import { electroview } from "@/services";
import type { MedialInFolderResult } from "~/shared/types";

export const getMedialInFolder = async (
  folderPath: string,
): Promise<MedialInFolderResult> => {
  const result = await electroview.rpc?.request.getMedialInFolder({
    folderPath,
  });
  return result ?? { rows: [], counter: { total: 0, success: 0, failed: 0 } };
};

export const checkFileExists = async (filePath: string) => {
  const result = await electroview.rpc?.request.checkFileExists({ filePath });
  return result ?? false;
};
