import { DataTable } from "@/components/data-table/data-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { columns } from "@/components/media-table/columns";
import { NameFilterInput } from "@/components/media-table/NameFilterInput";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaInFolder } from "@/hooks/useGetMediaInFolder";
import { useSelectFolder } from "@/hooks/useSelectFolder";
import {
  type EditorTab,
  ExportType,
  useEditorStore,
} from "@/store/useEditorStore";
import type { RowSelectionState, Updater } from "@tanstack/react-table";
import { FolderOpenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { MediaWithExif } from "~/shared/types";
import { ExportDialog } from "../ExportDialog";
import { useDialog } from "@/hooks/use-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExportSchema } from "@/schemas/export.schema";
import { ExportValues } from "@/types/export.types";
import { cn } from "@/lib/utils";

const EXPORT_TYPES: { value: ExportType; label: string }[] = [
  { value: "xlsx", label: "Excel" },
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
];

const DEFAULT_VALUES: ExportValues = {
  fileName: "",
  folderPath: "",
  fullPath: "",
};
export const EditorContainer = () => {
  const exportQueueForm = useForm<ExportValues>({
    resolver: zodResolver(ExportSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const activeTab = useEditorStore((state) => state.activeTab);
  const exportType = useEditorStore((state) => state.exportType);
  const mediaQueue = useEditorStore((state) => state.mediaQueue);
  const selectedMedia = useEditorStore((state) => state.selectedMedia);
  const selectFolderPath = useEditorStore((state) => state.selectFolderPath);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const setExportType = useEditorStore((state) => state.setExportType);
  const setSelectedMedia = useEditorStore((state) => state.setSelectedMedia);
  const setSelectFolderPath = useEditorStore(
    (state) => state.setSelectFolderPath,
  );

  const exportDialog = useDialog();
  const mediaInFolder = useMediaInFolder(selectFolderPath);

  const [mediaRowSelection, setMediaRowSelection] = useState<RowSelectionState>(
    {},
  );
  const [queueRowSelection, setQueueRowSelection] = useState<RowSelectionState>(
    {},
  );

  const folderSelect = useSelectFolder({
    onSuccess: (data) => {
      setSelectFolderPath(data.path);
    },
  });

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
      const index = mediaInFolder.data?.rows.findIndex(
        (media) => media.name === selectedMedia?.name,
      );
      setMediaRowSelection(
        index !== undefined && index >= 0 ? { [index]: true } : {},
      );
      setQueueRowSelection({});
    } else {
      const index = mediaQueue.findIndex(
        (media) => media.name === selectedMedia?.name,
      );
      setQueueRowSelection(index >= 0 ? { [index]: true } : {});
      setMediaRowSelection({});
    }
  }, [activeTab, mediaInFolder.data, selectedMedia, mediaQueue]);

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
    updateSelectRow(updater, mediaRowSelection, mediaInFolder.data?.rows || []);
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
            data={mediaInFolder.data?.rows || []}
            rowSelection={mediaRowSelection}
            onRowSelectionChange={handleMediaRowSelectionChange}
            isLoading={mediaInFolder.isFetching}
            selectOnClick
          >
            {(table) => (
              <div className="flex items-center justify-between">
                <NameFilterInput table={table} />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => folderSelect.mutate()}
                    disabled={folderSelect.isPending}
                  >
                    <FolderOpenIcon />
                    Select Folder
                  </Button>
                  <DataTableViewOptions table={table} />
                </div>
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
                <div className="flex items-center gap-2">
                  <ButtonGroup
                    className={cn(mediaQueue.length > 0 ? "flex" : "hidden")}
                  >
                    <Button variant="outline" onClick={exportDialog.open}>
                      Export
                    </Button>
                    <Select
                      value={exportType}
                      onValueChange={(value) =>
                        setExportType(value as ExportType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {EXPORT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </ButtonGroup>
                  <DataTableViewOptions table={table} />
                </div>
              </div>
            )}
          </DataTable>
        </TabsContent>
      </Tabs>

      <ExportDialog
        form={exportQueueForm}
        formId="export-form-queue"
        title="Export"
        description="Export media with exif information"
        open={exportDialog.isOpen}
        onOpenChange={exportDialog.onChange}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
};
