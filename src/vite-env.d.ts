
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_PYTHON_ENGINE_URL: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ENABLE_PYTHON_ENGINE: string;
  readonly VITE_ENABLE_PLAYFAB: string;
  readonly VITE_ENABLE_MULTIPLAYER: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
