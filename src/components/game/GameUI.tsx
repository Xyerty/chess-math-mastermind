
import React from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { ChessGameState, GameMode, Player } from '../../features/chess/types';
import ChessBoard from '../ChessBoard';
import GameStatus from '../GameStatus';
import BottomActionMenu from '../BottomActionMenu';
import HintDisplay from '../HintDisplay';
import MoveHistory from '../MoveHistory';
import GameEndModal from '../GameEndModal';
import MathChallenge from '../MathChallenge';
import { Button } from '@/components/ui/button';
import { MathChallengeState } from '../../hooks/useMathChallenge';
import { HintAnalysis } from '../../hooks/useHint';

interface PlayFabDataForUI {
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

interface GameUIProps {
  // Game State
  gameState: ChessGameState;
  gameMode: GameMode;
  isGameOver: boolean;
  winner: Player | null;

  // Chess Board
  onChessBoardClick: (row: number, col: number) => void;

  // Actions
  onNewGame: () => void;
  onResign: () => void;
  onGoHome: () => void;

  // AI
  isAIThinking: boolean;
  usingPythonEngine: boolean;
  aiDifficulty: 'easy' | 'medium' | 'hard';

  // Hints
  showHint: boolean;
  currentHint: HintAnalysis | null;
  onHintRequest: () => void;
  onCloseHint: () => void;
  canRequestHint: boolean;
  isAnalyzing: boolean;
  hintsUsed: number;
  maxHints: number;

  // Math Challenge
  mathState: MathChallengeState;
  onMathSuccess: () => void;
  onMathFailure: () => void;
  onMathCancel: () => void;
  mathAccuracy: number;

  // PlayFab
  playFabData: PlayFabDataForUI;
  retryConnection: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  gameMode,
  isGameOver,
  winner,
  onChessBoardClick,
  onNewGame,
  onResign,
  onGoHome,
  isAIThinking,
  usingPythonEngine,
  aiDifficulty,
  showHint,
  currentHint,
  onHintRequest,
  onCloseHint,
  canRequestHint,
  isAnalyzing,
  hintsUsed,
  maxHints,
  mathState,
  onMathSuccess,
  onMathFailure,
  onMathCancel,
  mathAccuracy,
  playFabData,
  retryConnection,
}) => {
  return (
    <>
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
              
              {showHint && currentHint && (
                <div className="mt-4">
                  <HintDisplay 
                    hint={currentHint}
                    onClose={onCloseHint}
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
        onNewGame={onNewGame}
        onResign={onResign}
        onHint={onHintRequest}
        canRequestHint={canRequestHint}
        isAnalyzing={isAnalyzing}
      />

      <GameEndModal
        isOpen={isGameOver}
        status={gameState.gameStatus}
        winner={winner}
        onNewGame={onNewGame}
        onGoHome={onGoHome}
      />

      {mathState.isActive && (
        <MathChallenge
          onSuccess={onMathSuccess}
          onFailure={onMathFailure}
          onClose={onMathCancel}
          difficulty={mathState.difficulty}
          timeLimit={gameMode === 'speed' ? 15 : 30}
        />
      )}
    </>
  );
};

export default GameUI;
