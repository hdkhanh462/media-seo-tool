import { Utils } from "electrobun";
import type { OpenFileDialogResult } from "~/shared/types";

export const openFileDialog = async (
  params?: Parameters<typeof Utils.openFileDialog>[0],
): Promise<OpenFileDialogResult> => {
  console.log("Opening file dialog with params:", params);

  try {
    const paths = await Utils.openFileDialog(params);
    if (paths && paths.length > 0) {
      return { path: paths[0], message: "File selected successfully" };
    }

    return { path: null, message: "No file selected" };
  } catch (error) {
    console.error("Error opening file dialog:", error);
    return { path: null, message: "Error occurred while opening file dialog" };
  }
};
