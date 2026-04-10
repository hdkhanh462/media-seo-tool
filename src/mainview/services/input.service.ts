import { electroview } from "@/services";
import type { ExportType } from "~/shared/types";

export const selectFile = async (type: ExportType) => {
  const result = await electroview.rpc?.request.selectFile({ type });
  return result || "";
};

export const selectFolder = async () => {
  const result = await electroview.rpc?.request.selectFolder();
  return result || "";
};
