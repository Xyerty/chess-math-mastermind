import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { z } from 'zod';
import { useToast } from "@/components/ui/use-toast";

// Define the shape of our settings
interface SoundSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  isSfxMuted: boolean;
  isMusicMuted: boolean;
}

interface TimeLimitSettings {
  easy: number;
  medium: number;
  hard: number;
  unlimited: boolean;
}

interface Settings {
  sound: SoundSettings;
  timeLimits: TimeLimitSettings;
}

const settingsSchema = z.object({
  sound: z.object({
    masterVolume: z.number().min(0).max(100),
    sfxVolume: z.number().min(0).max(100),
    musicVolume: z.number().min(0).max(100),
    isSfxMuted: z.boolean(),
    isMusicMuted: z.boolean(),
  }),
  timeLimits: z.object({
    easy: z.number().min(10).max(120),
    medium: z.number().min(10).max(120),
    hard: z.number().min(10).max(120),
    unlimited: z.boolean(),
  }),
});


// Define the context shape
interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: Settings = {
  sound: {
    masterVolume: 80,
    sfxVolume: 100,
    musicVolume: 60,
    isSfxMuted: false,
    isMusicMuted: false,
  },
  timeLimits: {
    easy: 45,
    medium: 30,
    hard: 20,
    unlimited: false,
  },
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Create the provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('gameSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        const validation = settingsSchema.safeParse(parsedSettings);
        if (validation.success) {
          return validation.data;
        }
      }
      return defaultSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      // Prevent saving and showing toast on initial render
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      
      localStorage.setItem('gameSettings', JSON.stringify(settings));
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated.",
      });
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Could not save your settings.",
      });
    }
  }, [settings, toast]);

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
