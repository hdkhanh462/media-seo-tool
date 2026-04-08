import type * as React from "react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))]! border-l lg:flex"
      {...props}
    >
      <SidebarContent></SidebarContent>
    </Sidebar>
  );
}
