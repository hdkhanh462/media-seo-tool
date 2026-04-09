import { electroview } from "@/services";

export const selectFile = async () => {
  const result = await electroview.rpc?.request.selectExcelFile();
  return result || { path: null, message: "No response" };
};

export const selectFolder = async () => {
  const result = await electroview.rpc?.request.selectFolder();
  return result || { path: null, message: "No response" };
};
