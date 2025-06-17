
// Get Clerk publishable key from environment variables
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Validate that the key is present
if (!CLERK_PUBLISHABLE_KEY) {
  console.error("❌ VITE_CLERK_PUBLISHABLE_KEY is not set in environment variables");
} else {
  console.log("✅ Clerk configuration loaded successfully");
  console.log("Environment:", import.meta.env.MODE);
  console.log("Clerk key starts with:", CLERK_PUBLISHABLE_KEY.substring(0, 20) + "...");
  
  // Validate the key format
  if (!CLERK_PUBLISHABLE_KEY.startsWith("pk_")) {
    console.warn("⚠️ Clerk publishable key should start with 'pk_'");
  }
}
