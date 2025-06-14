
import chess
import chess.polyglot
import random
import time
from typing import Tuple, Optional, Dict, Any

class ChessAI:
    def __init__(self):
        self.piece_values = {
            chess.PAWN: 100,
            chess.KNIGHT: 320,
            chess.BISHOP: 330,
            chess.ROOK: 500,
            chess.QUEEN: 900,
            chess.KING: 20000
        }
        
        # Positional bonus tables
        self.pawn_table = [
            0,  0,  0,  0,  0,  0,  0,  0,
            50, 50, 50, 50, 50, 50, 50, 50,
            10, 10, 20, 30, 30, 20, 10, 10,
            5,  5, 10, 25, 25, 10,  5,  5,
            0,  0,  0, 20, 20,  0,  0,  0,
            5, -5,-10,  0,  0,-10, -5,  5,
            5, 10, 10,-20,-20, 10, 10,  5,
            0,  0,  0,  0,  0,  0,  0,  0
        ]
        
        self.knight_table = [
            -50,-40,-30,-30,-30,-30,-40,-50,
            -40,-20,  0,  0,  0,  0,-20,-40,
            -30,  0, 10, 15, 15, 10,  0,-30,
            -30,  5, 15, 20, 20, 15,  5,-30,
            -30,  0, 15, 20, 20, 15,  0,-30,
            -30,  5, 10, 15, 15, 10,  5,-30,
            -40,-20,  0,  5,  5,  0,-20,-40,
            -50,-40,-30,-30,-30,-30,-40,-50
        ]

    def get_best_move(self, board: chess.Board, difficulty: str, time_limit: float) -> Tuple[Optional[chess.Move], float, int]:
        """Get the best move for the current position"""
        if difficulty == 'easy':
            return self._get_random_move(board)
        elif difficulty == 'medium':
            return self._get_minimax_move(board, depth=2, time_limit=time_limit)
        else:  # hard
            return self._get_minimax_move(board, depth=4, time_limit=time_limit)

    def _get_random_move(self, board: chess.Board) -> Tuple[Optional[chess.Move], float, int]:
        """Get a random legal move (easy difficulty)"""
        legal_moves = list(board.legal_moves)
        if not legal_moves:
            return None, 0, 0
        
        move = random.choice(legal_moves)
        return move, 0, 1

    def _get_minimax_move(self, board: chess.Board, depth: int, time_limit: float) -> Tuple[Optional[chess.Move], float, int]:
        """Get the best move using minimax with alpha-beta pruning"""
        start_time = time.time()
        best_move = None
        best_score = float('-inf')
        
        for move in board.legal_moves:
            if time.time() - start_time > time_limit:
                break
                
            board.push(move)
            score = self._minimax(board, depth - 1, float('-inf'), float('inf'), False, start_time, time_limit)
            board.pop()
            
            if score > best_score:
                best_score = score
                best_move = move
        
        return best_move, best_score, depth

    def _minimax(self, board: chess.Board, depth: int, alpha: float, beta: float, 
                maximizing: bool, start_time: float, time_limit: float) -> float:
        """Minimax algorithm with alpha-beta pruning"""
        if time.time() - start_time > time_limit:
            return self._evaluate_position(board)
            
        if depth == 0 or board.is_game_over():
            return self._evaluate_position(board)
        
        if maximizing:
            max_eval = float('-inf')
            for move in board.legal_moves:
                board.push(move)
                eval_score = self._minimax(board, depth - 1, alpha, beta, False, start_time, time_limit)
                board.pop()
                max_eval = max(max_eval, eval_score)
                alpha = max(alpha, eval_score)
                if beta <= alpha:
                    break
            return max_eval
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                eval_score = self._minimax(board, depth - 1, alpha, beta, True, start_time, time_limit)
                board.pop()
                min_eval = min(min_eval, eval_score)
                beta = min(beta, eval_score)
                if beta <= alpha:
                    break
            return min_eval

    def _evaluate_position(self, board: chess.Board) -> float:
        """Evaluate the current position"""
        if board.is_checkmate():
            return -20000 if board.turn else 20000
        
        if board.is_stalemate() or board.is_insufficient_material():
            return 0
        
        score = 0
        
        # Material evaluation
        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece:
                value = self.piece_values[piece.piece_type]
                
                # Add positional bonuses
                if piece.piece_type == chess.PAWN:
                    if piece.color == chess.WHITE:
                        value += self.pawn_table[square]
                    else:
                        value += self.pawn_table[chess.square_mirror(square)]
                elif piece.piece_type == chess.KNIGHT:
                    if piece.color == chess.WHITE:
                        value += self.knight_table[square]
                    else:
                        value += self.knight_table[chess.square_mirror(square)]
                
                if piece.color == chess.WHITE:
                    score += value
                else:
                    score -= value
        
        # Mobility bonus
        legal_moves = len(list(board.legal_moves))
        score += legal_moves * 10 if board.turn == chess.WHITE else -legal_moves * 10
        
        # King safety
        if board.is_check():
            score += -50 if board.turn == chess.WHITE else 50
        
        return score

    def analyze_position(self, board: chess.Board, depth: int) -> Dict[str, Any]:
        """Analyze the current position and return detailed information"""
        analysis = {
            "evaluation": self._evaluate_position(board),
            "best_moves": [],
            "threats": [],
            "weaknesses": []
        }
        
        # Get top 3 moves
        move_scores = []
        for move in list(board.legal_moves)[:10]:  # Limit to first 10 moves for performance
            board.push(move)
            score = self._minimax(board, depth - 1, float('-inf'), float('inf'), False, time.time(), 2.0)
            board.pop()
            move_scores.append((move, score))
        
        move_scores.sort(key=lambda x: x[1], reverse=True)
        analysis["best_moves"] = [{"move": move.uci(), "score": score} for move, score in move_scores[:3]]
        
        return analysis
