
interface PythonMoveResponse {
  move: {
    from: { row: number; col: number };
    to: { row: number; col: number };
    uci: string;
  };
  score: number;
  depth: number;
  thinking_time: number;
}

interface PythonAnalysisResponse {
  evaluation: number;
  best_moves: Array<{ move: string; score: number }>;
  threats: string[];
  weaknesses: string[];
}

class PythonEngineService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? '' // No Python backend in production on Vercel Hobby
    : 'http://127.0.0.1:8000';
  private isAvailable = false;

  async checkAvailability(): Promise<boolean> {
    // In production on Vercel, Python engine is not available
    if (process.env.NODE_ENV === 'production') {
      this.isAvailable = false;
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000)
      });
      this.isAvailable = response.ok;
      return this.isAvailable;
    } catch (error) {
      console.log('Python engine not available:', error);
      this.isAvailable = false;
      return false;
    }
  }

  async getMove(fen: string, difficulty: 'easy' | 'medium' | 'hard', timeLimit: number = 2.0): Promise<PythonMoveResponse | null> {
    if (process.env.NODE_ENV === 'production') {
      return null; // Fall back to JavaScript AI
    }

    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    if (!this.isAvailable) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen,
          difficulty,
          time_limit: timeLimit
        }),
        signal: AbortSignal.timeout(timeLimit * 1000 + 1000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting move from Python engine:', error);
      this.isAvailable = false;
      return null;
    }
  }

  async analyzePosition(fen: string, depth: number = 3): Promise<PythonAnalysisResponse | null> {
    if (process.env.NODE_ENV === 'production') {
      return null; // Fall back to JavaScript AI
    }

    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    if (!this.isAvailable) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen, depth }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing position:', error);
      return null;
    }
  }

  getIsAvailable(): boolean {
    return this.isAvailable;
  }
}

export const pythonEngine = new PythonEngineService();
export type { PythonMoveResponse, PythonAnalysisResponse };
