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

export type MainWebviewRPCType = {
  // functions that execute in the main process
  bun: RPCSchema<{
    requests: {
      extractMetadata: {
        params: {
          imagesFolder: string;
          outputExcel: string;
          concurrent: number;
        };
        response: ExtractResult;
      };
      injectMetadata: {
        params: {
          imagesFolder: string;
          excelFile: string;
          concurrent: number;
        };
        response: InjectResult;
      };
      selectFolder: {
        params: undefined;
        response: { folderPath: string | null; message: string };
      };
      selectExcelFile: {
        params: undefined;
        response: { filePath: string | null; message: string };
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
