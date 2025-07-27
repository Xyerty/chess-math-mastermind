
import { useEffect } from 'react';
import { ChessGameState } from '../features/chess/types';

interface UseGameTimerProps {
  gameState: ChessGameState;
  setGameState: React.Dispatch<React.SetStateAction<ChessGameState>>;
}

export const useGameTimer = ({ gameState, setGameState }: UseGameTimerProps) => {
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'check') {
      timerId = setInterval(() => {
        setGameState(prev => {
          if (prev.gameStatus !== 'playing' && prev.gameStatus !== 'check') {
            return prev;
          }

          const newTime = { ...prev.time };
          const newCurrentPlayerTime = newTime[prev.currentPlayer] - 1;

          if (newCurrentPlayerTime <= 0) {
            return {
              ...prev,
              time: { ...newTime, [prev.currentPlayer]: 0 },
              gameStatus: 'timeout',
            };
          }

          return {
            ...prev,
            time: { ...newTime, [prev.currentPlayer]: newCurrentPlayerTime },
          };
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [gameState.gameStatus, setGameState]);
};
