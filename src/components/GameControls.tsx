
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Flag, Lightbulb, Pause, Settings } from "lucide-react";

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  onHint: () => void;
  onPause?: () => void;
  onSettings?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onResign,
  onHint,
  onPause,
  onSettings
}) => {
  return (
    <div className="space-y-4">
      {/* Game Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Game Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onNewGame}
            className="w-full justify-start"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
          </Button>
          
          <Button 
            onClick={onPause}
            className="w-full justify-start"
            variant="outline"
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause Game
          </Button>
          
          <Button 
            onClick={onHint}
            className="w-full justify-start"
            variant="outline"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Get Hint
          </Button>
          
          <Button 
            onClick={onResign}
            className="w-full justify-start"
            variant="destructive"
          >
            <Flag className="mr-2 h-4 w-4" />
            Resign
          </Button>
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onSettings}
            className="w-full justify-start"
            variant="outline"
          >
            <Settings className="mr-2 h-4 w-4" />
            Game Settings
          </Button>
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Play</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. Click a chess piece to select it</p>
            <p>2. Solve the math problem that appears</p>
            <p>3. If correct, make your chess move</p>
            <p>4. AI will respond with its move</p>
            <p>5. Repeat until checkmate!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameControls;
