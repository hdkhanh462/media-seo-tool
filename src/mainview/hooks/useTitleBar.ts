import { electroview } from "@/services";
import { useAppStore } from "@/store/useAppStore";

export function useTitleBar() {
  const toggleIsMaximized = useAppStore((state) => state.toggleIsMaximized);

  return {
    closeWindow: () => electroview.rpc?.send.closeWindow(),
    minimizeWindow: () => electroview.rpc?.send.minimizeWindow(),
    toggleMaximizeWindow: () => {
      toggleIsMaximized();
      electroview.rpc?.send.toggleMaximizeWindow();
    },
  };
}
