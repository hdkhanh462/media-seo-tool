import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { selectFolder } from "@/services/input.service";

export function useSelectFolder(options?: UseMutationOptions<string, Error>) {
  return useMutation({
    ...options,
    mutationFn: selectFolder,
  });
}
