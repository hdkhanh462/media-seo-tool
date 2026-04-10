import { AppContent } from "@/components/AppContent";
import { EditorContainer } from "@/components/containers/EditorContainer";
import { SettingsContainer } from "@/components/containers/SettingsContainer";
import { SidebarInset } from "@/components/ui/sidebar";

function App() {
  return (
    <SidebarInset>
      <div className="flex max-h-[calc(100vh-var(--header-height))] lg:max-w-[calc(100vw-var(--container-md)-var(--sidebar-width-icon))] flex-1 flex-col gap-4 overflow-y-auto p-4">
        <AppContent value="editor">
          <EditorContainer />
        </AppContent>
        <AppContent value="settings">
          <SettingsContainer />
        </AppContent>
      </div>
    </SidebarInset>
  );
}

export default App;
