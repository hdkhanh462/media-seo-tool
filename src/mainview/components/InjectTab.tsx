import { FileText, FolderOpen } from "lucide-react";
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
import { injectMetadata } from "@/services/mediaRpcClient";
import { selectFile, selectFolder } from "@/utils/input";

export function InjectTab() {
  const [imagesFolder, setImagesFolder] = useState("");
  const [excelFile, setExcelFile] = useState("data.xlsx");
  const [concurrent, setConcurrent] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleFolderSelect = () => {
    selectFolder((folderName) => setImagesFolder(folderName));
  };

  const handleFileSelect = () => {
    selectFile((fileName) => setExcelFile(fileName));
  };

  const handleRun = async () => {
    if (!imagesFolder.trim()) {
      setResult("Please select a folder first.");
      return;
    }

    if (!excelFile.trim()) {
      setResult("Please select an Excel file first.");
      return;
    }

    setIsRunning(true);
    setResult("");

    const res = await injectMetadata(imagesFolder, excelFile, concurrent);
    setResult(res.message);

    setIsRunning(false);
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
