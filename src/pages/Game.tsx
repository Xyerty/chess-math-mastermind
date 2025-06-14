
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import GameControls from "../components/GameControls";
import MathChallenge from "../components/MathChallenge";

const Game = () => {
  const navigate = useNavigate();
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'stalemate'>('playing');

  const handlePieceClick = () => {
    // Show math challenge before allowing move
    setShowMathChallenge(true);
  };

  const handleMathSuccess = () => {
    setShowMathChallenge(false);
    // Here we would allow the chess move
    console.log("Math challenge solved! Move allowed.");
  };

  const handleMathFailure = () => {
    setShowMathChallenge(false);
    // Player loses turn or gets penalty
    console.log("Math challenge failed! No move allowed.");
  };

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
          Back to Menu
        </Button>
        
        <h1 className="text-3xl font-bold text-primary">Chess Math Mastermind</h1>
        
        <Button variant="outline" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </header>

      {/* Main Game Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Game Status */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <GameStatus 
            currentPlayer={currentPlayer}
            gameStatus={gameStatus}
            moveCount={1}
          />
        </div>

        {/* Center - Chess Board */}
        <div className="lg:col-span-2 order-1 lg:order-2 flex justify-center">
          <ChessBoard onPieceClick={handlePieceClick} size="large" />
        </div>

        {/* Right Sidebar - Game Controls */}
        <div className="lg:col-span-1 order-3">
          <GameControls 
            onNewGame={() => console.log("New game")}
            onResign={() => console.log("Resign")}
            onHint={() => console.log("Hint requested")}
          />
        </div>
      </div>

      {/* Math Challenge Modal */}
      {showMathChallenge && (
        <MathChallenge
          onSuccess={handleMathSuccess}
          onFailure={handleMathFailure}
          onClose={() => setShowMathChallenge(false)}
        />
      )}
    </div>
  );
};

export default Game;
