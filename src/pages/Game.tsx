
import React, { useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useChessGame } from "../hooks/useChessGame";
import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import BottomActionMenu from "../components/BottomActionMenu";
import { useDifficulty } from "../contexts/DifficultyContext";
import { useGameMode } from "../contexts/GameModeContext";
import MoveHistory from "../components/MoveHistory";
import GameEndModal from "../components/GameEndModal";
import { useNavigate } from "react-router-dom";
import { Player } from "../features/chess/types";

const Game = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { aiDifficulty } = useDifficulty();
  const { gameMode } = useGameMode();
  const { gameState, handleSquareClick, makeMove, clearSelection, resetGame, resignGame, isAIThinking, usingPythonEngine } = useChessGame(aiDifficulty, gameMode);

  const onChessBoardClick = useCallback((row: number, col: number) => {
    const result = handleSquareClick(row, col);

    if (result?.type === 'move_attempt') {
      const moveSuccessful = makeMove(result.payload.from, result.payload.to);
      if (!moveSuccessful) {
        clearSelection();
      }
    }
  }, [handleSquareClick, makeMove, clearSelection]);

  const handleNewGame = () => {
    resetGame();
  };

  const isGameOver = ['checkmate', 'stalemate', 'timeout', 'resigned'].includes(gameState.gameStatus);
  
  let winner: Player | null = null;
  if (gameState.gameStatus === 'checkmate' || gameState.gameStatus === 'timeout') {
    winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
  } else if (gameState.gameStatus === 'resigned') {
    winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
  }

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
                aiStats={gameState.aiStats}
                isAIThinking={isAIThinking}
                aiDifficulty={aiDifficulty}
                usingPythonEngine={usingPythonEngine}
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
        onResign={resignGame}
        onHint={() => console.log("Hint requested")}
      />

      <GameEndModal
        isOpen={isGameOver}
        status={gameState.gameStatus}
        winner={winner}
        onNewGame={handleNewGame}
        onGoHome={() => navigate('/')}
      />
    </>
  );
};

export default Game;
