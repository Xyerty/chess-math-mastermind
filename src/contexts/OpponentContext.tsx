
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type OpponentType = 'human' | 'ai';
export type PlayerColor = 'white' | 'black';

interface OpponentContextType {
  opponentType: OpponentType;
  setOpponentType: (type: OpponentType) => void;
  playerColor: PlayerColor;
  setPlayerColor: (color: PlayerColor) => void;
}

const OpponentContext = createContext<OpponentContextType | undefined>(undefined);

export const OpponentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [opponentType, setOpponentType] = useState<OpponentType>('human');
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');

  return (
    <OpponentContext.Provider value={{ opponentType, setOpponentType, playerColor, setPlayerColor }}>
      {children}
    </OpponentContext.Provider>
  );
};

export const useOpponent = () => {
  const context = useContext(OpponentContext);
  if (!context) {
    throw new Error('useOpponent must be used within an OpponentProvider');
  }
  return context;
};
