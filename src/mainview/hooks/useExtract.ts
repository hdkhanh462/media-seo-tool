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
  outputFolder: string;
  outputFilename: string;
};

export function useExtractMetadata(
  options?: UseMutationOptions<ExtractResult, Error, ExtractParams>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (params) =>
      extractMetadata(
        params.imagesFolder,
        params.outputFolder,
        params.outputFilename,
      ),
    onSuccess: (...params) => {
      options?.onSuccess?.(...params);
      queryClient.invalidateQueries({
        queryKey: historyQueryKeys.all,
      });
    },
  });
}
