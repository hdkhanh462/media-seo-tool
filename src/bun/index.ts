import { BrowserView, BrowserWindow, Updater } from "electrobun/bun";
import type { MainWebviewRPCType } from "~/shared/types";
import { extractMetadata as bunExtractMetadata } from "./services/extractService";
import { loadHistory, updateHistory } from "./services/historyService";
import { injectMetadata as bunInjectMetadata } from "./services/injectService";
import { openFileDialog } from "./services/inputService";

export interface OpenFileDialogOptions {
  canChooseDirectory?: boolean;
  canChooseFiles?: boolean;
  allowsMultipleSelection?: boolean;
  directoryURL?: string;
  allowedFileTypes?: string[];
}

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
  const channel = await Updater.localInfo.channel();
  if (channel === "dev") {
    try {
      await fetch(DEV_SERVER_URL, { method: "HEAD" });
      console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
      return DEV_SERVER_URL;
    } catch {
      console.log(
        "Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
      );
    }
  }
  return "views://mainview/index.html";
}

// Create the main application window
const url = await getMainViewUrl();

// Create an RPC object for the bun handlers with the shared type
const mainWebviewRPC = BrowserView.defineRPC<MainWebviewRPCType>({
  maxRequestTime: 120000, // 2 minutes
  handlers: {
    requests: {
      selectFolder: async () => {
        return openFileDialog({
          canChooseDirectory: true,
          canChooseFiles: false,
        });
      },
      selectExcelFile: async () => {
        return openFileDialog({
          canChooseDirectory: false,
          canChooseFiles: true,
          allowedFileTypes: "xlsx, xls",
        });
      },
      extractMetadata: async (params) => {
        const result = await bunExtractMetadata(params);
        if (result.success) {
          updateHistory({
            lastImagesFolder: params.imagesFolder,
            lastOutputExcel: params.outputExcel,
          });
        }
        return result;
      },
      injectMetadata: async (params) => {
        const result = await bunInjectMetadata(params);
        if (result.success) {
          updateHistory({
            lastImagesFolder: params.imagesFolder,
            lastExcelFile: params.excelFile,
          });
        }
        return result;
      },
      loadHistory: async () => {
        return loadHistory();
      },
      someBunFunction: ({ a, b }) => {
        console.log(`browser asked me to do math with: ${a} and ${b}`);
        return a + b;
      },
    },
    // When the browser sends a message we can handle it
    // in the main bun process
    messages: {
      "*": (messageName, payload) => {
        console.log("Global message handler", messageName, payload);
      },
      logToBun: ({ msg }) => {
        console.log("Log to bun: ", msg);
      },
    },
  },
});

const _mainWindow = new BrowserWindow({
  title: "Media SEO Tool",
  url,
  frame: {
    width: 900,
    height: 700,
    x: 200,
    y: 200,
  },
  rpc: mainWebviewRPC,
});

console.log("Media SEO Tool started!");
