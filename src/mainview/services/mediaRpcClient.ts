import { electroview } from "@/services";
import type { ExtractResult, InjectResult } from "~/shared/types";

export async function extractMetadata(
  imagesFolder: string,
  outputExcel: string,
  concurrent: number,
): Promise<ExtractResult> {
  const result = await electroview.rpc?.request.extractMetadata({
    imagesFolder,
    outputExcel,
    concurrent,
  });

  return result || { success: false, message: "No response" };
}

export async function injectMetadata(
  imagesFolder: string,
  excelFile: string,
  concurrent: number,
): Promise<InjectResult> {
  const result = await electroview.rpc?.request.injectMetadata({
    imagesFolder,
    excelFile,
    concurrent,
  });

  return result || { success: false, message: "No response" };
}
