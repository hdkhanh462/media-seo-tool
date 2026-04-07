import { Electroview } from "electrobun/view";
import type { MainWebviewRPCType } from "~/shared/types";

const rpc = Electroview.defineRPC<MainWebviewRPCType>({
  maxRequestTime: 120000, // increased timeout for file operations (120s for large extractions)
  handlers: {
    requests: {
      someWebviewFunction: ({ a, b }) => {
        document.body.innerHTML += `bun asked me to do math with ${a} and ${b}\n`;
        return a + b;
      },
    },
    messages: {
      logToWebview: ({ msg }) => {
        // this will appear in the inspect element devtools console
        console.log(`bun asked me to logToWebview: ${msg}`);
      },
    },
  },
});

export const electroview = new Electroview({ rpc });
