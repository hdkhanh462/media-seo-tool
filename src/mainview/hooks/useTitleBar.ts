import { electroview } from "@/services";

export function useTitleBar() {
  return {
    closeWindow: () => electroview.rpc?.send.closeWindow(),
    minimizeWindow: () => electroview.rpc?.send.minimizeWindow(),
    toggleMaximizeWindow: () => electroview.rpc?.send.toggleMaximizeWindow(),
  };
}
