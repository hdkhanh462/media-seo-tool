"use client";

import { EditIcon, SettingsIcon } from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { useAppStore } from "@/store/useAppStore";
import type { NavMainItem } from "@/types/sidebar.types";

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const setActiveContent = useAppStore((state) => state.setActiveContent);

  const data: { navMain: NavMainItem[] } = {
    navMain: [
      {
        key: "editor",
        title: "Editor",
        icon: EditIcon,
        onClick: () => setActiveContent("editor"),
      },
      {
        key: "settings",
        title: "Settings",
        icon: SettingsIcon,
        onClick: () => setActiveContent("settings"),
      },
    ],
  };

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
