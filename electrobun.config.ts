import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "media-seo-tool",
    identifier: "media-seo-tool.electrobun.dev",
    version: "0.1.1",
  },
  build: {
    // Vite builds to dist/, we copy from there
    copy: {
      "dist/index.html": "views/mainview/index.html",
      "dist/assets": "views/mainview/assets",
      "node_modules/exiftool-vendored.exe/bin": "bin/exiftool-vendored",
    },
    // Ignore Vite output in watch mode — HMR handles view rebuilds separately
    watchIgnore: ["dist/**"],
    mac: {
      bundleCEF: false,
    },
    linux: {
      bundleCEF: false,
    },
    win: {
      bundleCEF: false,
    },
  },
} satisfies ElectrobunConfig;
