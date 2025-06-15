
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from "@clerk/clerk-react";
import { useState } from 'react';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://arcfrqbvhpchdaflfxjt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyY2ZycWJ2aHBjaGRhZmxmeGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjM1MjQsImV4cCI6MjA2NTQ5OTUyNH0.JHeIDb4wyg0Y378f8ExNrRTggJXArMxR2WVzjb6TNjI";

let supabaseInstance: SupabaseClient<Database> | null = null;

export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  // useState ensures the client is created only once per component instance
  const [supabase] = useState(() => {
    if (supabaseInstance) {
      return supabaseInstance;
    }
    
    supabaseInstance = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          fetch: async (url, options) => {
            const token = await getToken({ template: "supabase" });

            const headers = new Headers(options?.headers);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
    return supabaseInstance;
  });

  return supabase;
};
