import { zodResolver } from "@hookform/resolvers/zod";
import type { RowSelectionState, Updater } from "@tanstack/react-table";
import {
  FileDownIcon,
  FileUpIcon,
  FolderOpenIcon,
  PlayIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { ExportDialog } from "@/components/ExportDialog";
import { ImportDialog } from "@/components/ImportDialog";
import { mediaColumns, queueColumns } from "@/components/media-table/columns";
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
import { useDialog } from "@/hooks/use-dialog";
import { useExportMedia, useImportMedia } from "@/hooks/useExportMedia";
import { useMediaInFolder } from "@/hooks/useGetMediaInFolder";
import { useSelectFolder } from "@/hooks/useSelectFolder";
import { ExportSchema, ImportSchema } from "@/schemas/import-export.schemas";
import { type EditorTab, useEditorStore } from "@/store/useEditorStore";
import type { ExportValues, ImportValues } from "@/types/import-export.types";
import type { ExportType, MediaWithExif } from "~/shared/types";

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

const DEFAULT_IMPORT_VALUES: ImportValues = {
  fullPath: "",
};

export const EditorContainer = () => {
  const exportQueueForm = useForm<ExportValues>({
    resolver: zodResolver(ExportSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const importQueueForm = useForm<ImportValues>({
    resolver: zodResolver(ImportSchema),
    defaultValues: DEFAULT_IMPORT_VALUES,
  });

  const activeTab = useEditorStore((state) => state.activeTab);
  const exportType = useEditorStore((state) => state.exportType);
  const mediaQueue = useEditorStore((state) => state.mediaQueue);
  const selectedMedia = useEditorStore((state) => state.selectedMedia);
  const selectFolderPath = useEditorStore((state) => state.selectFolderPath);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const setExportType = useEditorStore((state) => state.setExportType);
  const setMediaQueue = useEditorStore((state) => state.setMediaQueue);
  const setSelectedMedia = useEditorStore((state) => state.setSelectedMedia);
  const setSelectFolderPath = useEditorStore(
    (state) => state.setSelectFolderPath,
  );

  const exportMediaDialog = useDialog();
  const exportQueueDialog = useDialog();
  const importQueueDialog = useDialog();
  const mediaInFolder = useMediaInFolder(selectFolderPath);

  const [mediaRowSelection, setMediaRowSelection] = useState<RowSelectionState>(
    {},
  );
  const [queueRowSelection, setQueueRowSelection] = useState<RowSelectionState>(
    {},
  );

  const folderSelect = useSelectFolder({
    onSuccess: (path) => {
      setSelectFolderPath(path);
    },
  });
  const exportMedia = useExportMedia({
    onSuccess: () => {
      exportMediaDialog.close();
      toast.success("Media exported successfully");
    },
    onError: (error) => {
      toast.error("Media failed to export", {
        description: error.message,
      });
    },
  });
  const exportQueue = useExportMedia({
    onSuccess: () => {
      exportQueueDialog.close();
      toast.success("Queue media exported successfully");
      exportQueueForm.reset(DEFAULT_VALUES);
    },
    onError: (error) => {
      toast.error("Queue media failed to export", {
        description: error.message,
      });
    },
  });

  const importQueue = useImportMedia({
    onSuccess: (data) => {
      importQueueDialog.close();
      toast.success("Queue media imported successfully");
      importQueueForm.reset(DEFAULT_IMPORT_VALUES);
      setMediaQueue(data);
    },
    onError: (error) => {
      toast.error("Queue media failed to import", {
        description: error.message,
      });
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

  const handleExportMedia = (data: ExportValues) => {
    exportMedia.mutate({
      type: exportType,
      media: mediaInFolder.data?.rows || [],
      fullPath: data.fullPath,
      overwrite: data.overwrite,
    });
  };

  const handleExportQueue = (data: ExportValues) => {
    exportQueue.mutate({
      type: exportType,
      media: mediaQueue,
      fullPath: data.fullPath,
      overwrite: data.overwrite,
    });
  };

  const handleImportQueue = (data: ImportValues) => {
    importQueue.mutate({
      fullPath: data.fullPath,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold tracking-tight">
          Media with Exif Information
        </h2>
        <div className="flex items-center gap-2">
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
          <Button>
            <PlayIcon />
            Start Queue
          </Button>
        </div>
      </div>
      <Tabs value={activeTab}>
        <TabsContent value="media">
          <DataTable
            columns={mediaColumns}
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
                  {(mediaInFolder.data?.rows.length ?? 0) > 0 && (
                    <ExportButtonGroup
                      exportType={exportType}
                      exportDialog={exportMediaDialog}
                      setExportType={setExportType}
                      hideImport
                    />
                  )}
                  <DataTableViewOptions table={table} />
                </div>
              </div>
            )}
          </DataTable>
        </TabsContent>
        <TabsContent value="queue">
          <DataTable
            columns={queueColumns}
            data={mediaQueue}
            rowSelection={queueRowSelection}
            onRowSelectionChange={handleQueueRowSelectionChange}
            selectOnClick
          >
            {(table) => (
              <div className="flex items-center justify-between">
                <NameFilterInput table={table} />
                <div className="flex items-center gap-2">
                  <ExportButtonGroup
                    exportType={exportType}
                    exportDialog={exportQueueDialog}
                    importDialog={importQueueDialog}
                    setExportType={setExportType}
                    hideExport={mediaQueue.length === 0}
                  />
                  <DataTableViewOptions table={table} />
                </div>
              </div>
            )}
          </DataTable>
        </TabsContent>
      </Tabs>

      <ExportDialog
        form={exportQueueForm}
        formId="export-form-media"
        title="Export Media"
        description="Export media with exif information as backup"
        open={exportMediaDialog.isOpen}
        onOpenChange={exportMediaDialog.onChange}
        onSubmit={handleExportMedia}
      />

      <ExportDialog
        form={exportQueueForm}
        formId="export-form-queue"
        title="Export Queue Media"
        description="Export queue media with exif information"
        open={exportQueueDialog.isOpen}
        onOpenChange={exportQueueDialog.onChange}
        onSubmit={handleExportQueue}
      />

      <ImportDialog
        form={importQueueForm}
        formId="import-form-queue"
        title="Import Queue Media"
        description="Import queue media with exif information"
        open={importQueueDialog.isOpen}
        onOpenChange={importQueueDialog.onChange}
        onSubmit={handleImportQueue}
      />
    </div>
  );
};

const ExportButtonGroup = ({
  exportType,
  exportDialog,
  importDialog,
  hideImport,
  hideExport,
  setExportType,
}: {
  exportType: ExportType;
  exportDialog: ReturnType<typeof useDialog>;
  importDialog?: ReturnType<typeof useDialog>;
  hideExport?: boolean;
  hideImport?: boolean;
  setExportType: (value: ExportType) => void;
}) => {
  return (
    <ButtonGroup>
      {!hideImport && (
        <Button variant="outline" onClick={importDialog?.open}>
          <FileUpIcon />
          Import
        </Button>
      )}
      {!hideExport && (
        <Button variant="outline" onClick={exportDialog.open}>
          <FileDownIcon />
          Export
        </Button>
      )}
      <Select
        value={exportType}
        onValueChange={(value) => setExportType(value as ExportType)}
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
  );
};
