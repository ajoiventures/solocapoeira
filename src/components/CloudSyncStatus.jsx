import { useState, useEffect } from "react";
import { signInWithEmail, signOut, getCurrentUser, onAuthChange } from "../lib/cloudSync.js";

export default function CloudSyncStatus({ syncStatus = "idle", lastSyncTime = null, onSignIn, onSignOut }) {
  const [authUser, setAuthUser] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authStatus, setAuthStatus] = useState("idle");
  const [timeDisplay, setTimeDisplay] = useState("");

  // Load auth state on mount
  useEffect(() => {
    getCurrentUser().then(setAuthUser);
    const unsubscribe = onAuthChange(setAuthUser);
    return unsubscribe;
  }, []);

  // Update relative time display every 10 seconds
  useEffect(() => {
    const updateTime = () => {
      if (!lastSyncTime) {
        setTimeDisplay("");
        return;
      }
      const now = new Date();
      const diff = now - new Date(lastSyncTime);
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 60) setTimeDisplay("just now");
      else if (minutes < 60) setTimeDisplay(`${minutes}m ago`);
      else if (hours < 24) setTimeDisplay(`${hours}h ago`);
      else setTimeDisplay(`${Math.floor(hours / 24)}d ago`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!authEmail) return;

    setAuthStatus("sending");
    const { error } = await signInWithEmail(authEmail);

    if (error) {
      setAuthStatus("error");
      setTimeout(() => setAuthStatus("idle"), 3000);
    } else {
      setAuthStatus("sent");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthUser(null);
    onSignOut?.();
  };

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 12 }}>Cloud Sync</div>

      {authUser ? (
        <div>
          {/* Sync status indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: syncStatus === "syncing"
                  ? "rgba(79,124,255,.2)"
                  : syncStatus === "error"
                  ? "rgba(201,82,82,.2)"
                  : "rgba(46,140,120,.2)",
                border: syncStatus === "syncing"
                  ? "1px solid rgba(79,124,255,.35)"
                  : syncStatus === "error"
                  ? "1px solid rgba(201,82,82,.35)"
                  : "1px solid rgba(46,140,120,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: syncStatus === "syncing"
                  ? "var(--blue)"
                  : syncStatus === "error"
                  ? "var(--red)"
                  : "var(--green)",
              }}
            >
              {syncStatus === "syncing" ? (
                <span style={{ animation: "spin 1s linear infinite" }}>⟳</span>
              ) : syncStatus === "error" ? (
                "✕"
              ) : (
                "✓"
              )}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                {syncStatus === "syncing"
                  ? "Syncing…"
                  : syncStatus === "error"
                  ? "Sync Failed"
                  : "Synced"}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>
                {authUser.email}
                {timeDisplay && ` • ${timeDisplay}`}
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12, lineHeight: 1.4 }}>
            Your training data is synced to the cloud. You can access it on any device.
          </div>

          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 6,
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text3)",
              cursor: "pointer",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--text2)";
              e.currentTarget.style.color = "var(--text2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text3)";
            }}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div>
          {/* Sign in form */}
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>
            Sign in to sync your progress across devices. We'll email you a magic link — no password needed.
          </div>

          {authStatus === "sent" ? (
            <div
              style={{
                background: "rgba(46,140,120,.1)",
                border: "1px solid rgba(46,140,120,.3)",
                borderRadius: 8,
                padding: "12px 14px",
                fontSize: 12,
                color: "var(--green)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>✓</span>
              <span>Check your email — tap the link to sign in.</span>
            </div>
          ) : (
            <form onSubmit={handleSignIn} style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={authStatus === "sending"}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "var(--accent)",
                  border: "none",
                  color: "#0A1018",
                  cursor: "pointer",
                  opacity: authStatus === "sending" ? 0.6 : 1,
                  transition: "opacity 200ms",
                }}
              >
                {authStatus === "sending" ? "Sending…" : "Send link"}
              </button>
            </form>
          )}

          {authStatus === "error" && (
            <div style={{ fontSize: 11, color: "var(--red)", marginTop: 8 }}>
              Something went wrong. Check your email address and try again.
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
