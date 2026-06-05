import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: "solo-leveling@1.0.0",
    tracesSampleRate: 0.2,
    // Only report errors in production
    beforeSend(event) {
      if (import.meta.env.DEV) return null;
      return event;
    },
  });
}

export function setSentryUser(userId) {
  Sentry.setUser(userId ? { id: userId } : null);
}

export function captureError(err, context = {}) {
  Sentry.captureException(err, { extra: context });
}
