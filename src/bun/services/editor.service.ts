import fs from "node:fs";
import path from "node:path";
import { MediaWithExif } from "~/shared/types";
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
): Promise<MediaWithExif[]> => {
  if (!fs.existsSync(folderPath)) {
    throw new Error("Folder not found");
  }

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const validFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) =>
      MEDIA_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
    );

  const rows = await Promise.all(
    validFiles.map(async (file) => {
      const exiftool = getExiftoolInstance();

      try {
        const fullPath = path.join(folderPath, file);
        const stats = fs.statSync(fullPath);
        const tags = await exiftool.read(fullPath);

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
        console.error(
          `Could not read metadata for ${file}: ${(error as Error).message}`,
        );
        return null;
      } finally {
        await exiftool.end();
      }
    }),
  );

  return rows.filter((row) => row !== null) as MediaWithExif[];
};
