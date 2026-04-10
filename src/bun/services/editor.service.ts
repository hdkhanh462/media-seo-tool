import fs from "node:fs";
import path from "node:path";
import pLimit from "p-limit";

import type {
  Counter,
  MedialInFolderResult,
  MediaWithExif,
  StartQueueOptions,
} from "~/shared/types";
import { getExiftoolInstance } from "../lib/exiftool-vendored";
import { splitKeywords } from "../utils";

const MEDIA_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".mp4",
  ".mov",
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

  const counter: Counter = { total: validFiles.length, success: 0, failed: 0 };

  const rows = await Promise.all(
    validFiles.map(async (file) =>
      limit(async () => {
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
      }),
    ),
  );

  await exiftool.end();

  return {
    rows: rows.filter((row) => row !== null) as MediaWithExif[],
    counter,
  };
};

export const startQueue = async (options: StartQueueOptions) => {
  const { folderPath, media } = options;

  if (!fs.existsSync(folderPath)) {
    throw new Error("Folder not found");
  }

  const limit = pLimit(5);
  const exiftool = getExiftoolInstance();
  const counter: Counter = { total: media.length, success: 0, failed: 0 };

  await Promise.all(
    media.map(async (item) =>
      limit(async () => {
        const fullPath = path.join(folderPath, item.name);

        if (!fs.existsSync(fullPath)) {
          counter.failed++;
          return;
        }

        try {
          await exiftool.write(
            fullPath,
            {
              Title: item.exif.title,
              XPTitle: item.exif.title,
              Headline: item.exif.title,

              Description: item.exif.description,

              Comment: item.exif.comment,
              XPComment: item.exif.comment,

              Rating: item.exif.rating,
              RatingPercent:
                item.exif.rating === 5 ? 99 : (item.exif.rating ?? 0) * 20,

              Keywords: item.exif.keywords,
              XPKeywords: item.exif.keywords?.join(";"),

              Subject: item.exif.subjects,
              XPSubject: item.exif.subjects?.join(";"),

              Author: item.exif.author,
              XPAuthor: item.exif.author,
            },
            { writeArgs: ["-overwrite_original"] },
          );

          counter.success++;
        } catch (error) {
          counter.failed++;

          console.error(
            `Could not write metadata for ${item.name}: ${(error as Error).message}`,
          );
        }
      }),
    ),
  );

  await exiftool.end();

  return counter;
};

export const checkFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};
