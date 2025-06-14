
import React from "react";

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

// ChessBoard Props: for now only position, expand later
interface ChessBoardProps {
  position?: Array<Array<string | null>>;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ position = defaultPosition }) => {
  return (
    <div className="grid grid-cols-8 grid-rows-8 gap-0 w-full max-w-[520px] aspect-square mx-auto shadow-2xl rounded-lg overflow-hidden border-2 border-muted">
      {position.map((row, rowIdx) =>
        row.map((piece, colIdx) => {
          const dark = (rowIdx + colIdx) % 2 === 1;
          return (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`relative w-full h-full aspect-square flex items-center justify-center text-3xl font-bold transition-colors ${dark ? "bg-[#779556]" : "bg-[#eeeed2]"}`}
              style={{
                userSelect: "none",
              }}
            >
              {piece ? (
                <span
                  className={`select-none`}
                  style={{
                    filter: dark
                      ? "drop-shadow(0 1px 1px #222)"
                      : "drop-shadow(0 1px 1px #ccc)",
                  }}
                >
                  {PIECE_UNICODES[piece]}
                </span>
              ) : null}
              {/* Highlight or clickable areas for moves/captures will be implemented later */}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;

