
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Target } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Tutorial = () => {
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
          {t('tutorial.title')}
        </h1>
        
        <div className="w-32"></div> {/* Spacer for alignment */}
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('tutorial.welcome')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-center text-muted-foreground">{t('tutorial.description')}</p>
          </CardContent>
        </Card>

        {/* Game Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t('tutorial.rulesTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                <span>{t('tutorial.rule1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                <span>{t('tutorial.rule2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                <span>{t('tutorial.rule3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                <span>{t('tutorial.rule4')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">5</span>
                <span>{t('tutorial.rule5')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">6</span>
                <span>{t('tutorial.rule6')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('tutorial.tipsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 text-lg">💡</span>
                <span>{t('tutorial.tip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 text-lg">💡</span>
                <span>{t('tutorial.tip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 text-lg">💡</span>
                <span>{t('tutorial.tip3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 text-lg">💡</span>
                <span>{t('tutorial.tip4')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Start Playing */}
        <div className="text-center">
          <Button 
            onClick={() => navigate("/game")}
            size="lg"
            className="text-lg px-8 py-3"
          >
            {t('mainMenu.playGame')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
