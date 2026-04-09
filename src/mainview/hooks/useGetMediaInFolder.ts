import { getMedialInFolder } from "@/services/editor.service";
import { useQuery } from "@tanstack/react-query";
import type { MedialInFolderResult } from "~/shared/types";

export const mediaInFolderQueryKeys = {
  all: ["mediaInFolder"] as const,
  byFolder: (folderPath: string | null) => [
    ...mediaInFolderQueryKeys.all,
    folderPath,
  ],
};

export function useMediaInFolder(folderPath: string | null) {
  return useQuery<MedialInFolderResult>({
    enabled: !!folderPath,
    queryKey: mediaInFolderQueryKeys.byFolder(folderPath),
    queryFn: () => getMedialInFolder(folderPath ?? ""),
  });
}
