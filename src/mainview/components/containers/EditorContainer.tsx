import { DataTable } from "@/components/data-table/data-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { columns } from "@/components/media-table/columns";
import { mockMediaList } from "@/components/media-table/mock-data";
import { NameFilterInput } from "@/components/media-table/NameFilterInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorTab, useEditorStore } from "@/store/useEditorStore";
import { RowSelectionState, Updater } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MediaWithExif } from "~/shared/types";

export const EditorContainer = () => {
  const activeTab = useEditorStore((state) => state.activeTab);
  const mediaQueue = useEditorStore((state) => state.mediaQueue);
  const selectedMedia = useEditorStore((state) => state.selectedMedia);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const setSelectedMedia = useEditorStore((state) => state.setSelectedMedia);

  const [mediaRowSelection, setMediaRowSelection] = useState<RowSelectionState>(
    {},
  );
  const [queueRowSelection, setQueueRowSelection] = useState<RowSelectionState>(
    {},
  );

  // Prevent ctrl + scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (activeTab === "media") {
      const index = mockMediaList.findIndex(
        (media) => media.name === selectedMedia?.name,
      );
      setMediaRowSelection(index >= 0 ? { [index]: true } : {});
      setQueueRowSelection({});
    } else {
      const index = mediaQueue.findIndex(
        (media) => media.name === selectedMedia?.name,
      );
      setQueueRowSelection(index >= 0 ? { [index]: true } : {});
      setMediaRowSelection({});
    }
  }, [selectedMedia]);

  const updateSelectRow = (
    updater: Updater<RowSelectionState>,
    rowSelection: RowSelectionState,
    data: MediaWithExif[],
  ) => {
    const newState =
      typeof updater === "function" ? updater(rowSelection) : updater;
    const selectedRow = data[Number(Object.keys(newState)[0])];

    console.log("[DEBUG]:", {
      rowSelection,
      newState,
      selectedRow,
      key: Object.keys(newState)[0],
    });

    setSelectedMedia(selectedRow || null);
  };

  const handleMediaRowSelectionChange = (
    updater: Updater<RowSelectionState>,
  ) => {
    updateSelectRow(updater, mediaRowSelection, mockMediaList);
  };

  const handleQueueRowSelectionChange = (
    updater: Updater<RowSelectionState>,
  ) => {
    updateSelectRow(updater, queueRowSelection, mediaQueue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold tracking-tight">
          Media with Exif Information
        </h2>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setSelectedMedia(null);
            setActiveTab(value as EditorTab);
          }}
        >
          <TabsList>
            <TabsTrigger value="media">Media List</TabsTrigger>
            <TabsTrigger value="queue">Queue List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Tabs value={activeTab}>
        <TabsContent value="media">
          <DataTable
            columns={columns}
            data={mockMediaList}
            rowSelection={mediaRowSelection}
            onRowSelectionChange={handleMediaRowSelectionChange}
            selectOnClick
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
            rowSelection={queueRowSelection}
            onRowSelectionChange={handleQueueRowSelectionChange}
            selectOnClick
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
