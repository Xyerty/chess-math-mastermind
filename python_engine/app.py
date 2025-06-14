
from flask import Flask, request, jsonify
from flask_cors import CORS
import chess
import chess.engine
import chess.polyglot
import time
from chess_ai import ChessAI

app = Flask(__name__)
CORS(app)

# Initialize the chess AI
ai_engine = ChessAI()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "engine": "python-chess"})

@app.route('/move', methods=['POST'])
def get_ai_move():
    try:
        data = request.json
        fen = data.get('fen')
        difficulty = data.get('difficulty', 'medium')
        time_limit = data.get('time_limit', 2.0)
        
        if not fen:
            return jsonify({"error": "FEN position required"}), 400
        
        board = chess.Board(fen)
        
        start_time = time.time()
        best_move, score, depth = ai_engine.get_best_move(board, difficulty, time_limit)
        thinking_time = int((time.time() - start_time) * 1000)
        
        if best_move:
            return jsonify({
                "move": {
                    "from": {"row": 7 - best_move.from_square // 8, "col": best_move.from_square % 8},
                    "to": {"row": 7 - best_move.to_square // 8, "col": best_move.to_square % 8},
                    "uci": best_move.uci()
                },
                "score": score,
                "depth": depth,
                "thinking_time": thinking_time
            })
        else:
            return jsonify({"error": "No valid move found"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze_position():
    try:
        data = request.json
        fen = data.get('fen')
        depth = data.get('depth', 3)
        
        board = chess.Board(fen)
        analysis = ai_engine.analyze_position(board, depth)
        
        return jsonify(analysis)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=False)
