import { SidebarInset } from "@/components/ui/sidebar";

function App() {
  return (
    <SidebarInset>
      <div className="flex max-h-screen flex-1 flex-col gap-4 overflow-y-scroll p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50" />
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50" />
      </div>
    </SidebarInset>
  );
}

export default App;
