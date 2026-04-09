import { checkFileExists } from "@/services/editor.service";
import { useQuery } from "@tanstack/react-query";

export const useCheckFileExists = (filePath?: string) => {
  return useQuery<boolean, Error>({
    enabled: !!filePath,
    queryKey: ["checkFileExists", filePath],
    queryFn: () => checkFileExists(filePath || ""),
  });
};
