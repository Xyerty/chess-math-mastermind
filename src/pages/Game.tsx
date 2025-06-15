
import React from "react";
import { useChessGame } from "../hooks/useChessGame";
import GameErrorBoundary from "../components/GameErrorBoundary";
import { useDifficulty } from "../contexts/DifficultyContext";
import { useGameMode } from "../contexts/GameModeContext";
import { useNavigate } from "react-router-dom";
import { usePlayFab } from "../hooks/usePlayFab";
import { useGameController } from '../hooks/useGameController';
import GameUI from '../components/game/GameUI';

const Game = () => {
  const navigate = useNavigate();
  const { aiDifficulty } = useDifficulty();
  const { gameMode } = useGameMode();
  
  const chessGame = useChessGame(aiDifficulty, gameMode);
  
  const {
    showHint,
    onChessBoardClick,
    handleNewGame,
    handleHintRequest,
    handleCloseHint,
    handleMathSuccess,
    handleMathFailure,
    handleMathCancel,
    handleGoHome,
    isGameOver,
    winner,
    resignGame,
  } = useGameController({ chessGame, navigate });

  const { playFabData, retryConnection } = usePlayFab();

  return (
    <GameErrorBoundary onReset={handleNewGame} onGoHome={handleGoHome}>
      <GameUI
        gameState={chessGame.gameState}
        gameMode={gameMode}
        isGameOver={isGameOver}
        winner={winner}
        onChessBoardClick={onChessBoardClick}
        onNewGame={handleNewGame}
        onResign={resignGame}
        onGoHome={handleGoHome}
        isAIThinking={chessGame.isAIThinking}
        usingPythonEngine={chessGame.usingPythonEngine}
        aiDifficulty={aiDifficulty}
        showHint={showHint}
        currentHint={chessGame.currentHint}
        onHintRequest={handleHintRequest}
        onCloseHint={handleCloseHint}
        canRequestHint={chessGame.canRequestHint}
        isAnalyzing={chessGame.isAnalyzing}
        hintsUsed={chessGame.hintsUsed}
        maxHints={chessGame.maxHints}
        mathState={chessGame.mathState}
        onMathSuccess={handleMathSuccess}
        onMathFailure={handleMathFailure}
        onMathCancel={handleMathCancel}
        mathAccuracy={chessGame.mathAccuracy}
        playFabData={playFabData}
        retryConnection={retryConnection}
      />
    </GameErrorBoundary>
  );
};

export default Game;
