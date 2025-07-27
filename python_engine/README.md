
# Python Chess Engine

This directory contains the Python-based chess engine that provides enhanced AI capabilities for the chess application.

## Features

- **Advanced AI Algorithms**: Minimax with alpha-beta pruning
- **Multiple Difficulty Levels**: Easy (random), Medium (2-ply), Hard (4-ply)
- **Position Evaluation**: Material, positional, and tactical analysis
- **Offline Operation**: No internet connection required
- **Fast Performance**: Optimized for quick move generation

## Setup

### Automatic Setup (Recommended)
The Python engine will automatically install dependencies when first run:

```bash
python python_engine/start_engine.py
```

### Manual Setup
If you prefer to install dependencies manually:

```bash
cd python_engine
pip install -r requirements.txt
python app.py
```

## Usage

The engine runs as a local Flask server on `http://127.0.0.1:8000` and provides the following endpoints:

- `GET /health` - Check if the engine is running
- `POST /move` - Get the best move for a position
- `POST /analyze` - Analyze a chess position

The React application automatically detects if the Python engine is available and falls back to the JavaScript AI if not.

## API Examples

### Get Best Move
```bash
curl -X POST http://127.0.0.1:8000/move \
  -H "Content-Type: application/json" \
  -d '{
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "difficulty": "medium",
    "time_limit": 2.0
  }'
```

### Analyze Position
```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "depth": 3
  }'
```

## Requirements

- Python 3.7+
- Flask 2.3.3+
- python-chess library
- flask-cors for CORS support

## Architecture

The engine uses a hybrid approach:
1. **Python Engine**: Advanced algorithms for stronger play
2. **JavaScript Fallback**: Ensures the app works even without Python
3. **Automatic Detection**: Seamlessly switches between engines
4. **Local Processing**: All computation happens locally for privacy and speed

## Performance

- **Easy**: ~50ms response time (random moves)
- **Medium**: ~500-2000ms response time (2-ply search)
- **Hard**: ~1000-3000ms response time (4-ply search)

Times may vary based on position complexity and hardware.
