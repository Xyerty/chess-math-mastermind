
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Tutorial = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
          <h1 className="text-3xl font-bold text-primary">How to Play</h1>
          <div className="w-24"></div>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Welcome to Chess Math Mastermind!</h2>
          <p>This unique game combines chess strategy with mathematical problem-solving.</p>
          
          <h3>Game Rules:</h3>
          <ol>
            <li>Click on any chess piece you want to move</li>
            <li>A math problem will appear that you must solve</li>
            <li>If you solve it correctly, you can make your chess move</li>
            <li>If you fail, you lose your turn</li>
            <li>The AI will then make its move</li>
            <li>Continue until checkmate!</li>
          </ol>

          <h3>Tips for Success:</h3>
          <ul>
            <li>Practice mental math to solve problems quickly</li>
            <li>Think about your chess strategy before clicking pieces</li>
            <li>Use the hint system when you're stuck</li>
            <li>Start with easier difficulty levels</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
