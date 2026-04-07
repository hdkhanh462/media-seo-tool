import { FolderOpen } from "lucide-react";
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
import { useExtractMetadata } from "@/hooks/useExtract";
import { useHistoryData } from "@/hooks/useHistory";
import { useSelectFolder } from "@/hooks/useSelectFolder";

export function ExtractTab() {
  const [imagesFolder, setImagesFolder] = useState("");
  const [outputExcel, setOutputExcel] = useState("data_template.xlsx");
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
  const extractMutation = useExtractMetadata({
    onSuccess: (res) => {
      setResult(
        `Extraction completed: ${res.processedCount ?? 0} files processed. ${res.message}`,
      );
    },
    onError: (error) => {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Extraction failed"}`,
      );
    },
  });

  const isRunning = extractMutation.isPending;

  useEffect(() => {
    if (!historyQuery.data) return;
    if (historyQuery.data.lastImagesFolder) {
      setImagesFolder(historyQuery.data.lastImagesFolder);
    }
    if (historyQuery.data.lastOutputExcel) {
      setOutputExcel(historyQuery.data.lastOutputExcel);
    }
  }, [historyQuery.data]);

  const handleFolderSelect = async () => {
    folderSelect.mutate();
  };

  const handleRun = async () => {
    if (!imagesFolder.trim()) {
      setResult("Please select a folder first.");
      return;
    }

    setResult("");

    extractMutation.mutate({ imagesFolder, outputExcel });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extract Metadata</CardTitle>
        <CardDescription>
          Extract metadata from media files in a folder and export to Excel.
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
            <Label htmlFor="output-excel">Output Excel</Label>
            <Input
              id="output-excel"
              value={outputExcel}
              onChange={(e) => setOutputExcel(e.target.value)}
              placeholder="Output Excel filename"
            />
          </div>
        </div>
        <Button onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Extracting..." : "Start Extraction"}
        </Button>
        <div className="space-y-2">
          <Label>Result</Label>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              {result || "Click 'Start Extraction' to begin"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
