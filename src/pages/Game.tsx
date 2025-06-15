
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
  const gameController = useGameController({ chessGame, navigate });
  const playFab = usePlayFab();

  return (
    <GameErrorBoundary onReset={gameController.handleNewGame} onGoHome={gameController.handleGoHome}>
      <GameUI
        chessGame={chessGame}
        gameController={gameController}
        playFab={playFab}
        gameMode={gameMode}
        aiDifficulty={aiDifficulty}
      />
    </GameErrorBoundary>
  );
};

export default Game;
