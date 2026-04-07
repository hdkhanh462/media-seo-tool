import { Electroview } from "electrobun/view";
import type { MainWebviewRPCType } from "~/shared/types";

const rpc = Electroview.defineRPC<MainWebviewRPCType>({
  maxRequestTime: 120000, // 2 minutes
  handlers: {
    messages: {
      logToWebview: ({ msg }) => {
        console.log(`bun asked me to logToWebview: ${msg}`);
      },
    },
  },
});

export const electroview = new Electroview({ rpc });
