import fs from "node:fs";
import path from "node:path";

export interface HistoryData {
  lastImagesFolder?: string;
  lastExcelFile?: string;
  lastOutputExcel?: string;
  lastUsed?: string;
}

function getHistoryPath(): string {
  const exePath = process.execPath;
  const exeDir = path.dirname(exePath);
  return path.join(exeDir, "history.json");
}

export function loadHistory(): HistoryData {
  try {
    const historyPath = getHistoryPath();
    if (fs.existsSync(historyPath)) {
      const data = fs.readFileSync(historyPath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn("Failed to load history:", error);
  }
  return {};
}

export function updateHistory(updates: Partial<HistoryData>): void {
  const currentHistory = loadHistory();
  const newHistory = {
    ...currentHistory,
    ...updates,
    lastUsed: new Date().toISOString(),
  };
  saveHistory(newHistory);
}

export function saveHistory(history: HistoryData): void {
  try {
    const historyPath = getHistoryPath();
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (error) {
    console.warn("Failed to save history:", error);
  }
}
