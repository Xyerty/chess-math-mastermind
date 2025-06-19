
import { env, validateEnvironment } from './environment';

// Get Clerk publishable key from environment variables
export const CLERK_PUBLISHABLE_KEY = env.clerk.publishableKey;
export const CLERK_ENABLED = env.clerk.enabled;

// Only show warnings in development if Clerk is not configured
if (!CLERK_ENABLED) {
  if (env.isDevelopment) {
    console.warn("⚠️ VITE_CLERK_PUBLISHABLE_KEY is not set - authentication features are disabled");
  }
} else {
  console.log("✅ Clerk configuration loaded successfully");
  console.log("Environment:", import.meta.env.MODE);
  console.log("Clerk key starts with:", CLERK_PUBLISHABLE_KEY.substring(0, 20) + "...");
  
  // Validate the key format
  if (!CLERK_PUBLISHABLE_KEY.startsWith("pk_")) {
    console.warn("⚠️ Clerk publishable key should start with 'pk_'");
  }
}

// Validate environment on startup
const envErrors = validateEnvironment();
if (envErrors.length > 0) {
  console.error("❌ Environment validation failed:", envErrors);
}
