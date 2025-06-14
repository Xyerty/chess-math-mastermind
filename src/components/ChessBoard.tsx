
import React from "react";
import { ChessMove } from "../hooks/useChessGame";

// Unicode chess pieces for easy visualization
const PIECE_UNICODES: Record<string, string> = {
  wp: "♙", wn: "♘", wb: "♗", wr: "♖", wq: "♕", wk: "♔",
  bp: "♟", bn: "♞", bb: "♝", br: "♜", bq: "♛", bk: "♚",
};

interface ChessBoardProps {
  position: Array<Array<string | null>>;
  onPieceClick?: (row: number, col: number, piece: string | null) => void;
  selectedSquare?: { row: number; col: number } | null;
  lastMove?: ChessMove | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  position, 
  onPieceClick,
  selectedSquare,
  lastMove
}) => {
  const boardSizeClass = 'w-full max-w-[320px] sm:max-w-md md:max-w-lg lg:max-w-xl';
  const squareSizeClass = 'h-10 sm:h-12 md:h-14 lg:h-16';
  const textSizeClass = 'text-2xl sm:text-3xl md:text-4xl';

  const handleSquareClick = (row: number, col: number, piece: string | null) => {
    onPieceClick?.(row, col, piece);
  };

  const isLastMoveSquare = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    return (lastMove.from.row === row && lastMove.from.col === col) ||
           (lastMove.to.row === row && lastMove.to.col === col);
  };

  return (
    <div className="relative">
      {/* Column Labels (a-h) - Top */}
      <div className="flex justify-center mb-1 sm:mb-2">
        <div className={`grid grid-cols-8 ${boardSizeClass} px-2 sm:px-4`}>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className="text-center text-muted-foreground font-semibold text-xs sm:text-sm">
              {letter}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        {/* Row Labels (8-1) - Left */}
        <div className="flex flex-col mr-1 sm:mr-2">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(number => (
            <div key={number} className={`flex items-center justify-center ${squareSizeClass} text-muted-foreground font-semibold text-xs sm:text-sm`}>
              {number}
            </div>
          ))}
        </div>

        {/* Chess Board */}
        <div className={`grid grid-cols-8 grid-rows-8 gap-0 ${boardSizeClass} aspect-square shadow-xl rounded-lg overflow-hidden border-2 sm:border-4 border-muted`}>
          {position.map((row, rowIdx) =>
            row.map((piece, colIdx) => {
              const dark = (rowIdx + colIdx) % 2 === 1;
              const isSelected = selectedSquare?.row === rowIdx && selectedSquare?.col === colIdx;
              const isLastMove = isLastMoveSquare(rowIdx, colIdx);
              
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`
                    relative w-full aspect-square flex items-center justify-center ${textSizeClass} font-bold 
                    transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-95
                    ${dark ? "bg-[#779556]" : "bg-[#eeeed2]"}
                    ${isSelected ? "ring-2 sm:ring-4 ring-blue-500 ring-inset" : ""}
                    ${isLastMove ? "ring-2 ring-yellow-400 ring-inset" : ""}
                    ${piece && !isSelected && !isLastMove ? "hover:ring-1 sm:hover:ring-2 hover:ring-yellow-400 hover:ring-inset" : ""}
                  `}
                  style={{ userSelect: "none" }}
                  onClick={() => handleSquareClick(rowIdx, colIdx, piece)}
                >
                  {piece ? (
                    <span
                      className="select-none transition-transform duration-200 hover:scale-110 active:scale-95"
                      style={{
                        filter: dark
                          ? "drop-shadow(0 1px 2px #222)"
                          : "drop-shadow(0 1px 2px #ccc)",
                      }}
                    >
                      {PIECE_UNICODES[piece]}
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Row Labels (8-1) - Right */}
        <div className="flex flex-col ml-1 sm:ml-2">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(number => (
            <div key={number} className={`flex items-center justify-center ${squareSizeClass} text-muted-foreground font-semibold text-xs sm:text-sm`}>
              {number}
            </div>
          ))}
        </div>
      </div>

      {/* Column Labels (a-h) - Bottom */}
      <div className="flex justify-center mt-1 sm:mt-2">
        <div className={`grid grid-cols-8 ${boardSizeClass} px-2 sm:px-4`}>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className="text-center text-muted-foreground font-semibold text-xs sm:text-sm">
              {letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
