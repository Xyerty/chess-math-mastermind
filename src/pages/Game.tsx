import React, { useState, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useChessGame } from "../hooks/useChessGame";
import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import MathChallenge from "../components/MathChallenge";
import BottomActionMenu from "../components/BottomActionMenu";
import { useDifficulty } from "../contexts/DifficultyContext";
import { useSettings } from "../contexts/SettingsContext";
import { useGameMode } from "../contexts/GameModeContext";
import MoveHistory from "../components/MoveHistory";

const Game = () => {
  const { t } = useLanguage();
  const { aiDifficulty, mathDifficulty } = useDifficulty();
  const { gameMode } = useGameMode();
  const { settings } = useSettings();
  const { gameState, handleSquareClick, makeMove, clearSelection, resetGame } = useChessGame(aiDifficulty, gameMode);
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ from: { row: number, col: number }, to: { row: number, col: number } } | null>(null);
  const [mathStats, setMathStats] = useState({ correct: 0, incorrect: 0 });

  const mathTimeLimit = settings.timeLimits.unlimited
    ? Infinity
    : settings.timeLimits[mathDifficulty];

  const onChessBoardClick = useCallback((row: number, col: number) => {
    const result = handleSquareClick(row, col);

    if (result?.type === 'move_attempt') {
      clearSelection(); 
      setPendingMove(result.payload);
      setShowMathChallenge(true);
    }
  }, [handleSquareClick, clearSelection]);

  const handleMathSuccess = () => {
    setShowMathChallenge(false);
    setMathStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    if (pendingMove) {
      makeMove(pendingMove.from, pendingMove.to);
      setPendingMove(null);
    }
  };

  const handleMathFailure = () => {
    setShowMathChallenge(false);
    setMathStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    setPendingMove(null);
    console.log("Math challenge failed! No move allowed.");
  };

  const handleNewGame = () => {
    resetGame();
    setMathStats({ correct: 0, incorrect: 0 });
  };
  
  const mathAccuracy = mathStats.correct + mathStats.incorrect === 0 ? 100 : Math.round((mathStats.correct / (mathStats.correct + mathStats.incorrect)) * 100);

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

        <div className="p-4 flex-grow overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GameStatus 
                currentPlayer={gameState.currentPlayer}
                gameStatus={gameState.gameStatus}
                moveCount={gameState.moveCount}
                time={gameState.time}
                mathAccuracy={mathAccuracy}
                aiStats={gameState.aiStats}
              />
            </div>
            <div className="lg:col-span-1">
              <MoveHistory moves={gameState.moveHistory} />
            </div>
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
          difficulty={gameMode === 'math-master' ? 'hard' : mathDifficulty}
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
