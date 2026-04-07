import { FileText, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHistoryData } from "@/hooks/useHistory";
import { useInjectMetadata } from "@/hooks/useInject";
import { useSelectExcel } from "@/hooks/useSelectExcel";
import { useSelectFolder } from "@/hooks/useSelectFolder";

export function InjectTab() {
  const [imagesFolder, setImagesFolder] = useState("");
  const [excelFile, setExcelFile] = useState("data.xlsx");
  const [result, setResult] = useState<string>("");

  const historyQuery = useHistoryData();
  const folderSelect = useSelectFolder({
    onSuccess: (res) => {
      if (res.path) {
        setImagesFolder(res.path);
      }
      setResult(res.message);
    },
    onError: (error) => {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Failed to select folder"}`,
      );
    },
  });
  const fileSelect = useSelectExcel({
    onSuccess: (res) => {
      if (res.path) {
        setExcelFile(res.path);
      }
      setResult(res.message);
    },
    onError: (error) => {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Failed to select Excel file"}`,
      );
    },
  });
  const injectMutation = useInjectMetadata({
    onSuccess: (res) => {
      setResult(
        `Injection completed: ${res.successCount ?? 0} succeeded, ${res.failCount ?? 0} failed.`,
      );
    },
    onError: (error) => {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Injection failed"}`,
      );
    },
  });

  const isRunning = injectMutation.isPending;

  useEffect(() => {
    if (!historyQuery.data) return;
    if (historyQuery.data.lastImagesFolder) {
      setImagesFolder(historyQuery.data.lastImagesFolder);
    }
    if (historyQuery.data.lastExcelFile) {
      setExcelFile(historyQuery.data.lastExcelFile);
    }
  }, [historyQuery.data]);

  const handleFolderSelect = () => {
    folderSelect.mutate();
  };

  const handleFileSelect = async () => {
    fileSelect.mutate();
  };

  const handleRun = () => {
    if (!imagesFolder.trim()) {
      setResult("Please select a folder first.");
      return;
    }

    if (!excelFile.trim()) {
      setResult("Please select an Excel file first.");
      return;
    }

    setResult("");

    injectMutation.mutate({ excelFile, imagesFolder });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inject Metadata</CardTitle>
        <CardDescription>
          Inject metadata from Excel file into media files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="images-folder">Images Folder</Label>
            <div className="flex gap-2">
              <Input
                id="images-folder"
                value={imagesFolder}
                onChange={(e) => setImagesFolder(e.target.value)}
                placeholder="Click folder icon to select media folder"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleFolderSelect}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excel-file">Excel File</Label>
            <div className="flex gap-2">
              <Input
                id="excel-file"
                value={excelFile}
                onChange={(e) => setExcelFile(e.target.value)}
                placeholder="Path to Excel file"
              />
              <Button variant="outline" size="icon" onClick={handleFileSelect}>
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <Button onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Injecting..." : "Start Injection"}
        </Button>
        <div className="space-y-2">
          <Label>Result</Label>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              {result || "Click 'Start Injection' to begin"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
