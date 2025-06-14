
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.comingSoon')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{t('settings.features')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t('settings.mathDifficulty')}</li>
            <li>{t('settings.aiStrength')}</li>
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
