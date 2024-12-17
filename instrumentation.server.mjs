import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://9b482445c8ec7ae4cbaaba7074cc1aa0@o464638.ingest.us.sentry.io/4508480690061312",
    tracesSampleRate: 1,
    autoInstrumentRemix: true
})