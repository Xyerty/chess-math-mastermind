import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Flag, Lightbulb, Pause, Settings } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  onHint: () => void;
  onPause?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onResign,
  onHint,
  onPause,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Game Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('controls.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onNewGame}
            className="w-full justify-start"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('controls.newGame')}
          </Button>
          
          <Button 
            onClick={onPause}
            className="w-full justify-start"
            variant="outline"
          >
            <Pause className="mr-2 h-4 w-4" />
            {t('controls.pauseGame')}
          </Button>
          
          <Button 
            onClick={onHint}
            className="w-full justify-start"
            variant="outline"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            {t('controls.getHint')}
          </Button>
          
          <Button 
            onClick={onResign}
            className="w-full justify-start"
            variant="destructive"
          >
            <Flag className="mr-2 h-4 w-4" />
            {t('controls.resign')}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('controls.quickSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => navigate("/settings")}
            className="w-full justify-start"
            variant="outline"
          >
            <Settings className="mr-2 h-4 w-4" />
            {t('controls.gameSettings')}
          </Button>
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('controls.howToPlay')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{t('controls.instruction1')}</p>
            <p>{t('controls.instruction2')}</p>
            <p>{t('controls.instruction3')}</p>
            <p>{t('controls.instruction4')}</p>
            <p>{t('controls.instruction5')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameControls;
