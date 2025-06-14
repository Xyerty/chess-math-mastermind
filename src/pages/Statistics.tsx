
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Statistics = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('nav.backToMenu')}
        </Button>
        
        <h1 className="text-2xl lg:text-3xl font-bold text-primary">
          {t('stats.title')}
        </h1>
        
        <div className="w-32"></div> {/* Spacer for alignment */}
      </header>

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
    </div>
  );
};

export default Statistics;
