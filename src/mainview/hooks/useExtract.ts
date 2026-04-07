import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { historyQueryKeys } from "@/hooks/useHistory";
import { extractMetadata } from "@/services/mediaRpcClient";
import type { ExtractResult } from "~/shared/types";

export type ExtractParams = {
  imagesFolder: string;
  outputExcel: string;
};

export function useExtractMetadata(
  options?: UseMutationOptions<ExtractResult, Error, ExtractParams>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ imagesFolder, outputExcel }) =>
      extractMetadata(imagesFolder, outputExcel),
    onSuccess: (...params) => {
      options?.onSuccess?.(...params);
      queryClient.invalidateQueries({
        queryKey: historyQueryKeys.all,
      });
    },
  });
}
