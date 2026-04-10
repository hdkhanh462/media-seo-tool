import {
  type UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  checkFileExists,
  exportMedia,
  importMedia,
  startQueue,
} from "@/services/editor.service";
import type {
  Counter,
  ExportMediaOptions,
  MediaInQueue,
  StartQueueOptions,
} from "~/shared/types";

export const checkFileExistsQueryKeys = {
  all: ["checkFileExists"],
  byPath: (filePath?: string) => [...checkFileExistsQueryKeys.all, filePath],
};

export const useCheckFileExists = (
  filePath?: string,
  options?: { enable?: boolean },
) => {
  return useQuery<boolean, Error>({
    enabled: options?.enable ?? !!filePath,
    queryKey: checkFileExistsQueryKeys.byPath(filePath),
    queryFn: () => checkFileExists(filePath || ""),
  });
};

export const useExportMedia = (
  options?: UseMutationOptions<boolean, Error, ExportMediaOptions>,
) => {
  return useMutation({
    ...options,
    mutationFn: (options) => exportMedia(options),
    meta: {
      invalidateQueries: checkFileExistsQueryKeys.all,
    },
  });
};

export const useImportMedia = (
  options?: UseMutationOptions<MediaInQueue[], Error, { fullPath: string }>,
) => {
  return useMutation({
    ...options,
    mutationFn: (options) => importMedia(options),
  });
};

export const useStartQueue = (
  options?: UseMutationOptions<Counter, Error, StartQueueOptions>,
) => {
  return useMutation({
    ...options,
    mutationFn: (options) => startQueue(options),
  });
};
