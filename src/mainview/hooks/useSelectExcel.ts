import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { selectFile } from "@/services/inputService";
import type { OpenFileDialogResult } from "~/shared/types";

export function useSelectExcel(
  options?: UseMutationOptions<OpenFileDialogResult, Error>,
) {
  return useMutation({
    mutationFn: () => selectFile(),
    ...options,
  });
}
