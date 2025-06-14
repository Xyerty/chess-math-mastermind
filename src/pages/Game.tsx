import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useChessGame } from "../hooks/useChessGame";
import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import GameControls from "../components/GameControls";
import MathChallenge from "../components/MathChallenge";

const Game = () => {
  const { t } = useLanguage();
  const { gameState, selectSquare, resetGame } = useChessGame();
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [pendingMove, setPendingMove] = useState<{row: number, col: number} | null>(null);

  const handlePieceClick = (row: number, col: number, piece: string | null) => {
    if (piece && piece[0] === gameState.currentPlayer[0]) {
      // Show math challenge before allowing piece selection
      setPendingMove({ row, col });
      setShowMathChallenge(true);
    }
  };

  const handleMathSuccess = () => {
    setShowMathChallenge(false);
    if (pendingMove) {
      selectSquare(pendingMove.row, pendingMove.col);
      setPendingMove(null);
    }
  };

  const handleMathFailure = () => {
    setShowMathChallenge(false);
    setPendingMove(null);
    console.log("Math challenge failed! No move allowed.");
  };

  const handleNewGame = () => {
    resetGame();
  };

  return (
    <>
      {/* Main Game Layout - Responsive Grid */}
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4">
          {/* Game Status - Top on Mobile */}
          <GameStatus 
            currentPlayer={gameState.currentPlayer}
            gameStatus={gameState.gameStatus}
            moveCount={gameState.moveCount}
          />
          
          {/* Chess Board - Center on Mobile */}
          <div className="flex justify-center">
            <ChessBoard 
              position={gameState.board}
              onPieceClick={handlePieceClick}
              size="normal"
              selectedSquare={gameState.selectedSquare}
              lastMove={gameState.lastMove}
            />
          </div>
          
          {/* Game Controls - Bottom on Mobile */}
          <GameControls 
            onNewGame={handleNewGame}
            onResign={() => console.log("Resign")}
            onHint={() => console.log("Hint requested")}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Game Status */}
          <div className="lg:col-span-1">
            <GameStatus 
              currentPlayer={gameState.currentPlayer}
              gameStatus={gameState.gameStatus}
              moveCount={gameState.moveCount}
            />
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex justify-center">
            <ChessBoard 
              position={gameState.board}
              onPieceClick={handlePieceClick}
              size="large"
              selectedSquare={gameState.selectedSquare}
              lastMove={gameState.lastMove}
            />
          </div>

          {/* Right Sidebar - Game Controls */}
          <div className="lg:col-span-1">
            <GameControls 
              onNewGame={handleNewGame}
              onResign={() => console.log("Resign")}
              onHint={() => console.log("Hint requested")}
            />
          </div>
        </div>
      </div>

      {/* Math Challenge Modal */}
      {showMathChallenge && (
        <MathChallenge
          onSuccess={handleMathSuccess}
          onFailure={handleMathFailure}
          onClose={() => {
            setShowMathChallenge(false);
            setPendingMove(null);
          }}
        />
      )}
    </>
  );
};

export default Game;
