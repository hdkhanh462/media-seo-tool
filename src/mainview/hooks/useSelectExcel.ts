import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { selectFile } from "@/services/input.service";
import type { OpenFileDialogResult } from "~/shared/types";

export function useSelectExcel(
  options?: UseMutationOptions<OpenFileDialogResult, Error>,
) {
  return useMutation({
    mutationFn: () => selectFile(),
    ...options,
  });
}
