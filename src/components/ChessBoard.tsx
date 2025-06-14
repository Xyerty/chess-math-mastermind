
import React, { useState } from "react";

// Unicode chess pieces for easy visualization (can be replaced by SVGs later)
const PIECE_UNICODES: Record<string, string> = {
  wp: "♙",
  wn: "♘",
  wb: "♗",
  wr: "♖",
  wq: "♕",
  wk: "♔",
  bp: "♟",
  bn: "♞",
  bb: "♝",
  br: "♜",
  bq: "♛",
  bk: "♚",
};

// Standard chess starting position
export const defaultPosition: Array<Array<string | null>> = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];

interface ChessBoardProps {
  position?: Array<Array<string | null>>;
  size?: 'normal' | 'large';
  onPieceClick?: (row: number, col: number, piece: string | null) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  position = defaultPosition, 
  size = 'normal',
  onPieceClick 
}) => {
  const [selectedSquare, setSelectedSquare] = useState<{row: number, col: number} | null>(null);
  
  const boardSize = size === 'large' ? 'max-w-[720px]' : 'max-w-[520px]';
  const textSize = size === 'large' ? 'text-5xl' : 'text-3xl';
  
  const handleSquareClick = (row: number, col: number, piece: string | null) => {
    if (piece) {
      setSelectedSquare({row, col});
      onPieceClick?.(row, col, piece);
    } else {
      setSelectedSquare(null);
    }
  };

  return (
    <div className="relative">
      {/* Column Labels (a-h) */}
      <div className="flex justify-center mb-2">
        <div className={`grid grid-cols-8 ${boardSize} px-4`}>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className="text-center text-muted-foreground font-semibold">
              {letter}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        {/* Row Labels (8-1) */}
        <div className="flex flex-col mr-2">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(number => (
            <div key={number} className={`flex items-center justify-center ${size === 'large' ? 'h-[90px]' : 'h-[65px]'} text-muted-foreground font-semibold`}>
              {number}
            </div>
          ))}
        </div>

        {/* Chess Board */}
        <div className={`grid grid-cols-8 grid-rows-8 gap-0 w-full ${boardSize} aspect-square shadow-2xl rounded-lg overflow-hidden border-4 border-muted`}>
          {position.map((row, rowIdx) =>
            row.map((piece, colIdx) => {
              const dark = (rowIdx + colIdx) % 2 === 1;
              const isSelected = selectedSquare?.row === rowIdx && selectedSquare?.col === colIdx;
              
              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`
                    relative w-full h-full aspect-square flex items-center justify-center ${textSize} font-bold 
                    transition-all duration-200 cursor-pointer hover:brightness-110
                    ${dark ? "bg-[#779556]" : "bg-[#eeeed2]"}
                    ${isSelected ? "ring-4 ring-blue-500 ring-inset" : ""}
                    ${piece && !isSelected ? "hover:ring-2 hover:ring-yellow-400 hover:ring-inset" : ""}
                  `}
                  style={{ userSelect: "none" }}
                  onClick={() => handleSquareClick(rowIdx, colIdx, piece)}
                >
                  {piece ? (
                    <span
                      className="select-none transition-transform duration-200 hover:scale-110"
                      style={{
                        filter: dark
                          ? "drop-shadow(0 2px 2px #222)"
                          : "drop-shadow(0 2px 2px #ccc)",
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

        {/* Row Labels (8-1) - Right side */}
        <div className="flex flex-col ml-2">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(number => (
            <div key={number} className={`flex items-center justify-center ${size === 'large' ? 'h-[90px]' : 'h-[65px]'} text-muted-foreground font-semibold`}>
              {number}
            </div>
          ))}
        </div>
      </div>

      {/* Column Labels (a-h) - Bottom */}
      <div className="flex justify-center mt-2">
        <div className={`grid grid-cols-8 ${boardSize} px-4`}>
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className="text-center text-muted-foreground font-semibold">
              {letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
