import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App.jsx";
import { initSentry } from "./lib/sentry.js";
import { initAnalytics } from "./lib/analytics.js";

// Init monitoring before render so first errors are caught
initSentry();
initAnalytics();

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
          background: "#0B111C", color: "#EDE8DE", fontFamily: "system-ui",
          padding: 24, textAlign: "center",
        }}>
          <div style={{ fontSize: 32 }}>⚠️</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Something went wrong</div>
          <div style={{ fontSize: 13, color: "#6F7A8A", maxWidth: 320 }}>
            The error has been reported. Reload to continue — your training data is safe.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8, padding: "10px 24px", borderRadius: 8,
              background: "#D9A441", border: "none", color: "#0A1018",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            Reload App
          </button>
        </div>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
