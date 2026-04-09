import { electroview } from "@/services";
import type { MediaWithExif } from "~/shared/types";

export const getMedialInFolder = async (
  folderPath: string,
): Promise<MediaWithExif[]> => {
  const result = await electroview.rpc?.request.getMedialInFolder({
    folderPath,
  });
  return result || [];
};

export const checkFileExists = async (filePath: string) => {
  const result = await electroview.rpc?.request.checkFileExists({ filePath });
  return result ?? false;
};
