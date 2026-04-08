"use client";

import { MaximizeIcon, MinusIcon, SidebarIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useTitleBar } from "@/hooks/useTitleBar";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { closeWindow, minimizeWindow, maximizeWindow } = useTitleBar();

  return (
    <header className="electrobun-webkit-app-region-drag sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-1">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <div className="electrobun-webkit-app-region-no-drag ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={minimizeWindow}>
            <MinusIcon />
          </Button>
          <Button variant="ghost" size="icon" onClick={maximizeWindow}>
            <MaximizeIcon />
          </Button>
          <Button variant="ghost-destructive" size="icon" onClick={closeWindow}>
            <XIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
