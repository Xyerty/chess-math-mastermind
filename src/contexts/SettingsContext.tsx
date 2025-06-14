
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('gameSettings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gameSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

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
