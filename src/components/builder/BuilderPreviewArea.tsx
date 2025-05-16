
import { AppScreen, PlatformType } from "@/types/appBuilder";
import PhonePreview from "@/components/builder/PhonePreview";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, TabletSmartphone } from "lucide-react";

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
  const [showBothDevices, setShowBothDevices] = useState<boolean>(false);
  
  // Reset to iOS view when platform changes from single to both
  useEffect(() => {
    if (platform === "both") {
      setActiveView('ios');
    }
  }, [platform]);

  return (
    <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8">
      {platform === "both" && (
        <div className="mb-6 flex gap-2">
          <div className="bg-white p-2 rounded-lg shadow-sm flex items-center gap-2">
            <Button 
              variant={activeView === "ios" ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                setActiveView("ios");
                setShowBothDevices(false);
              }}
              className={activeView === "ios" ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              iOS
            </Button>
            <Button 
              variant={activeView === "android" ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                setActiveView("android");
                setShowBothDevices(false);
              }}
              className={activeView === "android" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Android
            </Button>
            <Button 
              variant={showBothDevices ? "default" : "outline"} 
              size="sm"
              onClick={() => setShowBothDevices(!showBothDevices)}
              className={showBothDevices ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              <TabletSmartphone className="mr-2 h-4 w-4" />
              Both
            </Button>
          </div>
        </div>
      )}

      <div className={`flex ${showBothDevices ? 'gap-8' : ''}`}>
        {(platform !== "both" || !showBothDevices) && (
          <PhonePreview
            activeScreen={activeScreen}
            onDragOver={onDragOver}
            onDrop={onDrop}
            platform={platform === "both" ? activeView : platform}
          />
        )}
        
        {platform === "both" && showBothDevices && (
          <>
            <div className="transform -rotate-2">
              <PhonePreview
                activeScreen={activeScreen}
                onDragOver={onDragOver}
                onDrop={onDrop}
                platform="ios"
              />
            </div>
            <div className="transform rotate-2">
              <PhonePreview
                activeScreen={activeScreen}
                onDragOver={onDragOver}
                onDrop={onDrop}
                platform="android"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
