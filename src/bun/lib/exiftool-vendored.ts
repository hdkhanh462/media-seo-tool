import path from "node:path";
import { ExifTool } from "exiftool-vendored";

export const getExiftoolInstance = () => {
  return new ExifTool({
    exiftoolPath: path.join(
      process.cwd(),
      "../Resources/app/bin/exiftool-vendored/exiftool.exe",
    ),
  });
};
