import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { selectFolder } from "@/services/inputService";
import type { OpenFileDialogResult } from "~/shared/types";

export function useSelectFolder(
  options?: UseMutationOptions<OpenFileDialogResult, Error>,
) {
  return useMutation({
    mutationFn: () => selectFolder(),
    ...options,
  });
}
