import { useQuery } from "@tanstack/react-query";
import { loadHistory } from "@/services/media.service";
import type { HistoryData } from "~/shared/types";

export const historyQueryKeys = {
  all: ["history"] as const,
};

export function useHistoryData() {
  return useQuery<HistoryData>({
    queryKey: historyQueryKeys.all,
    staleTime: 1000 * 60 * 5,
    queryFn: loadHistory,
  });
}
