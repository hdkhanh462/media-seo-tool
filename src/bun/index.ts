import path from "node:path";
import { BrowserView, BrowserWindow, Screen } from "electrobun/bun";
import type { MainWebviewRPCType } from "~/shared/types";
import {
  checkFileExists,
  getMedialInFolder,
  startQueue,
} from "./services/editor.service";
import { exportMedia } from "./services/export.service";
import { extractMetadata as bunExtractMetadata } from "./services/extract.service";
import { loadHistory, updateHistory } from "./services/history.service";
import { importMedia } from "./services/import.service";
import { injectMetadata as bunInjectMetadata } from "./services/inject.service";
import { openFileDialog } from "./services/input.service";
import {
  fakeMaximize,
  getCenterPosition,
  getMainViewUrl,
} from "./utils/window";

const WINDOW_WIDTH = 900;
const WINDOW_HEIGHT = 600;
let IS_MAXIMIZED = true;
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
      selectFile: async ({ type }) => {
        let allowedFileTypes = "";

        switch (type) {
          case "xlsx":
            allowedFileTypes = "xlsx, xls";
            break;
          case "csv":
            allowedFileTypes = "csv";
            break;
          case "json":
            allowedFileTypes = "json";
            break;
        }

        return openFileDialog({
          canChooseDirectory: false,
          canChooseFiles: true,
          allowedFileTypes,
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
      getMedialInFolder: async (params) => {
        return getMedialInFolder(params.folderPath);
      },
      checkFileExists: async (params) => {
        return checkFileExists(params.filePath);
      },
      exportMedia: async (params) => {
        return exportMedia(params);
      },
      importMedia: async (params) => {
        return importMedia(params.fullPath);
      },
      startQueue: async (params) => {
        return startQueue(params);
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
      toggleMaximizeWindow: () => {
        if (IS_MAXIMIZED) {
          // restore
          mainWindow.setSize(PREV_BOUNDS.width, PREV_BOUNDS.height);
          mainWindow.setPosition(PREV_BOUNDS.x, PREV_BOUNDS.y);
        } else {
          // save current
          const { width, height } = mainWindow.getSize();
          const { x, y } = mainWindow.getPosition();

          PREV_BOUNDS = {
            width,
            height,
            x,
            y,
          };

          fakeMaximize(mainWindow);
        }

        IS_MAXIMIZED = !IS_MAXIMIZED;
      },
      logToBun: ({ msg }) => {
        console.log("Log to bun: ", msg);
      },
    },
  },
});

const { width, height } = Screen.getPrimaryDisplay().workArea;

const mainWindow = new BrowserWindow({
  title: "Media SEO Editor",
  url,
  frame: {
    width,
    height,
    x: 0,
    y: 0,
  },
  rpc: mainWebviewRPC,
  titleBarStyle: "hidden",
});

console.log("Media SEO Editor started!");
