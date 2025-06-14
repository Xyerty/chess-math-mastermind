
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, BrainCircuit, Calculator } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useDifficulty, Difficulty } from "../contexts/DifficultyContext";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { mathDifficulty, setMathDifficulty, aiDifficulty, setAiDifficulty } = useDifficulty();

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

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.comingSoon')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{t('settings.features')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t('settings.soundPrefs')}</li>
            <li>{t('settings.visualThemes')}</li>
            <li>{t('settings.timeLimits')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
