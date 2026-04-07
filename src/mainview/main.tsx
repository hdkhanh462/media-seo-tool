import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/mainview/index.css";
import App from "@/mainview/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
