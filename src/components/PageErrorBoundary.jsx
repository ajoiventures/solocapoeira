import { Component } from "react";
import { captureError } from "../lib/sentry.js";

export default class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    captureError(error, { componentStack: info.componentStack, page: this.props.page });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        padding: 32, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12,
        minHeight: 240, textAlign: "center",
      }}>
        <div style={{ fontSize: 28 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
          This page ran into an error
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)", maxWidth: 280 }}>
          Your training data is safe. The error has been reported.
        </div>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          style={{
            marginTop: 8, padding: "8px 20px", borderRadius: 8,
            background: "var(--accent)", border: "none",
            color: "#0A1018", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
