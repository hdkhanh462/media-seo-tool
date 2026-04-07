import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { historyQueryKeys } from "@/hooks/useHistory";
import { injectMetadata } from "@/services/mediaRpcClient";
import type { InjectResult } from "~/shared/types";

export type InjectParams = {
  imagesFolder: string;
  excelFile: string;
};

export function useInjectMetadata(
  options?: UseMutationOptions<InjectResult, Error, InjectParams>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ imagesFolder, excelFile }) =>
      injectMetadata(imagesFolder, excelFile),
    onSuccess: (...params) => {
      options?.onSuccess?.(...params);
      queryClient.invalidateQueries({
        queryKey: historyQueryKeys.all,
      });
    },
  });
}
