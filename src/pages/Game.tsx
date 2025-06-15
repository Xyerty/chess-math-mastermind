
import React, { useCallback, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useChessGame } from "../hooks/useChessGame";
import ChessBoard from "../components/ChessBoard";
import GameStatus from "../components/GameStatus";
import BottomActionMenu from "../components/BottomActionMenu";
import HintDisplay from "../components/HintDisplay";
import GameErrorBoundary from "../components/GameErrorBoundary";
import { useDifficulty } from "../contexts/DifficultyContext";
import { useGameMode } from "../contexts/GameModeContext";
import MoveHistory from "../components/MoveHistory";
import GameEndModal from "../components/GameEndModal";
import MathChallenge from "../components/MathChallenge";
import { useNavigate } from "react-router-dom";
import { Player } from "../features/chess/types";
import { usePlayFab } from "../hooks/usePlayFab";
import { Button } from "@/components/ui/button";
import { Loader2, Wifi, WifiOff } from 'lucide-react';

const Game = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { aiDifficulty } = useDifficulty();
  const { gameMode } = useGameMode();
  const { 
    gameState, 
    handleSquareClick, 
    makeMove, 
    clearSelection, 
    resetGame, 
    resignGame, 
    isAIThinking, 
    usingPythonEngine,
    currentHint,
    isAnalyzing,
    hintsUsed,
    maxHints,
    canRequestHint,
    requestHint,
    clearHint,
    // Math challenge properties
    mathState,
    completeMathChallenge,
    cancelMathChallenge,
    executePendingMove,
    mathAccuracy
  } = useChessGame(aiDifficulty, gameMode);

  const { playFabData, retryConnection } = usePlayFab();
  const [showHint, setShowHint] = useState(false);

  const onChessBoardClick = useCallback((row: number, col: number) => {
    try {
      const result = handleSquareClick(row, col);

      if (result?.type === 'move_attempt') {
        const moveSuccessful = makeMove(result.payload.from, result.payload.to);
        if (!moveSuccessful) {
          clearSelection();
        }
      } else if (result?.type === 'math_challenge') {
        // Math challenge is automatically started by the move handler
        console.log('Math challenge triggered for move:', result.payload);
      }
    } catch (error) {
      console.error('Error handling chess board click:', error);
      clearSelection();
    }
  }, [handleSquareClick, makeMove, clearSelection]);

  const handleNewGame = () => {
    try {
      resetGame();
      setShowHint(false);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const handleHintRequest = async () => {
    try {
      await requestHint();
      setShowHint(true);
    } catch (error) {
      console.error('Error requesting hint:', error);
    }
  };

  const handleCloseHint = () => {
    setShowHint(false);
    clearHint();
  };

  const handleMathSuccess = useCallback(() => {
    try {
      const moveExecuted = executePendingMove();
      completeMathChallenge(true);
      if (!moveExecuted) {
        console.error('Failed to execute pending move after math success');
      }
    } catch (error) {
      console.error('Error executing move after math success:', error);
      completeMathChallenge(false);
    }
  }, [executePendingMove, completeMathChallenge]);

  const handleMathFailure = useCallback(() => {
    try {
      completeMathChallenge(false);
      clearSelection(); // Clear selection since move failed
    } catch (error) {
      console.error('Error handling math failure:', error);
    }
  }, [completeMathChallenge, clearSelection]);

  const handleMathCancel = useCallback(() => {
    try {
      cancelMathChallenge();
      clearSelection();
    } catch (error) {
      console.error('Error canceling math challenge:', error);
    }
  }, [cancelMathChallenge, clearSelection]);

  const handleGoHome = () => {
    navigate('/');
  };

  const isGameOver = ['checkmate', 'stalemate', 'timeout', 'resigned'].includes(gameState.gameStatus);
  
  let winner: Player | null = null;
  if (gameState.gameStatus === 'checkmate' || gameState.gameStatus === 'timeout') {
    winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
  } else if (gameState.gameStatus === 'resigned') {
    winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
  }

  return (
    <GameErrorBoundary onReset={handleNewGame} onGoHome={handleGoHome}>
      <div className="flex flex-col h-full" style={{ paddingBottom: '70px' }}>
        <div className="flex justify-center items-start p-2 sm:p-4 bg-gradient-to-b from-slate-50 to-slate-50/0 dark:from-slate-900/50 dark:to-slate-900/0">
          <ChessBoard 
            position={gameState.board}
            onPieceClick={onChessBoardClick}
            selectedSquare={gameState.selectedSquare}
            lastMove={gameState.lastMove}
            hintMove={showHint && currentHint?.bestMove ? currentHint.bestMove : null}
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

              {/* PlayFab Connection Status */}
              <div className="mt-4 p-3 bg-muted/50 dark:bg-muted/20 rounded-lg flex items-center justify-between text-sm shadow-inner">
                <div className="flex items-center gap-2 font-semibold">
                  {playFabData.connectionStatus === 'connected' && <Wifi className="h-5 w-5 text-green-500" />}
                  {playFabData.connectionStatus === 'connecting' && <Loader2 className="h-5 w-5 animate-spin" />}
                  {playFabData.connectionStatus === 'error' && <WifiOff className="h-5 w-5 text-destructive" />}
                  {playFabData.connectionStatus === 'disconnected' && <WifiOff className="h-5 w-5 text-muted-foreground" />}
                  <span>PlayFab Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="capitalize text-muted-foreground">{playFabData.connectionStatus}</span>
                  {playFabData.connectionStatus === 'error' && (
                      <Button onClick={retryConnection} size="sm" variant="secondary">Retry</Button>
                  )}
                </div>
              </div>

              {/* Math Master Mode Stats */}
              {gameMode === 'math-master' && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2">Math Challenge Stats</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Accuracy</div>
                      <div className="font-semibold">{mathAccuracy}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Correct</div>
                      <div className="font-semibold">{mathState.correctAnswers}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Streak</div>
                      <div className="font-semibold">{mathState.streak}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hint Display */}
              {showHint && currentHint && (
                <div className="mt-4">
                  <HintDisplay 
                    hint={currentHint}
                    onClose={handleCloseHint}
                    hintsRemaining={maxHints - hintsUsed}
                  />
                </div>
              )}
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
        onHint={handleHintRequest}
        canRequestHint={canRequestHint}
        isAnalyzing={isAnalyzing}
      />

      <GameEndModal
        isOpen={isGameOver}
        status={gameState.gameStatus}
        winner={winner}
        onNewGame={handleNewGame}
        onGoHome={handleGoHome}
      />

      {/* Math Challenge Modal */}
      {mathState.isActive && (
        <MathChallenge
          onSuccess={handleMathSuccess}
          onFailure={handleMathFailure}
          onClose={handleMathCancel}
          difficulty={mathState.difficulty}
          timeLimit={gameMode === 'speed' ? 15 : 30}
        />
      )}
    </GameErrorBoundary>
  );
};

export default Game;
