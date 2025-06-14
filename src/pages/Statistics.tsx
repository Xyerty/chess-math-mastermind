
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Statistics = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('stats.comingSoon')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{t('stats.features')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t('stats.gamesWonLost')}</li>
            <li>{t('stats.mathAccuracy')}</li>
            <li>{t('stats.averageTime')}</li>
            <li>{t('stats.chessOpenings')}</li>
            <li>{t('stats.progressTime')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
