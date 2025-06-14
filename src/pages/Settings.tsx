
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <div className="w-24"></div>
        </header>

        <div className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>Settings panel coming soon!</p>
            <p>Here you'll be able to configure:</p>
            <ul className="mt-4 space-y-2">
              <li>• Math difficulty level</li>
              <li>• AI opponent strength</li>
              <li>• Sound preferences</li>
              <li>• Visual themes</li>
              <li>• Time limits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
