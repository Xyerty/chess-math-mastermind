
// Use the Clerk publishable key from environment variables, with a fallback for development.
// The VITE_CLERK_PUBLISHABLE_KEY should be set in your .env.local file.
export const CLERK_PUBLISHABLE_KEY = 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_cmVsYXhpbmctc2hlcGhlcmQtMTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!CLERK_PUBLISHABLE_KEY) {
  // This should not happen with the fallback, but it's good practice.
  throw new Error("Missing Clerk Publishable Key. Make sure to set VITE_CLERK_PUBLISHABLE_KEY in your environment.");
}
