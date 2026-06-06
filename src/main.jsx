import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initAnalytics } from "./lib/analytics.js";

// Load monitoring after startup so the app shell stays small.
import("./lib/sentry.js").then(({ initSentry }) => initSentry());
initAnalytics();

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
