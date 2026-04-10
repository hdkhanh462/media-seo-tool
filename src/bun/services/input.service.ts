import { Utils } from "electrobun";

export const openFileDialog = async (
  params?: Parameters<typeof Utils.openFileDialog>[0],
): Promise<string> => {
  console.log("Opening file dialog with params:", params);

  const paths = await Utils.openFileDialog(params);
  if (!paths || paths.length === 0) {
    throw new Error("No file selected");
  }

  return paths[0];
};
