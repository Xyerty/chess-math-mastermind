
import React from "react";
import { ChessMove } from "../features/chess/types";

// Use solid piece characters for easier styling
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
  const boardSizeClass = 'w-full max-w-[90vmin] sm:max-w-[700px]';
  const textSizeClass = 'text-[34px] sm:text-4xl md:text-5xl';
  const labelSizeClass = 'text-[10px] sm:text-xs md:text-sm';
  const labelHeightClass = 'h-6 sm:h-8';

  const handleSquareClick = (row: number, col: number, piece: string | null) => {
    onPieceClick?.(row, col, piece);
  };

  const isLastMoveSquare = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    return (lastMove.from.row === row && lastMove.from.col === col) ||
           (lastMove.to.row === row && lastMove.to.col === col);
  };

  return (
    <div className="relative animate-fade-in">
      {/* Column Labels (a-h) - Top */}
      <div className="flex justify-center mb-1">
        <div className={`grid grid-cols-8 ${boardSizeClass} px-1 sm:px-2`}>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className={`text-center text-muted-foreground font-semibold ${labelSizeClass}`}>
              {letter}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        {/* Row Labels (8-1) - Left */}
        <div className="flex flex-col mr-1 sm:mr-2">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(number => (
            <div key={number} className={`flex items-center justify-center ${labelHeightClass} text-muted-foreground font-semibold ${labelSizeClass} w-4 sm:w-6`}>
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
              const isWhitePiece = piece?.[0] === 'w';

              const pieceStyle = {
                textShadow: `0 1px 3px hsla(var(--piece-${isWhitePiece ? 'white' : 'black'}-stroke), 0.7)`
              };
              
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`
                    relative w-full aspect-square flex items-center justify-center ${textSizeClass} font-bold 
                    transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-95
                    ${dark ? "bg-board-dark" : "bg-board-light"}
                    ${isSelected ? "ring-4 ring-ring ring-inset" : ""}
                    ${isLastMove ? "ring-2 ring-last-move-highlight ring-inset" : ""}
                    ${piece && !isSelected && !isLastMove ? "hover:ring-2 hover:ring-last-move-highlight/70 hover:ring-inset" : ""}
                  `}
                  style={{ userSelect: "none" }}
                  onClick={() => handleSquareClick(rowIdx, colIdx, piece)}
                >
                  {piece ? (
                    <span
                      className={`select-none transition-transform duration-200 hover:scale-110 active:scale-95 ${isWhitePiece ? 'text-piece-white-fill' : 'text-piece-black-fill'}`}
                      style={pieceStyle}
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
            <div key={number} className={`flex items-center justify-center ${labelHeightClass} text-muted-foreground font-semibold ${labelSizeClass} w-4 sm:w-6`}>
              {number}
            </div>
          ))}
        </div>
      </div>

      {/* Column Labels (a-h) - Bottom */}
      <div className="flex justify-center mt-1">
        <div className={`grid grid-cols-8 ${boardSizeClass} px-1 sm:px-2`}>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className={`text-center text-muted-foreground font-semibold ${labelSizeClass}`}>
              {letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;

