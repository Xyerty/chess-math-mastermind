
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  // Sentry DSN is used in main.tsx, so it's good practice to define it here too.
  readonly VITE_SENTRY_DSN: string; 
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
