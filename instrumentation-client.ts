import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://01b057304bfa6313168bec914e9e986e@o4508948950417408.ingest.de.sentry.io/4508948952186960",
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
})
