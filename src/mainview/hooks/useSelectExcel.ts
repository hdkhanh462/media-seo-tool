import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { selectFile } from "@/services/input.service";
import type { ExportType } from "~/shared/types";

export function useSelectFile(
  options?: UseMutationOptions<string, Error, ExportType>,
) {
  return useMutation({
    ...options,
    mutationFn: (type: ExportType) => selectFile(type),
  });
}
