import fs from "node:fs";
import path from "node:path";
import pLimit from "p-limit";
import type { MedialInFolderResult, MediaWithExif } from "~/shared/types";
import { getExiftoolInstance } from "../lib/exiftool-vendored";
import { splitKeywords } from "../utils";

const MEDIA_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".mp4",
  ".mov",
  ".webp",
]);

export const getMedialInFolder = async (
  folderPath: string,
): Promise<MedialInFolderResult> => {
  if (!fs.existsSync(folderPath)) {
    throw new Error("Folder not found");
  }

  const limit = pLimit(5);
  const exiftool = getExiftoolInstance();
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const validFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) =>
      MEDIA_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
    );

  const counter = { total: validFiles.length, success: 0, failed: 0 };

  const rows = await Promise.all(
    validFiles.map(async (file) => {
      return limit(async () => {
        try {
          const fullPath = path.join(folderPath, file);
          const stats = fs.statSync(fullPath);
          const tags = await exiftool.read(fullPath);

          counter.success++;

          return {
            name: file,
            size: stats.size,
            type: tags.Mime || tags.MIMEType || "Unknown",
            lastModified: stats.mtimeMs,
            exif: {
              title: tags.Title || tags.XPTitle || tags.Headline,
              description: tags.Description,
              comment: tags.Comment || tags.XPComment,
              keywords:
                splitKeywords(tags.Keywords) ?? splitKeywords(tags.XPKeywords),
              subjects: tags.Subject ?? splitKeywords(tags.XPSubject),
              rating: tags.Rating,
              author: tags.Author || tags.XPAuthor,
            },
          } satisfies MediaWithExif;
        } catch (error) {
          counter.failed++;

          console.error(
            `Could not read metadata for ${file}: ${(error as Error).message}`,
          );
          return null;
        }
      });
    }),
  );

  await exiftool.end();

  return {
    rows: rows.filter((row) => row !== null) as MediaWithExif[],
    counter,
  };
};

export const checkFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};
