
// Home page: Display the beautiful chessboard central, add a header & project context

import React from "react";
import ChessBoard from "../components/ChessBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col">
      {/* Header */}
      <header className="w-full pt-12 pb-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary mb-2 animate-fade-in">
          Chess Math Mastermind
        </h1>
        <div className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Compete against an AI! Make a move—if and only if you solve a math problem. Test your chess skill and your mind!
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-10 animate-scale-in">
          <ChessBoard />
        </div>
        <div className="mx-auto mt-4 max-w-xl text-center text-muted-foreground/80">
          <span>
            This is just the start: soon you will play chess AND solve math to advance. Stay tuned!
          </span>
        </div>
      </main>
      <footer className="w-full py-6 text-center text-muted-foreground text-sm">
        <span>Created with <span className="text-primary font-semibold">Lovable</span>. {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default Index;

