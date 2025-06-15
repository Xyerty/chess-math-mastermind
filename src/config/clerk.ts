
// Hardcoded Clerk publishable key for immediate functionality
// Note: For production, consider using environment variables
export const CLERK_PUBLISHABLE_KEY = "pk_test_cmVsYXhpbmctc2hlcGhlcmQtMTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

// Always log success since we have a hardcoded key
console.log("✅ Clerk configuration loaded successfully");
console.log("Environment:", import.meta.env.MODE);
console.log("Clerk key starts with:", CLERK_PUBLISHABLE_KEY.substring(0, 20) + "...");
