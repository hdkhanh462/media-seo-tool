import type { RPCSchema } from "electrobun";
import type { ExifValues } from "@/types/exif.types";

export type ExtractOptions = {
  imagesFolder: string;
  outputExcel: string;
};

export type InjectOptions = {
  imagesFolder: string;
  excelFile: string;
};

export type ExportType = "xlsx" | "csv" | "json";

export type ExportToExcelOptions = {
  sheetName?: string;
  autoFilter?: boolean;
  freezeHeader?: boolean;
};
export type ExportToCSVOptions = {
  delimiter?: "," | ";" | "\t";
  encoding?: "utf-8" | "utf-16le";
  quoteValues?: boolean;
};
export type ExportToJSONOptions = {
  minify?: boolean;
  includeNull?: boolean;
};

export type ExportMediaOptions = {
  fullPath: string;
  media: MediaWithExif[];
  overwrite?: boolean;
} & (
  | { type: "xlsx"; meta?: ExportToExcelOptions }
  | { type: "csv"; meta?: ExportToCSVOptions }
  | { type: "json"; meta?: ExportToJSONOptions }
);

export type ExtractResult = {
  success: boolean;
  message: string;
  processedCount?: number;
};

export type InjectResult = {
  success: boolean;
  message: string;
  successCount?: number;
  failCount?: number;
};

export type OpenFileDialogResult = {
  path: string | null;
  message: string;
};

export type HistoryData = {
  lastImagesFolder?: string;
  lastExcelFile?: string;
  lastOutputExcel?: string;
  lastUsed?: string;
};

export type MediaWithExif = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  exif: ExifValues;
};

export type MediaInQueue = Pick<MediaWithExif, "name" | "exif">;

export type MedialInFolderResult = {
  rows: MediaWithExif[];
  counter: {
    total: number;
    success: number;
    failed: number;
  };
};

export type MainWebviewRPCType = {
  // functions that execute in the main process
  bun: RPCSchema<{
    requests: {
      extractMetadata: {
        params: {
          imagesFolder: string;
          outputFolder: string;
          outputFilename: string;
        };
        response: ExtractResult;
      };
      injectMetadata: {
        params: {
          imagesFolder: string;
          excelFile: string;
        };
        response: InjectResult;
      };
      selectFolder: {
        params: undefined;
        response: string;
      };
      selectFile: {
        params: { type: ExportType };
        response: string;
      };
      loadHistory: {
        params: undefined;
        response: HistoryData;
      };
      getMedialInFolder: {
        params: { folderPath: string };
        response: MedialInFolderResult;
      };
      checkFileExists: {
        params: { filePath: string };
        response: boolean;
      };
      exportMedia: {
        params: ExportMediaOptions;
        response: boolean;
      };
      importMedia: {
        params: { fullPath: string };
        response: MediaWithExif[];
      };
    };
    messages: {
      closeWindow: undefined;
      minimizeWindow: undefined;
      toggleMaximizeWindow: undefined;
      logToBun: {
        msg: string;
      };
    };
  }>;
  // functions that execute in the browser context
  webview: RPCSchema<{
    messages: {
      logToWebview: {
        msg: string;
      };
    };
  }>;
};
