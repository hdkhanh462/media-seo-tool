import { electroview } from "@/services";

export const selectFile = async () => {
  return electroview.rpc?.request.selectExcelFile();
};

export const selectFolder = async () => {
  return electroview.rpc?.request.selectFolder();
};
