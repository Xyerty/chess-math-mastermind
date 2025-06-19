
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from "@clerk/clerk-react";
import { useState } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { env } from '@/config/environment';

let supabaseInstance: SupabaseClient<Database> | null = null;

export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  // useState ensures the client is created only once per component instance
  const [supabase] = useState(() => {
    if (supabaseInstance) {
      return supabaseInstance;
    }
    
    supabaseInstance = createClient<Database>(
      env.supabase.url,
      env.supabase.anonKey,
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
