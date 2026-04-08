"use client";

import {
  GalleryVerticalEndIcon,
  MaximizeIcon,
  MinimizeIcon,
  MinusIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTitleBar } from "@/hooks/useTitleBar";
import { useAppStore } from "@/store/useAppStore";

export function AppHeader() {
  const { closeWindow, minimizeWindow, toggleMaximizeWindow } = useTitleBar();
  const isMaximized = useAppStore((state) => state.isMaximized);

  return (
    <div
      role="menubar"
      className="electrobun-webkit-app-region-drag sticky top-0 z-50 flex w-full items-center border-b bg-background"
      onDoubleClick={toggleMaximizeWindow}
    >
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2">
        <Button size="icon-sm">
          <GalleryVerticalEndIcon />
        </Button>
        <div className="electrobun-webkit-app-region-no-drag ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={minimizeWindow}>
            <MinusIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={toggleMaximizeWindow}>
            {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
          <Button
            variant="ghost-destructive"
            size="icon-sm"
            onClick={closeWindow}
          >
            <XIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
