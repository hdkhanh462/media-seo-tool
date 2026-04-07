import { BrowserView, BrowserWindow, Updater } from "electrobun/bun";
import type { MainWebviewRPCType } from "~/shared/types";
import { extractMetadata as bunExtractMetadata } from "./services/extractService";
import { injectMetadata as bunInjectMetadata } from "./services/injectService";

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
  maxRequestTime: 30000, // increased timeout for file operations
  handlers: {
    requests: {
      extractMetadata: async (params) => {
        return bunExtractMetadata(params);
      },
      injectMetadata: async (params) => {
        return bunInjectMetadata(params);
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
        console.log("global message handler", messageName, payload);
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
