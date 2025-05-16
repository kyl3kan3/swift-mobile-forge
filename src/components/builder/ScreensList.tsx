
import { AppScreen } from "@/types/appBuilder";
import { Button } from "@/components/ui/button";
import { Smartphone, Plus } from "lucide-react";

interface ScreensListProps {
  screens: AppScreen[];
  activeScreenId: string | null;
  onSelectScreen: (id: string) => void;
  onAddScreen: () => void;
}

export default function ScreensList({ 
  screens, 
  activeScreenId, 
  onSelectScreen,
  onAddScreen 
}: ScreensListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Screens</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onAddScreen}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-1">
        {screens.map((screen) => (
          <Button
            key={screen.id}
            variant={screen.id === activeScreenId ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              screen.id === activeScreenId ? "bg-secondary" : ""
            }`}
            onClick={() => onSelectScreen(screen.id)}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            {screen.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
