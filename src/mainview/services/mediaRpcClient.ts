import { electroview } from "@/services";
import type { ExtractResult, InjectResult } from "~/shared/types";

export async function extractMetadata(
  imagesFolder: string,
  outputExcel: string,
): Promise<ExtractResult> {
  const result = await electroview.rpc?.request.extractMetadata({
    imagesFolder,
    outputExcel,
  });

  return result || { success: false, message: "No response" };
}

export async function injectMetadata(
  imagesFolder: string,
  excelFile: string,
): Promise<InjectResult> {
  const result = await electroview.rpc?.request.injectMetadata({
    imagesFolder,
    excelFile,
  });

  return result || { success: false, message: "No response" };
}
