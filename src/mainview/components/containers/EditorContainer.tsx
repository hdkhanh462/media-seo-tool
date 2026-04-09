import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/media-table/columns";
import { mockMediaList } from "@/components/media-table/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/useEditorStore";
import { NameFilterInput } from "@/components/media-table/NameFilterInput";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";

export const EditorContainer = () => {
  const activeTab = useEditorStore((state) => state.activeTab);
  const mediaQueue = useEditorStore((state) => state.mediaQueue);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const setSelectedMedia = useEditorStore((state) => state.setSelectedMedia);

  return (
    <div>
      <h2 className="font-semibold mb-4 tracking-tight">
        Media with Exif Information
      </h2>
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setSelectedMedia(null);
          setActiveTab(value as "media" | "queue");
        }}
      >
        <TabsList>
          <TabsTrigger value="media">Media List</TabsTrigger>
          <TabsTrigger value="queue">Queue List</TabsTrigger>
        </TabsList>
        <TabsContent value="media">
          <DataTable
            columns={columns}
            data={mockMediaList}
            onRowClick={(row) => setSelectedMedia(row)}
          >
            {(table) => (
              <div className="flex items-center justify-between">
                <NameFilterInput table={table} />
                <DataTableViewOptions table={table} />
              </div>
            )}
          </DataTable>
        </TabsContent>
        <TabsContent value="queue">
          <DataTable
            columns={columns}
            data={mediaQueue}
            onRowClick={(row) => setSelectedMedia(row)}
          >
            {(table) => (
              <div className="flex items-center justify-between">
                <NameFilterInput table={table} />
                <DataTableViewOptions table={table} />
              </div>
            )}
          </DataTable>
        </TabsContent>
      </Tabs>
    </div>
  );
};
