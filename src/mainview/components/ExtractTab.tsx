import { FolderOpen } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  type ExtractOptions,
  extractMetadata,
  type LogEntry,
} from "../services/extractService";

export function ExtractTab() {
  const [imagesFolder, setImagesFolder] = useState("./my_files");
  const [outputExcel, setOutputExcel] = useState("data_template.xlsx");
  const [concurrent, setConcurrent] = useState(5);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleFolderSelect = () => {
    // In a real desktop app, use file picker API
    // For now, use input
    const input = document.createElement("input");
    input.type = "file";
    input.webkitdirectory = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const dir = files[0].webkitRelativePath.split("/")[0];
        setImagesFolder(dir);
      }
    };
    input.click();
  };

  const handleRun = async () => {
    setIsRunning(true);
    setLogs([]);

    const options: ExtractOptions = {
      imagesFolder,
      outputExcel,
      concurrent,
    };

    await extractMetadata(options, (log) => {
      setLogs((prev) => [...prev, log]);
    });

    setIsRunning(false);
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
                placeholder="Path to media folder"
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
        <div className="space-y-2">
          <Label htmlFor="concurrent">Concurrent Tasks</Label>
          <Input
            id="concurrent"
            type="number"
            value={concurrent}
            onChange={(e) => setConcurrent(parseInt(e.target.value, 10) || 5)}
            min={1}
            max={20}
          />
        </div>
        <Button onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Extracting..." : "Start Extraction"}
        </Button>
        <div className="space-y-2">
          <Label>Logs</Label>
          <Textarea
            readOnly
            value={logs
              .map((log) => `[${log.type.toUpperCase()}] ${log.message}`)
              .join("\n")}
            className="h-40 font-mono text-sm"
            placeholder="Logs will appear here..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
