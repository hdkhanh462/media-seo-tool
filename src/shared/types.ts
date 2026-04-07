import type { RPCSchema } from "electrobun";

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
      someBunFunction: {
        params: {
          a: number;
          b: number;
        };
        response: number;
      };
    };
    messages: {
      logToBun: {
        msg: string;
      };
    };
  }>;
  // functions that execute in the browser context
  webview: RPCSchema<{
    requests: {
      someWebviewFunction: {
        params: {
          a: number;
          b: number;
        };
        response: number;
      };
    };
    messages: {
      logToWebview: {
        msg: string;
      };
    };
  }>;
};
