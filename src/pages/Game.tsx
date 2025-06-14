
import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useChessGame } from "../hooks/useChessGame";
import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import MathChallenge from "../components/MathChallenge";
import BottomActionMenu from "../components/BottomActionMenu";
import { useDifficulty } from "../contexts/DifficultyContext";

const Game = () => {
  const { t } = useLanguage();
  const { aiDifficulty, mathDifficulty } = useDifficulty();
  const { gameState, selectSquare, resetGame } = useChessGame(aiDifficulty);
  const [showMathChallenge, setShowMathChallenge] = useState(false);
  const [pendingMove, setPendingMove] = useState<{row: number, col: number} | null>(null);

  const mathTimeLimit = {
    easy: 45,
    medium: 30,
    hard: 20
  }[mathDifficulty];

  const handlePieceClick = (row: number, col: number, piece: string | null) => {
    if (piece && piece[0] === gameState.currentPlayer[0]) {
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
      <div className="flex flex-col h-full" style={{ paddingBottom: '70px' }}>
        <div className="flex justify-center items-start p-2 sm:p-4 bg-gradient-to-b from-slate-50 to-transparent">
          <ChessBoard 
            position={gameState.board}
            onPieceClick={handlePieceClick}
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
