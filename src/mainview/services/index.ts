import { Electroview } from "electrobun/view";
import type { MyWebviewRPCType } from "~/shared/types";

const rpc = Electroview.defineRPC<MyWebviewRPCType>({
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

electroview.rpc?.request.someBunFunction({ a: 9, b: 8 }).then((result) => {
  console.log("result: ", result);
});
