
interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  clerk: {
    publishableKey: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  pythonEngine: {
    url: string;
    enabled: boolean;
  };
  sentry: {
    dsn?: string;
    enabled: boolean;
  };
  features: {
    playFab: boolean;
    multiplayer: boolean;
    pythonEngine: boolean;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = import.meta.env.MODE || 'development';
  
  return {
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    
    clerk: {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
    },
    
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL || 'https://arcfrqbvhpchdaflfxjt.supabase.co',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyY2ZycWJ2aHBjaGRhZmxmeGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjM1MjQsImV4cCI6MjA2NTQ5OTUyNH0.JHeIDb4wyg0Y378f8ExNrRTggJXArMxR2WVzjb6TNjI',
    },
    
    pythonEngine: {
      url: import.meta.env.VITE_PYTHON_ENGINE_URL || 'http://127.0.0.1:8000',
      enabled: import.meta.env.VITE_ENABLE_PYTHON_ENGINE === 'true',
    },
    
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN,
      enabled: !!import.meta.env.VITE_SENTRY_DSN,
    },
    
    features: {
      playFab: import.meta.env.VITE_ENABLE_PLAYFAB !== 'false',
      multiplayer: import.meta.env.VITE_ENABLE_MULTIPLAYER !== 'false',
      pythonEngine: import.meta.env.VITE_ENABLE_PYTHON_ENGINE !== 'false',
    },
  };
};

export const env = getEnvironmentConfig();

export const validateEnvironment = (): string[] => {
  const errors: string[] = [];
  
  if (!env.clerk.publishableKey) {
    errors.push('VITE_CLERK_PUBLISHABLE_KEY is required');
  }
  
  if (!env.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!env.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }
  
  return errors;
};
