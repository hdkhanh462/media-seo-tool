import "@/index.css";

import App from "@/App";
import { AppHeader } from "@/components/app-header";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      // staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      onSettled: (...params) => {
        const { meta } = params[4];

        if (meta?.invalidateQueries) {
          queryClient.invalidateQueries({
            queryKey: meta.invalidateQueries,
            // type: "active",
          });
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.error("Something went wrong!", {
        description: error.message,
        action: {
          label: "Retry",
          onClick: query.invalidate,
        },
      });
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="max-h-screen overflow-hidden [--header-height:calc(--spacing(10))]">
          <SidebarProvider className="flex flex-col" defaultOpen={false}>
            <AppHeader />
            <div className="flex flex-1">
              <SidebarLeft />
              <App />
              <SidebarRight />
            </div>
          </SidebarProvider>
        </div>
      </TooltipProvider>
      <Toaster richColors />
    </QueryClientProvider>
  </StrictMode>,
);
