import { electroview } from "@/services";

export function useTitleBar() {
  return {
    closeWindow: () => electroview.rpc?.send.closeWindow(),
    minimizeWindow: () => electroview.rpc?.send.minimizeWindow(),
    maximizeWindow: () => electroview.rpc?.send.maximizeWindow(),
  };
}
