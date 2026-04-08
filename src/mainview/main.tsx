import App from "@/App";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="max-h-screen overflow-hidden [--header-height:calc(--spacing(10))]">
          <SidebarProvider className="flex flex-col">
            <SiteHeader />
            <div className="flex flex-1">
              <SidebarLeft />
              <App />
              <SidebarRight />
            </div>
          </SidebarProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
