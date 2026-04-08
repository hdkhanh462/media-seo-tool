import path from "node:path";
import { BrowserView, BrowserWindow, Screen } from "electrobun/bun";
import type { MainWebviewRPCType } from "~/shared/types";
import { extractMetadata as bunExtractMetadata } from "./services/extractService";
import { loadHistory, updateHistory } from "./services/historyService";
import { injectMetadata as bunInjectMetadata } from "./services/injectService";
import { openFileDialog } from "./services/inputService";
import { getCenterPosition, getMainViewUrl } from "./utils/window";

const WINDOW_WIDTH = 900;
const WINDOW_HEIGHT = 600;
let IS_MAXIMIZED = false;
let PREV_BOUNDS = {
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
  ...getCenterPosition(WINDOW_WIDTH, WINDOW_HEIGHT),
};

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
        // Merge output folder and filename using node:path for proper handling
        const outputExcel = path.join(
          params.outputFolder,
          params.outputFilename,
        );
        const result = await bunExtractMetadata({
          imagesFolder: params.imagesFolder,
          outputExcel,
        });
        if (result.success) {
          updateHistory({
            lastImagesFolder: params.imagesFolder,
            lastOutputExcel: outputExcel,
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
    },
    // When the browser sends a message we can handle it
    // in the main bun process
    messages: {
      "*": (messageName, payload) => {
        console.log("Global message handler", messageName, payload);
      },
      closeWindow: () => mainWindow.close(),
      minimizeWindow: () => mainWindow.minimize(),
      maximizeWindow: () => {
        if (IS_MAXIMIZED) {
          // restore
          mainWindow.setSize(PREV_BOUNDS.width, PREV_BOUNDS.height);
          mainWindow.setPosition(PREV_BOUNDS.x, PREV_BOUNDS.y);
        } else {
          // save current
          PREV_BOUNDS = {
            width: mainWindow.getSize().width,
            height: mainWindow.getSize().height,
            x: mainWindow.getPosition().x,
            y: mainWindow.getPosition().y,
          };

          // fake maximize
          const { width, height } = Screen.getPrimaryDisplay().workArea;

          mainWindow.setPosition(0, 0);
          mainWindow.setSize(width, height);
        }

        IS_MAXIMIZED = !IS_MAXIMIZED;
      },
      logToBun: ({ msg }) => {
        console.log("Log to bun: ", msg);
      },
    },
  },
});

const mainWindow = new BrowserWindow({
  title: "Media SEO Tool",
  url,
  frame: PREV_BOUNDS,
  rpc: mainWebviewRPC,
  titleBarStyle: "hidden",
});

console.log("Media SEO Tool started!");
