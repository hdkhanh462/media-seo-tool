import type { RPCSchema } from "electrobun";
import type { ExifFormValues } from "@/types/exif.types";

export interface ExtractOptions {
  imagesFolder: string;
  outputExcel: string;
}

export interface InjectOptions {
  imagesFolder: string;
  excelFile: string;
}

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
  exif: ExifFormValues;
};

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
        response: OpenFileDialogResult;
      };
      selectExcelFile: {
        params: undefined;
        response: OpenFileDialogResult;
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
