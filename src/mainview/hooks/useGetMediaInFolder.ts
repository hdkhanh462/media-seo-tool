import { useQuery } from "@tanstack/react-query";
import { getMedialInFolder } from "@/services/editor.service";
import type { MediaWithExif } from "~/shared/types";

export const mediaInFolderQueryKeys = {
  all: ["mediaInFolder"] as const,
  byFolder: (folderPath: string | null) => [
    ...mediaInFolderQueryKeys.all,
    folderPath,
  ],
};

export function useMediaInFolder(folderPath: string | null) {
  return useQuery<MediaWithExif[]>({
    enabled: !!folderPath,
    queryKey: mediaInFolderQueryKeys.byFolder(folderPath),
    queryFn: () => getMedialInFolder(folderPath ?? ""),
  });
}
