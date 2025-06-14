import React, { useState, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useChessGame } from "../hooks/useChessGame";
import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import MathChallenge from "../components/MathChallenge";
import BottomActionMenu from "../components/BottomActionMenu";
import { useDifficulty } from "../contexts/DifficultyContext";
import { useSettings } from "../contexts/SettingsContext";

const Game = () => {
  const { t } = useLanguage();
  const { aiDifficulty, mathDifficulty } = useDifficulty();
  const { settings } = useSettings();
  const { gameState, handleSquareClick, makeMove, clearSelection, resetGame } = useChessGame(aiDifficulty);
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ from: { row: number, col: number }, to: { row: number, col: number } } | null>(null);

  const mathTimeLimit = settings.timeLimits.unlimited
    ? Infinity
    : settings.timeLimits[mathDifficulty];

  const onChessBoardClick = useCallback((row: number, col: number) => {
    const result = handleSquareClick(row, col);

    if (result?.type === 'move_attempt') {
      // Before showing the math challenge, clear the visual selection on the board
      // to avoid confusion, and store the intended move.
      clearSelection(); 
      setPendingMove(result.payload);
      setShowMathChallenge(true);
    }
  }, [handleSquareClick, clearSelection]);

  const handleMathSuccess = () => {
    setShowMathChallenge(false);
    if (pendingMove) {
      makeMove(pendingMove.from, pendingMove.to);
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
      <div className="flex flex-col h-full" style={{ paddingBottom: '70px' }}>
        <div className="flex justify-center items-start p-2 sm:p-4 bg-gradient-to-b from-slate-50 to-slate-50/0 dark:from-slate-900/50 dark:to-slate-900/0">
          <ChessBoard 
            position={gameState.board}
            onPieceClick={onChessBoardClick}
            selectedSquare={gameState.selectedSquare}
            lastMove={gameState.lastMove}
          />
        </div>

        <div className="p-4">
          <div className="max-w-2xl mx-auto w-full">
            <GameStatus 
              currentPlayer={gameState.currentPlayer}
              gameStatus={gameState.gameStatus}
              moveCount={gameState.moveCount}
            />
          </div>
        </div>
      </div>

      <BottomActionMenu 
        onNewGame={handleNewGame}
        onResign={() => console.log("Resign")}
        onHint={() => console.log("Hint requested")}
      />

      {showMathChallenge && (
        <MathChallenge
          difficulty={mathDifficulty}
          timeLimit={mathTimeLimit}
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
