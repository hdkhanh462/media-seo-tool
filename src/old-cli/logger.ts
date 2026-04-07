export const logger = {
  info: (msg: string) => console.log("\x1b[36m%s\x1b[0m", `[INFO] ${msg}`), // Cyan
  success: (msg: string) => console.log("\x1b[32m%s\x1b[0m", `[SUCCESS] ${msg}`), // Green
  warn: (msg: string) => console.log("\x1b[33m%s\x1b[0m", `[WARN] ${msg}`), // Yellow
  error: (msg: string) => console.log("\x1b[31m%s\x1b[0m", `[ERROR] ${msg}`), // Red
};