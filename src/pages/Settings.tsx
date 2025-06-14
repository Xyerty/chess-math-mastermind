
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, BrainCircuit, Calculator, Palette, Sun, Moon } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useDifficulty, Difficulty } from "../contexts/DifficultyContext";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SoundSettings from "../components/settings/SoundSettings";
import TimeLimitSettings from "../components/settings/TimeLimitSettings";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { mathDifficulty, setMathDifficulty, aiDifficulty, setAiDifficulty } = useDifficulty();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={(value: 'en' | 'es') => setLanguage(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('settings.language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('settings.english')}</SelectItem>
              <SelectItem value="es">{t('settings.spanish')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Math Difficulty */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('settings.mathDifficulty')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={mathDifficulty} onValueChange={(value: Difficulty) => setMathDifficulty(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('settings.mathDifficulty')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* AI Strength */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            {t('settings.aiStrength')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={aiDifficulty} onValueChange={(value: Difficulty) => setAiDifficulty(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('settings.aiStrength')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <SoundSettings />

      {/* Time Limit Settings */}
      <TimeLimitSettings />

      {/* Visual Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('settings.visualThemes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col gap-1 cursor-pointer">
              <span>Dark Mode</span>
              <span className="font-normal text-sm text-muted-foreground">
                Switch between light and dark themes.
              </span>
            </Label>
            <div className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  aria-label="Dark mode toggle"
                />
                <Moon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
