
import React from 'react';

interface HintOverlayProps {
  bestMove?: {
    from: { row: number; col: number };
    to: { row: number; col: number };
  };
  boardSize: string;
}

const HintOverlay: React.FC<HintOverlayProps> = ({ bestMove, boardSize }) => {
  if (!bestMove) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none grid grid-cols-8 grid-rows-8 ${boardSize}`}>
      {Array.from({ length: 64 }).map((_, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        
        const isFromSquare = bestMove.from.row === row && bestMove.from.col === col;
        const isToSquare = bestMove.to.row === row && bestMove.to.col === col;
        
        if (!isFromSquare && !isToSquare) return <div key={index} />;
        
        return (
          <div
            key={index}
            className={`relative flex items-center justify-center ${
              isFromSquare 
                ? 'bg-blue-400/30 ring-2 ring-blue-500 ring-inset' 
                : 'bg-green-400/30 ring-2 ring-green-500 ring-inset'
            } animate-pulse`}
          >
            {isFromSquare && (
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
            )}
            {isToSquare && (
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HintOverlay;
