
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Statistics = () => {
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
          <h1 className="text-3xl font-bold text-primary">Statistics</h1>
          <div className="w-24"></div>
        </header>

        <div className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>Statistics dashboard coming soon!</p>
            <p>Here you'll be able to view:</p>
            <ul className="mt-4 space-y-2">
              <li>• Games won/lost</li>
              <li>• Math problem accuracy</li>
              <li>• Average solving time</li>
              <li>• Favorite chess openings</li>
              <li>• Progress over time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
