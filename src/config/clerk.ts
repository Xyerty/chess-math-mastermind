
// Remove hardcoded fallback to force proper environment variable usage
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("❌ Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
  console.error("Please set VITE_CLERK_PUBLISHABLE_KEY in your Vercel environment variables");
  console.error("Get your key from: https://dashboard.clerk.com/");
  throw new Error("Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.");
}

console.log("✅ Clerk configuration loaded successfully");
console.log("Environment:", import.meta.env.MODE);
console.log("Clerk key starts with:", CLERK_PUBLISHABLE_KEY.substring(0, 20) + "...");
