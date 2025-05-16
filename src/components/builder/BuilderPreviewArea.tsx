
import { AppScreen, PlatformType } from "@/types/appBuilder";
import PhonePreview from "@/components/builder/PhonePreview";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

interface BuilderPreviewAreaProps {
  activeScreen: AppScreen | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  platform: PlatformType;
}

export default function BuilderPreviewArea({
  activeScreen,
  onDragOver,
  onDrop,
  platform
}: BuilderPreviewAreaProps) {
  const [activeView, setActiveView] = useState<'ios' | 'android'>('ios');
  
  return (
    <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8">
      {platform === "both" && (
        <div className="mb-4 flex gap-2 bg-white p-2 rounded-lg shadow-sm">
          <Button 
            variant={activeView === "ios" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveView("ios")}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            iOS Preview
          </Button>
          <Button 
            variant={activeView === "android" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveView("android")}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Android Preview
          </Button>
        </div>
      )}
      
      <PhonePreview
        activeScreen={activeScreen}
        onDragOver={onDragOver}
        onDrop={onDrop}
        platform={platform === "both" ? activeView : platform}
      />
    </div>
  );
}
