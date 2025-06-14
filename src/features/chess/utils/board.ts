
import { ChessPiece, Player } from '../types';
import { isValidMoveInternal } from './moveValidation';

export const findKing = (board: ChessPiece[][], player: Player): { row: number, col: number } | null => {
    const kingPiece = player === 'white' ? 'wk' : 'bk';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === kingPiece) {
                return { row: r, col: c };
            }
        }
    }
    return null;
};

export const isSquareAttacked = (board: ChessPiece[][], row: number, col: number, attackerColor: Player): boolean => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece[0] === attackerColor[0]) {
                if (isValidMoveInternal(board, { row: r, col: c }, { row, col })) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const isKingInCheck = (board: ChessPiece[][], playerColor: Player): boolean => {
    const kingPos = findKing(board, playerColor);
    if (!kingPos) return true; // Should not happen, but if king is gone, it's a game-over state.
    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    return isSquareAttacked(board, kingPos.row, kingPos.col, opponentColor);
};
